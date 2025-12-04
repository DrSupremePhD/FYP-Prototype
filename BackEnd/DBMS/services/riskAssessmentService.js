// riskAssessmentService.js
const { run, get, all } = require('../db/db');

const riskAssessmentService = {
  /**
   * Create a new risk assessment
   * @param {Object} assessmentData - Assessment data
   * @returns {Promise<Object>} Created assessment
   */
  async createAssessment(assessmentData) {
    const { userId, overallRisk, diseaseName, matchCount, matchedGenes, riskPercentage } = assessmentData;
    
    const id = 'risk_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const createdAt = new Date().toISOString();
    
    await run(`
      INSERT INTO risk_assessments (
        id, user_id, overall_risk, disease_name, match_count, 
        matched_genes, risk_percentage, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      userId,
      overallRisk,
      diseaseName || null,
      matchCount || 0,
      JSON.stringify(matchedGenes || []),
      riskPercentage || overallRisk,
      createdAt
    ]);
    
    return {
      id,
      userId,
      overallRisk,
      diseaseName,
      matchCount,
      matchedGenes,
      riskPercentage,
      createdAt
    };
  },

  /**
   * Get all assessments for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of assessments
   */
  async getAssessmentsByUser(userId) {
    const assessments = await all(`
      SELECT 
        id,
        user_id as userId,
        overall_risk as overallRisk,
        disease_name as diseaseName,
        match_count as matchCount,
        matched_genes as matchedGenes,
        risk_percentage as riskPercentage,
        created_at as createdAt
      FROM risk_assessments
      WHERE user_id = ?
      ORDER BY created_at DESC
    `, [userId]);
    
    // Parse matched_genes JSON string back to array
    return assessments.map(a => ({
      ...a,
      matchedGenes: JSON.parse(a.matchedGenes || '[]')
    }));
  },

  /**
   * Get a specific assessment by ID
   * @param {string} assessmentId - Assessment ID
   * @returns {Promise<Object|null>} Assessment or null if not found
   */
  async getAssessmentById(assessmentId) {
    const assessment = await get(`
      SELECT 
        id,
        user_id as userId,
        overall_risk as overallRisk,
        disease_name as diseaseName,
        match_count as matchCount,
        matched_genes as matchedGenes,
        risk_percentage as riskPercentage,
        created_at as createdAt
      FROM risk_assessments
      WHERE id = ?
    `, [assessmentId]);
    
    if (!assessment) return null;
    
    return {
      ...assessment,
      matchedGenes: JSON.parse(assessment.matchedGenes || '[]')
    };
  },

  /**
   * Delete an assessment
   * @param {string} assessmentId - Assessment ID
   * @returns {Promise<boolean>} True if deleted, false if not found
   */
  async deleteAssessment(assessmentId) {
    const result = await run('DELETE FROM risk_assessments WHERE id = ?', [assessmentId]);
    return result.changes > 0;
  },

  /**
   * Get latest assessment for a user
   * @param {string} userId - User ID
   * @returns {Promise<Object|null>} Latest assessment or null
   */
  async getLatestAssessment(userId) {
    const assessment = await get(`
      SELECT 
        id,
        user_id as userId,
        overall_risk as overallRisk,
        disease_name as diseaseName,
        match_count as matchCount,
        matched_genes as matchedGenes,
        risk_percentage as riskPercentage,
        created_at as createdAt
      FROM risk_assessments
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 1
    `, [userId]);
    
    if (!assessment) return null;
    
    return {
      ...assessment,
      matchedGenes: JSON.parse(assessment.matchedGenes || '[]')
    };
  }
};

module.exports = riskAssessmentService;