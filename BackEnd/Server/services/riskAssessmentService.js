// riskAssessmentService.js
const { run, get, all } = require('../../DBMS/db/db');

const riskAssessmentService = {
  /**
   * Create a new risk assessment
   * @param {Object} assessmentData - Assessment data
   * @returns {Promise<Object>} Created assessment
   */
  async createAssessment(assessmentData) {
    const { userId, overallRisk, diseaseId, matchCount, matchedGenes, riskPercentage } = assessmentData;
    
    const id = 'risk_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const createdAt = new Date().toISOString();
    
    await run(`
      INSERT INTO risk_assessments (
        id, user_id, overall_risk, disease_id, match_count, 
        matched_genes, risk_percentage, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      userId,
      overallRisk,
      diseaseId || null,
      matchCount || 0,
      JSON.stringify(matchedGenes || []),
      riskPercentage || overallRisk,
      createdAt
    ]);
    
    return {
      id,
      userId,
      overallRisk,
      diseaseId,
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
        disease_id as diseaseId,
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
        disease_id as diseaseId,
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
        disease_id as diseaseId,
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
  },

  // ===================================
  // RESEARCHER ANALYTICS METHODS
  // ===================================

  /**
   * Get all assessments from users who have consented to research data sharing
   * @returns {Promise<Array>} Array of assessments from consented users
   */
  async getConsentedAssessments() {
    const assessments = await all(`
      SELECT 
        ra.id,
        ra.user_id as userId,
        ra.overall_risk as overallRisk,
        ra.disease_id as diseaseId,
        ra.match_count as matchCount,
        ra.matched_genes as matchedGenes,
        ra.risk_percentage as riskPercentage,
        ra.created_at as createdAt
      FROM risk_assessments ra
      INNER JOIN users u ON ra.user_id = u.id
      WHERE u.research_consent = 1
      ORDER BY ra.created_at DESC
    `);
    
    return assessments.map(a => ({
      ...a,
      matchedGenes: JSON.parse(a.matchedGenes || '[]')
    }));
  },

  /**
   * Get disease statistics with assessment counts from consented users
   * Groups by disease and includes hospital info
   * @returns {Promise<Array>} Array of disease stats
   */
  async getDiseaseStatisticsForResearch() {
    const stats = await all(`
      SELECT 
        d.id as diseaseId,
        d.disease_name as diseaseName,
        d.disease_code as diseaseCode,
        d.description,
        d.hospital_id as hospitalId,
        u.organization_name as hospitalName,
        u.first_name as hospitalFirstName,
        u.last_name as hospitalLastName,
        COUNT(ra.id) as assessmentCount,
        AVG(ra.risk_percentage) as avgRiskPercentage,
        MAX(ra.risk_percentage) as maxRiskPercentage,
        MIN(ra.risk_percentage) as minRiskPercentage,
        SUM(CASE WHEN ra.risk_percentage >= 70 THEN 1 ELSE 0 END) as highRiskCount
      FROM diseases d
      LEFT JOIN users u ON d.hospital_id = u.id
      LEFT JOIN risk_assessments ra ON d.id = ra.disease_id
        AND ra.user_id IN (SELECT id FROM users WHERE research_consent = 1)
      GROUP BY d.id, d.disease_name, d.disease_code, d.description, 
               d.hospital_id, u.organization_name, u.first_name, u.last_name
      ORDER BY assessmentCount DESC, d.disease_name ASC
    `);
    
    return stats.map(s => ({
      ...s,
      hospitalName: s.hospitalName || `${s.hospitalFirstName || ''} ${s.hospitalLastName || ''}`.trim() || 'Unknown Hospital',
      avgRiskPercentage: s.avgRiskPercentage ? Math.round(s.avgRiskPercentage * 10) / 10 : null
    }));
  },

  /**
   * Get detailed analytics for a specific disease (from consented users only)
   * @param {string} diseaseId - Disease ID
   * @returns {Promise<Object>} Disease analytics
   */
  async getDiseaseAnalytics(diseaseId) {
    // Get basic disease info
    const diseaseInfo = await get(`
      SELECT 
        d.id as diseaseId,
        d.disease_name as diseaseName,
        d.disease_code as diseaseCode,
        d.description,
        d.constant,
        d.hospital_id as hospitalId,
        u.organization_name as hospitalName,
        u.first_name as hospitalFirstName,
        u.last_name as hospitalLastName
      FROM diseases d
      LEFT JOIN users u ON d.hospital_id = u.id
      WHERE d.id = ?
    `, [diseaseId]);

    if (!diseaseInfo) return null;

    // Get all assessments for this disease from consented users
    const assessments = await all(`
      SELECT 
        ra.id,
        ra.overall_risk as overallRisk,
        ra.match_count as matchCount,
        ra.matched_genes as matchedGenes,
        ra.risk_percentage as riskPercentage,
        ra.created_at as createdAt,
        u.date_of_birth as dateOfBirth
      FROM risk_assessments ra
      INNER JOIN users u ON ra.user_id = u.id
      WHERE ra.disease_id = ?
        AND u.research_consent = 1
      ORDER BY ra.created_at DESC
    `, [diseaseId]);

    // Calculate statistics
    const totalAssessments = assessments.length;
    const riskPercentages = assessments.map(a => a.riskPercentage).filter(r => r !== null);
    
    const avgRisk = riskPercentages.length > 0 
      ? Math.round((riskPercentages.reduce((sum, r) => sum + r, 0) / riskPercentages.length) * 10) / 10
      : null;
    
    const highRiskCount = riskPercentages.filter(r => r >= 70).length;
    const mediumRiskCount = riskPercentages.filter(r => r >= 40 && r < 70).length;
    const lowRiskCount = riskPercentages.filter(r => r < 40).length;

    // Risk distribution for charts
    const riskDistribution = {
      low: lowRiskCount,
      medium: mediumRiskCount,
      high: highRiskCount
    };

    // Monthly trend data (last 6 months)
    const monthlyTrend = await all(`
      SELECT 
        strftime('%Y-%m', ra.created_at) as month,
        COUNT(*) as count,
        AVG(ra.risk_percentage) as avgRisk
      FROM risk_assessments ra
      INNER JOIN users u ON ra.user_id = u.id
      WHERE ra.disease_id = ?
        AND u.research_consent = 1
        AND ra.created_at >= date('now', '-6 months')
      GROUP BY strftime('%Y-%m', ra.created_at)
      ORDER BY month ASC
    `, [diseaseId]);

    return {
      ...diseaseInfo,
      hospitalName: diseaseInfo.hospitalName || `${diseaseInfo.hospitalFirstName || ''} ${diseaseInfo.hospitalLastName || ''}`.trim() || 'Unknown Hospital',
      statistics: {
        totalAssessments,
        avgRisk,
        highRiskCount,
        mediumRiskCount,
        lowRiskCount,
        riskDistribution
      },
      monthlyTrend: monthlyTrend.map(t => ({
        month: t.month,
        count: t.count,
        avgRisk: t.avgRisk ? Math.round(t.avgRisk * 10) / 10 : 0
      })),
      // Return anonymized assessments (no user IDs)
      recentAssessments: assessments.slice(0, 20).map(a => ({
        id: a.id,
        riskPercentage: a.riskPercentage,
        matchCount: a.matchCount,
        matchedGenes: JSON.parse(a.matchedGenes || '[]'),
        createdAt: a.createdAt,
        dateOfBirth: a.dateOfBirth
      }))
    };
  },

  /**
   * Search disease statistics by disease name or hospital name
   * @param {string} searchTerm - Search term
   * @returns {Promise<Array>} Matching disease stats
   */
  async searchDiseaseStatistics(searchTerm) {
    const term = `%${searchTerm}%`;
    
    const stats = await all(`
      SELECT 
        d.id as diseaseId,
        d.disease_name as diseaseName,
        d.disease_code as diseaseCode,
        d.description,
        d.hospital_id as hospitalId,
        u.organization_name as hospitalName,
        u.first_name as hospitalFirstName,
        u.last_name as hospitalLastName,
        COUNT(ra.id) as assessmentCount,
        AVG(ra.risk_percentage) as avgRiskPercentage,
        SUM(CASE WHEN ra.risk_percentage >= 70 THEN 1 ELSE 0 END) as highRiskCount
      FROM diseases d
      LEFT JOIN users u ON d.hospital_id = u.id
      LEFT JOIN risk_assessments ra ON d.id = ra.disease_id
        AND ra.user_id IN (SELECT id FROM users WHERE research_consent = 1)
      WHERE d.disease_name LIKE ?
         OR d.disease_code LIKE ?
         OR u.organization_name LIKE ?
         OR (u.first_name || ' ' || u.last_name) LIKE ?
      GROUP BY d.id, d.disease_name, d.disease_code, d.description, 
               d.hospital_id, u.organization_name, u.first_name, u.last_name
      ORDER BY assessmentCount DESC, d.disease_name ASC
    `, [term, term, term, term]);
    
    return stats.map(s => ({
      ...s,
      hospitalName: s.hospitalName || `${s.hospitalFirstName || ''} ${s.hospitalLastName || ''}`.trim() || 'Unknown Hospital',
      avgRiskPercentage: s.avgRiskPercentage ? Math.round(s.avgRiskPercentage * 10) / 10 : null
    }));
  },

  /**
   * Get recent assessments for researcher dashboard (from consented users only)
   * Includes disease name, hospital name, age, risk level, date
   * @param {number} limit - Number of assessments to return
   * @returns {Promise<Array>} Array of recent assessments
   */
  async getRecentAssessmentsForResearcher(limit = 6) {
    const assessments = await all(`
      SELECT 
        ra.id,
        ra.risk_percentage as riskPercentage,
        ra.match_count as matchCount,
        ra.created_at as createdAt,
        u.date_of_birth as dateOfBirth,
        d.disease_name as diseaseName,
        d.disease_code as diseaseCode,
        h.organization_name as hospitalName,
        h.first_name as hospitalFirstName,
        h.last_name as hospitalLastName
      FROM risk_assessments ra
      INNER JOIN users u ON ra.user_id = u.id
      LEFT JOIN diseases d ON ra.disease_id = d.id
      LEFT JOIN users h ON d.hospital_id = h.id
      WHERE u.research_consent = 1
      ORDER BY ra.created_at DESC
      LIMIT ?
    `, [limit]);

    return assessments.map(a => ({
      id: a.id,
      riskPercentage: a.riskPercentage,
      matchCount: a.matchCount,
      createdAt: a.createdAt,
      dateOfBirth: a.dateOfBirth,
      diseaseName: a.diseaseName || 'Unknown Disease',
      diseaseCode: a.diseaseCode,
      hospitalName: a.hospitalName || 
        `${a.hospitalFirstName || ''} ${a.hospitalLastName || ''}`.trim() || 
        'Unknown Hospital'
    }));
  }

};

module.exports = riskAssessmentService;