/**
 * Gene Manager - Handles gene entry CRUD operations
 * Uses BackendAPI for server communication
 */
class GeneManager {
    constructor(user) {
        this.user = user;
        this.entries = [];
        this.filteredEntries = [];
        this.isLoading = false;
        this.useBackend = true; // Will be set to false if backend is unavailable
    }

    /**
     * Load gene entries from backend (with localStorage fallback)
     */
    async loadData() {
        this.showLoading();

        try {
            // Try backend first
            const backendHealthy = await BackendAPI.checkHealth();
            
            if (backendHealthy) {
                this.entries = await BackendAPI.getGeneEntries(this.user.id);
                this.useBackend = true;
            } else {
                // Fallback to localStorage
                console.log('Backend not available, using localStorage');
                this.entries = this.loadFromStorage();
                this.useBackend = false;
            }
            
            this.filteredEntries = [...this.entries];
            this.renderTable();
            this.updateStats();
            this.hideLoading();
            
            console.log(`Loaded ${this.entries.length} gene entries (backend: ${this.useBackend})`);
        } catch (error) {
            console.error('Error loading gene entries:', error);
            
            // Fallback to localStorage on error
            console.log('Falling back to localStorage');
            this.entries = this.loadFromStorage();
            this.useBackend = false;
            this.filteredEntries = [...this.entries];
            this.renderTable();
            this.updateStats();
            this.hideLoading();
        }
    }

    /**
     * Load entries from localStorage
     */
    loadFromStorage() {
        const stored = localStorage.getItem('geneEntries_' + this.user.id);
        return stored ? JSON.parse(stored) : [];
    }

    /**
     * Save entries to localStorage
     */
    saveToStorage() {
        localStorage.setItem('geneEntries_' + this.user.id, JSON.stringify(this.entries));
    }

    /**
     * Update statistics display
     */
    updateStats() {
        const totalEl = document.getElementById('totalEntries');
        const diseasesEl = document.getElementById('uniqueDiseases');
        const genesEl = document.getElementById('uniqueGenes');

        if (totalEl) totalEl.textContent = this.entries.length;

        // Count unique diseases
        const uniqueDiseases = new Set(this.entries.map(e => e.disease_code));
        if (diseasesEl) diseasesEl.textContent = uniqueDiseases.size;

        // Count unique genes
        const uniqueGenes = new Set(this.entries.map(e => e.gene_symbol));
        if (genesEl) genesEl.textContent = uniqueGenes.size;
    }

