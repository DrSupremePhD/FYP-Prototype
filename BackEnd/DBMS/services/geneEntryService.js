// geneEntryService.js
// Service for managing disease-gene entries in the database

const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const { run, get, all } = require('../db/db');

const geneEntryService = {
  /**
   * Generate SHA-256 hash for a gene symbol
   * @param {string} geneSymbol - The gene symbol to hash
   * @returns {string} - Hex-encoded SHA-256 hash
   */
  generateHash(geneSymbol) {
    return crypto.createHash('sha256').update(geneSymbol.toUpperCase()).digest('hex');
  },

  /**
   * Create a new gene entry
   * @param {Object} data - Gene entry data
   * @returns {Promise<Object>} - Created gene entry
   */
  async createGeneEntry(data) {
    const id = uuidv4();
    const now = new Date().toISOString();
    const geneSymbolUpper = data.gene_symbol.toUpperCase();
    const hashValue = this.generateHash(geneSymbolUpper);

    const sql = `
      INSERT INTO gene_entries (
        id, hospital_id, disease_name, disease_code, gene_symbol, 
        description, hash_value, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await run(sql, [
      id,
      data.hospital_id,
      data.disease_name,
      data.disease_code,
      geneSymbolUpper,
      data.description || '',
      hashValue,
      now,
      now
    ]);

    return this.getGeneEntryById(id);
  },

  /**
   * Get gene entry by ID
   * @param {string} id - Gene entry ID
   * @returns {Promise<Object|null>} - Gene entry or null
   */
  async getGeneEntryById(id) {
    const sql = 'SELECT * FROM gene_entries WHERE id = ?';
    return get(sql, [id]);
  },

  /**
   * Get all gene entries for a hospital
   * @param {string} hospitalId - Hospital ID
   * @returns {Promise<Array>} - Array of gene entries
   */
  async getGeneEntriesByHospital(hospitalId) {
    const sql = `
      SELECT * FROM gene_entries 
      WHERE hospital_id = ? 
      ORDER BY created_at DESC
    `;
    return all(sql, [hospitalId]);
  },

  /**
   * Get all gene entries (admin view)
   * @returns {Promise<Array>} - Array of all gene entries
   */
  async getAllGeneEntries() {
    const sql = 'SELECT * FROM gene_entries ORDER BY created_at DESC';
    return all(sql);
  },

  /**
   * Get gene entries by disease code
   * @param {string} diseaseCode - Disease code
   * @param {string} hospitalId - Hospital ID (optional)
   * @returns {Promise<Array>} - Array of gene entries
   */
  async getGeneEntriesByDiseaseCode(diseaseCode, hospitalId = null) {
    let sql = 'SELECT * FROM gene_entries WHERE disease_code = ?';
    const params = [diseaseCode];
    
    if (hospitalId) {
      sql += ' AND hospital_id = ?';
      params.push(hospitalId);
    }
    
    sql += ' ORDER BY gene_symbol ASC';
    return all(sql, params);
  },

  /**
   * Update a gene entry
   * @param {string} id - Gene entry ID
   * @param {Object} data - Updated data
   * @returns {Promise<Object|null>} - Updated gene entry or null
   */
  async updateGeneEntry(id, data) {
    const existing = await this.getGeneEntryById(id);
    if (!existing) return null;

    const updates = [];
    const params = [];
    const now = new Date().toISOString();

    if (data.disease_name !== undefined) {
      updates.push('disease_name = ?');
      params.push(data.disease_name);
    }

    if (data.disease_code !== undefined) {
      updates.push('disease_code = ?');
      params.push(data.disease_code);
    }

    if (data.gene_symbol !== undefined) {
      const geneSymbolUpper = data.gene_symbol.toUpperCase();
      updates.push('gene_symbol = ?');
      params.push(geneSymbolUpper);
      
      // Regenerate hash when gene_symbol changes
      const hashValue = this.generateHash(geneSymbolUpper);
      updates.push('hash_value = ?');
      params.push(hashValue);
    }

    if (data.description !== undefined) {
      updates.push('description = ?');
      params.push(data.description);
    }

    updates.push('updated_at = ?');
    params.push(now);
    params.push(id);

    const sql = `UPDATE gene_entries SET ${updates.join(', ')} WHERE id = ?`;
    await run(sql, params);

    return this.getGeneEntryById(id);
  },

  /**
   * Delete a gene entry
   * @param {string} id - Gene entry ID
   * @returns {Promise<boolean>} - True if deleted
   */
  async deleteGeneEntry(id) {
    const existing = await this.getGeneEntryById(id);
    if (!existing) return false;

    const sql = 'DELETE FROM gene_entries WHERE id = ?';
    await run(sql, [id]);
    return true;
  },

  /**
   * Bulk insert gene entries from CSV data
   * @param {Array} entries - Array of gene entry objects
   * @param {string} hospitalId - Hospital ID
   * @returns {Promise<Object>} - Summary of inserted/skipped entries
   */
  async bulkInsertGeneEntries(entries, hospitalId) {
    const results = {
      inserted: 0,
      skipped: 0,
      errors: []
    };

    for (const entry of entries) {
      try {
        // Validate required fields
        if (!entry.disease_name || !entry.disease_code || !entry.gene_symbol) {
          results.skipped++;
          results.errors.push({
            entry: entry,
            reason: 'Missing required fields (disease_name, disease_code, gene_symbol)'
          });
          continue;
        }

        // Check for duplicates (same hospital, disease_code, gene_symbol)
        const duplicate = await this.checkDuplicateEntry(
          hospitalId,
          entry.disease_code,
          entry.gene_symbol
        );

        if (duplicate) {
          results.skipped++;
          results.errors.push({
            entry: entry,
            reason: `Duplicate entry: ${entry.disease_code}/${entry.gene_symbol}`
          });
          continue;
        }

        // Insert the entry
        await this.createGeneEntry({
          hospital_id: hospitalId,
          disease_name: entry.disease_name,
          disease_code: entry.disease_code,
          gene_symbol: entry.gene_symbol,
          description: entry.description || ''
        });

        results.inserted++;
      } catch (err) {
        results.skipped++;
        results.errors.push({
          entry: entry,
          reason: err.message
        });
      }
    }

    return results;
  },

  /**
   * Check if a duplicate entry exists
   * @param {string} hospitalId - Hospital ID
   * @param {string} diseaseCode - Disease code
   * @param {string} geneSymbol - Gene symbol
   * @returns {Promise<boolean>} - True if duplicate exists
   */
  async checkDuplicateEntry(hospitalId, diseaseCode, geneSymbol) {
    const sql = `
      SELECT id FROM gene_entries 
      WHERE hospital_id = ? AND disease_code = ? AND gene_symbol = ?
    `;
    const result = await get(sql, [hospitalId, diseaseCode, geneSymbol.toUpperCase()]);
    return !!result;
  },

  /**
   * Get unique diseases for a hospital
   * @param {string} hospitalId - Hospital ID
   * @returns {Promise<Array>} - Array of unique disease names/codes
   */
  async getUniqueDiseases(hospitalId) {
    const sql = `
      SELECT DISTINCT disease_name, disease_code, 
             COUNT(*) as gene_count,
             MIN(description) as description,
             MIN(created_at) as created_at
      FROM gene_entries 
      WHERE hospital_id = ?
      GROUP BY disease_name, disease_code
      ORDER BY disease_name ASC
    `;
    return all(sql, [hospitalId]);
  },

  /**
   * Search gene entries
   * @param {string} hospitalId - Hospital ID
   * @param {string} searchTerm - Search term
   * @returns {Promise<Array>} - Matching gene entries
   */
  async searchGeneEntries(hospitalId, searchTerm) {
    const term = `%${searchTerm}%`;
    const sql = `
      SELECT * FROM gene_entries 
      WHERE hospital_id = ? 
        AND (disease_name LIKE ? OR disease_code LIKE ? OR gene_symbol LIKE ? OR description LIKE ?)
      ORDER BY disease_name ASC, gene_symbol ASC
    `;
    return all(sql, [hospitalId, term, term, term, term]);
  }
};

module.exports = geneEntryService;