    /**
     * Add a new gene entry
     * @param {Object} data - Entry data
     * @returns {Promise<Object>} Created entry
     */
    async addEntry(data) {
        try {
            const geneSymbol = data.gene_symbol.toUpperCase();
            const hashValue = await BackendAPI.generateHashPreview(geneSymbol);
            
            if (this.useBackend) {
                // Use backend API
                const entryData = {
                    hospital_id: this.user.id,
                    disease_name: data.disease_name,
                    disease_code: data.disease_code,
                    gene_symbol: geneSymbol,
                    description: data.description || ''
                };

                const result = await BackendAPI.createGeneEntry(entryData);
                
                if (result.success && result.entry) {
                    this.entries.unshift(result.entry);
                    this.filteredEntries = [...this.entries];
                    this.renderTable();
                    this.updateStats();
                    this.showNotification('Gene entry added successfully', 'success');
                    return result.entry;
                }
                
                throw new Error('Failed to create entry');
            } else {
                // Use localStorage fallback
                const newEntry = {
                    id: 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                    hospital_id: this.user.id,
                    disease_name: data.disease_name,
                    disease_code: data.disease_code,
                    gene_symbol: geneSymbol,
                    description: data.description || '',
                    hash_value: hashValue,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
                
                this.entries.unshift(newEntry);
                this.saveToStorage();
                this.filteredEntries = [...this.entries];
                this.renderTable();
                this.updateStats();
                this.showNotification('Gene entry added (saved locally)', 'success');
                return newEntry;
            }
        } catch (error) {
            console.error('Error adding entry:', error);
            this.showNotification(error.message || 'Failed to add entry', 'error');
            throw error;
        }
    }

    /**
     * Update an existing gene entry
     * @param {string} id - Entry ID
     * @param {Object} data - Updated data
     * @returns {Promise<Object>} Updated entry
     */
    async updateEntry(id, data) {
        try {
            const geneSymbol = data.gene_symbol.toUpperCase();
            
            if (this.useBackend) {
                // Use backend API
                const updateData = {
                    disease_name: data.disease_name,
                    disease_code: data.disease_code,
                    gene_symbol: geneSymbol,
                    description: data.description || ''
                };

                const result = await BackendAPI.updateGeneEntry(id, updateData);
                
                if (result.success && result.entry) {
                    const index = this.entries.findIndex(e => e.id === id);
                    if (index !== -1) {
                        this.entries[index] = result.entry;
                    }
                    this.filteredEntries = [...this.entries];
                    this.renderTable();
                    this.updateStats();
                    this.showNotification('Gene entry updated successfully', 'success');
                    return result.entry;
                }
                
                throw new Error('Failed to update entry');
            } else {
                // Use localStorage fallback
                const index = this.entries.findIndex(e => e.id === id);
                if (index === -1) {
                    throw new Error('Entry not found');
                }
                
                const hashValue = await BackendAPI.generateHashPreview(geneSymbol);
                
                const updatedEntry = {
                    ...this.entries[index],
                    disease_name: data.disease_name,
                    disease_code: data.disease_code,
                    gene_symbol: geneSymbol,
                    description: data.description || '',
                    hash_value: hashValue,
                    updated_at: new Date().toISOString()
                };
                
                this.entries[index] = updatedEntry;
                this.saveToStorage();
                this.filteredEntries = [...this.entries];
                this.renderTable();
                this.updateStats();
                this.showNotification('Gene entry updated (saved locally)', 'success');
                return updatedEntry;
            }
        } catch (error) {
            console.error('Error updating entry:', error);
            this.showNotification(error.message || 'Failed to update entry', 'error');
            throw error;
        }
    }

    /**
     * Delete a gene entry
     * @param {string} id - Entry ID
     * @returns {Promise<boolean>}
     */
    async deleteEntry(id) {
        try {
            if (this.useBackend) {
                // Use backend API
                const result = await BackendAPI.deleteGeneEntry(id);
                
                if (result.success) {
                    this.entries = this.entries.filter(e => e.id !== id);
                    this.filteredEntries = this.filteredEntries.filter(e => e.id !== id);
                    this.renderTable();
                    this.updateStats();
                    this.showNotification('Gene entry deleted successfully', 'success');
                    return true;
                }
                
                throw new Error('Failed to delete entry');
            } else {
                // Use localStorage fallback
                this.entries = this.entries.filter(e => e.id !== id);
                this.saveToStorage();
                this.filteredEntries = this.filteredEntries.filter(e => e.id !== id);
                this.renderTable();
                this.updateStats();
                this.showNotification('Gene entry deleted (from local storage)', 'success');
                return true;
            }
        } catch (error) {
            console.error('Error deleting entry:', error);
            this.showNotification(error.message || 'Failed to delete entry', 'error');
            throw error;
        }
    }

    /**
     * Upload CSV file
     * @param {File} file - CSV file
     * @returns {Promise<Object>} Upload result
     */
    async uploadCSV(file) {
        try {
            if (this.useBackend) {
                // Use backend API
                const result = await BackendAPI.uploadGeneEntriesCSV(file, this.user.id);
                
                if (result.success) {
                    await this.loadData();
                    return result;
                }
                
                throw new Error(result.error || 'Upload failed');
            } else {
                // Process CSV locally
                const text = await file.text();
                const lines = text.split(/\r?\n/).filter(line => line.trim());
                
                if (lines.length < 2) {
                    throw new Error('CSV must have header and at least one data row');
                }
                
                // Parse header
                const header = lines[0].split(',').map(h => h.trim().toLowerCase());
                const requiredCols = ['disease_name', 'disease_code', 'gene_symbol'];
                const missing = requiredCols.filter(col => !header.includes(col));
                
                if (missing.length > 0) {
                    throw new Error(`Missing required columns: ${missing.join(', ')}`);
                }
                
                // Parse rows
                let inserted = 0;
                let skipped = 0;
                const errors = [];
                
                for (let i = 1; i < lines.length; i++) {
                    const values = this.parseCSVLine(lines[i]);
                    if (values.length === 0) continue;
                    
                    const entry = {};
                    header.forEach((col, idx) => {
                        entry[col] = values[idx] || '';
                    });
                    
                    if (!entry.disease_name || !entry.disease_code || !entry.gene_symbol) {
                        skipped++;
                        errors.push({ reason: `Row ${i}: Missing required fields` });
                        continue;
                    }
                    
                    // Check for duplicates
                    const geneSymbol = entry.gene_symbol.toUpperCase();
                    const exists = this.entries.some(e => 
                        e.disease_code === entry.disease_code && 
                        e.gene_symbol === geneSymbol
                    );
                    
                    if (exists) {
                        skipped++;
                        errors.push({ reason: `Row ${i}: Duplicate entry ${entry.disease_code}/${geneSymbol}` });
                        continue;
                    }
                    
                    // Create entry
                    const hashValue = await BackendAPI.generateHashPreview(geneSymbol);
                    const newEntry = {
                        id: 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                        hospital_id: this.user.id,
                        disease_name: entry.disease_name,
                        disease_code: entry.disease_code,
                        gene_symbol: geneSymbol,
                        description: entry.description || '',
                        hash_value: hashValue,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    };
                    
                    this.entries.unshift(newEntry);
                    inserted++;
                }
                
                this.saveToStorage();
                this.filteredEntries = [...this.entries];
                this.renderTable();
                this.updateStats();
                
                return {
                    success: true,
                    inserted,
                    skipped,
                    total: lines.length - 1,
                    errors
                };
            }
        } catch (error) {
            console.error('Error uploading CSV:', error);
            throw error;
        }
    }

    /**
     * Parse a CSV line (handles quoted values)
     */
    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current.trim());
        return result;
    }

    /**
     * Search entries locally
     * @param {string} searchTerm - Search term
     */
    searchEntries(searchTerm) {
        if (!searchTerm || searchTerm.trim() === '') {
            this.filteredEntries = [...this.entries];
        } else {
            const term = searchTerm.toLowerCase().trim();
            this.filteredEntries = this.entries.filter(entry =>
                entry.disease_name.toLowerCase().includes(term) ||
                entry.disease_code.toLowerCase().includes(term) ||
                entry.gene_symbol.toLowerCase().includes(term) ||
                (entry.description && entry.description.toLowerCase().includes(term))
            );
        }
        
        this.renderTable();
    }

    /**
     * Get entry by ID
     * @param {string} id - Entry ID
     * @returns {Object|null} Entry or null
     */
    getEntryById(id) {
        return this.entries.find(e => e.id === id) || null;
    }

    /**
     * Render the entries table
     */
    renderTable() {
        const tableContainer = document.getElementById('tableContainer');
        const tableBody = document.getElementById('geneTableBody');
        const emptyState = document.getElementById('emptyState');

        if (!tableContainer || !tableBody || !emptyState) return;

        if (this.filteredEntries.length === 0) {
            tableContainer.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        tableBody.innerHTML = this.filteredEntries.map(entry => `
            <tr>
                <td><strong>${this.escapeHtml(entry.disease_name)}</strong></td>
                <td><code style="background: var(--bg-tertiary); padding: 2px 6px; border-radius: 4px;">${this.escapeHtml(entry.disease_code)}</code></td>
                <td><span class="gene-tag">${this.escapeHtml(entry.gene_symbol)}</span></td>
                <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${this.escapeHtml(entry.description || '')}">
                    ${this.escapeHtml(entry.description) || '<em style="color: var(--text-tertiary);">No description</em>'}
                </td>
                <td style="white-space: nowrap;">${this.formatDate(entry.created_at)}</td>
                <td>
                    <div class="action-buttons">
                        <button onclick="modalManager.openGeneModal('${entry.id}')" 
                                class="btn btn-small btn-outline" title="Edit">
                            ✏️
                        </button>
                        <button onclick="modalManager.openDeleteModal('${entry.id}')" 
                                class="btn btn-small btn-danger" title="Delete">
                            🗑️
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        tableContainer.style.display = 'block';
        emptyState.style.display = 'none';
    }

    /**
     * Show loading state
     */
    showLoading() {
        this.isLoading = true;
        const spinner = document.getElementById('loadingSpinner');
        const tableContainer = document.getElementById('tableContainer');
        const emptyState = document.getElementById('emptyState');

        if (spinner) spinner.style.display = 'block';
        if (tableContainer) tableContainer.style.display = 'none';
        if (emptyState) emptyState.style.display = 'none';
    }

    /**
     * Hide loading state
     */
    hideLoading() {
        this.isLoading = false;
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) spinner.style.display = 'none';
    }

    /**
     * Show notification toast
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, error, warning, info)
     */
    showNotification(message, type = 'info') {
        // Use UI utility if available, otherwise create simple notification
        if (typeof UI !== 'undefined' && UI.showAlert) {
            UI.showAlert(message, type);
            return;
        }

        // Fallback notification
        const colors = {
            success: '#10B981',
            error: '#EF4444',
            warning: '#F59E0B',
            info: '#3B82F6'
        };

        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 14px 24px;
            background: ${colors[type] || colors.info};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            animation: slideIn 0.3s ease;
            font-weight: 500;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(20px)';
            notification.style.transition = 'all 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    /**
     * Format date for display
     * @param {string} dateString - ISO date string
     * @returns {string} Formatted date
     */
    formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    /**
     * Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Export globally
window.GeneManager = GeneManager;
