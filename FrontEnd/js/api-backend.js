// ===================================
// PRIVAGENE - BACKEND API SERVICE
// Real backend integration for document storage and user management
// ===================================

const BackendAPI = {
    // Configuration
    config: {
        baseURL: 'http://localhost:3001',
        enabled: true // Set to false to use mock API only
    },

    // Helper to get current user info
    getCurrentUser() {
        const currentUser = Storage.getCurrentUser();
        if (!currentUser) {
            throw new Error('No user logged in');
        }
        return currentUser;
    },

    // Helper to check if backend is available
    async checkHealth() {
        if (!this.config.enabled) return false;

        try {
            const response = await fetch(`${this.config.baseURL}/api/health`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.ok;
        } catch (error) {
            console.warn('Backend not available:', error.message);
            return false;
        }
    },

    // ===================================
    // USER MANAGEMENT
    // ===================================

    /**
     * Get all users from the backend
     * @param {Object} filters - Optional filters (role, status)
     * @returns {Promise<Array>} Array of users
     */
    async getAllUsers(filters = {}) {
        if (!this.config.enabled) {
            console.log('Backend disabled, falling back to localStorage');
            return Storage.get('users') || [];
        }

        try {
            let url = `${this.config.baseURL}/api/users`;
            const params = new URLSearchParams();

            if (filters.role) params.append('role', filters.role);
            if (filters.status) params.append('status', filters.status);

            if (params.toString()) {
                url += '?' + params.toString();
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            const data = await response.json();
            console.log('Users loaded from backend:', data);
            return data.users || [];
        } catch (error) {
            console.error('Error fetching users from backend:', error);
            // Fallback to localStorage
            return Storage.get('users') || [];
        }
    },

    /**
     * Get user by ID
     * @param {string} userId - User ID
     * @returns {Promise<Object>} User object
     */
    async getUserById(userId) {
        if (!this.config.enabled) {
            return Storage.getUserById(userId);
        }

        try {
            const response = await fetch(`${this.config.baseURL}/api/users/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user');
            }

            const data = await response.json();
            return data.user;
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    },

    /**
     * Update user status (approve, suspend, activate)
     * @param {string} userId - User ID
     * @param {string} status - New status (active, suspended, pending_approval)
     * @returns {Promise<Object>} Updated user
     */
    async updateUserStatus(userId, status) {
        if (!this.config.enabled) {
            return Storage.updateUser(userId, { status });
        }

        try {
            const response = await fetch(`${this.config.baseURL}/api/users/${userId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to update user status');
            }

            const data = await response.json();
            return data.user;
        } catch (error) {
            console.error('Error updating user status:', error);
            throw error;
        }
    },

    /**
     * Suspend a user
     * @param {string} userId - User ID
     * @param {string} reason - Reason for suspension
     * @returns {Promise<Object>} Updated user
     */
    async suspendUser(userId, reason = '') {
        return await this.updateUserStatus(userId, 'suspended');
    },

    /**
     * Activate a user
     * @param {string} userId - User ID
     * @returns {Promise<Object>} Updated user
     */
    async activateUser(userId) {
        return await this.updateUserStatus(userId, 'active');
    },

    /**
     * Delete a user
     * @param {string} userId - User ID
     * @returns {Promise<boolean>} Success status
     */
    async deleteUser(userId) {
        if (!this.config.enabled) {
            Storage.deleteUser(userId);
            return true;
        }

        try {
            const response = await fetch(`${this.config.baseURL}/api/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to delete user');
            }

            return true;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    },

    /**
     * Update user profile
     * @param {string} userId - User ID
     * @param {Object} updates - Fields to update
     * @returns {Promise<Object>} Updated user
     */
    async updateUser(userId, updates) {
        if (!this.config.enabled) {
            return Storage.updateUser(userId, updates);
        }

        try {
            const response = await fetch(`${this.config.baseURL}/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updates)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to update user');
            }

            const data = await response.json();
            return data.user;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    },

    // ===================================
    // DISEASE CATEGORIES
    // ===================================

    /**
     * Get all disease categories (without genes for privacy)
     * @returns {Promise<Array>} Array of disease categories
     */
    async getDiseaseCategories() {
        if (!this.config.enabled) {
            console.log('Backend disabled, returning empty categories');
            return [];
        }

        try {
            const response = await fetch(`${this.config.baseURL}/api/disease-categories`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to load disease categories');
            }

            const categories = await response.json();
            console.log('Disease categories loaded:', categories);
            return categories;
        } catch (error) {
            console.error('Error fetching disease categories:', error);
            throw error;
        }
    },

    // ===================================
    // RISK ASSESSMENTS
    // ===================================

    /**
     * Create a new risk assessment
     * @param {Object} data - Assessment data
     * @returns {Promise<Object>} Created assessment
     */
    async createRiskAssessment(data) {
        if (!this.config.enabled) {
            console.log('Backend disabled, skipping risk assessment storage');
            return { success: true, assessment: data };
        }

        try {
            const response = await fetch(`${this.config.baseURL}/api/risk-assessments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Failed to create risk assessment');
            }

            const result = await response.json();
            console.log('Risk assessment created:', result);
            return result;
        } catch (error) {
            console.error('Error creating risk assessment:', error);
            throw error;
        }
    },

    /**
     * Get all risk assessments for a user
     * @param {string} userId - User ID
     * @returns {Promise<Array>} Array of assessments
     */
    async getRiskAssessments(userId) {
        if (!this.config.enabled) {
            console.log('Backend disabled, checking localStorage');
            const stored = localStorage.getItem('psiResult');
            if (stored) {
                const results = JSON.parse(stored);
                return results.map(r => ({
                    id: 'local_' + Date.now(),
                    userId: userId,
                    overallRisk: r.result.riskPercentage,
                    diseaseId: r.disease,
                    matchCount: r.result.matchCount,
                    matchedGenes: r.result.matches,
                    riskPercentage: r.result.riskPercentage,
                    createdAt: new Date().toISOString()
                }));
            }
            return [];
        }

        try {
            const response = await fetch(`${this.config.baseURL}/api/risk-assessments/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to get risk assessments');
            }

            const data = await response.json();
            console.log('Backend response:', data);  // Debug log
            
            // Make sure we return an array
            const assessments = data.assessments || [];
            console.log('Returning assessments:', assessments);  // Debug log
            
            return assessments;
        } catch (error) {
            console.error('Error fetching risk assessments:', error);

            // Fallback to localStorage
            console.log('Falling back to localStorage');
            const stored = localStorage.getItem('psiResult');
            if (stored) {
                const results = JSON.parse(stored);
                return results.map(r => ({
                    id: 'local_' + Date.now(),
                    userId: userId,
                    overallRisk: r.result.riskPercentage,
                    diseaseId: r.disease,
                    matchCount: r.result.matchCount,
                    matchedGenes: r.result.matches,
                    riskPercentage: r.result.riskPercentage,
                    createdAt: new Date().toISOString()
                }));
            }
            
            return [];  // Always return an array, never undefined
        }
    },

    // Generate a unique session ID for a risk assessment
    generateSessionId(userId, assessmentId) {
        return `assessment_${userId}_${assessmentId || Date.now()}`;
    },

    // ===================================
    // DOCUMENT UPLOAD
    // ===================================

    /**
     * Upload a risk assessment document to the backend
     * @param {File|Blob} file - The file to upload
     * @param {string} userId - The user ID
     * @param {string} assessmentId - The risk assessment ID (session ID)
     * @returns {Promise<{success: boolean, id: string, fileName: string, size: number}>}
     */
    async uploadRiskAssessment(file, userId, assessmentId) {
        if (!this.config.enabled) {
            console.log('Backend disabled, skipping upload');
            return { success: true, id: 'mock_' + Date.now(), fileName: file.name, size: file.size };
        }

        try {
            const user = this.getCurrentUser();
            const sessionId = this.generateSessionId(userId, assessmentId);

            const formData = new FormData();
            formData.append('file', file);
            formData.append('session_id', sessionId);

            const response = await fetch(`${this.config.baseURL}/api/documents/upload`, {
                method: 'POST',
                headers: {
                    'X-Role': user.role,
                    'X-Session-ID': sessionId
                },
                body: formData
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Upload failed');
            }

            const result = await response.json();
            console.log('Document uploaded successfully:', result);
            return result;
        } catch (error) {
            console.error('Failed to upload document:', error);
            throw error;
        }
    },

    // ===================================
    // DOCUMENT LISTING
    // ===================================

    /**
     * List all documents for a specific session (risk assessment)
     * @param {string} sessionId - The session ID (assessment ID)
     * @returns {Promise<Array>} Array of document metadata
     */
    async listRiskAssessments(sessionId) {
        if (!this.config.enabled) {
            console.log('Backend disabled, returning empty list');
            return [];
        }

        try {
            const user = this.getCurrentUser();

            const response = await fetch(`${this.config.baseURL}/api/documents?session_id=${encodeURIComponent(sessionId)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Role': user.role
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to retrieve documents');
            }

            const result = await response.json();
            console.log('Documents retrieved:', result);
            return result.documents || [];
        } catch (error) {
            console.error('Failed to list documents:', error);
            throw error;
        }
    },

    // ===================================
    // DOCUMENT DOWNLOAD
    // ===================================

    /**
     * Download a specific document by ID
     * @param {string} docId - The document ID
     * @param {string} sessionId - Optional session ID for verification
     * @returns {Promise<Blob>} The document file as a Blob
     */
    async downloadRiskAssessment(docId, sessionId = null) {
        if (!this.config.enabled) {
            throw new Error('Backend disabled');
        }

        try {
            const user = this.getCurrentUser();

            const headers = {
                'X-Role': user.role
            };

            if (sessionId) {
                headers['X-Session-ID'] = sessionId;
            }

            const response = await fetch(`${this.config.baseURL}/api/documents/${docId}/download`, {
                method: 'GET',
                headers: headers
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Download failed');
            }

            const blob = await response.blob();
            return blob;
        } catch (error) {
            console.error('Failed to download document:', error);
            throw error;
        }
    },

    /**
     * Trigger a browser download for a document
     * @param {string} docId - The document ID
     * @param {string} fileName - The file name to save as
     * @param {string} sessionId - Optional session ID
     */
    async triggerDownload(docId, fileName, sessionId = null) {
        try {
            const blob = await this.downloadRiskAssessment(docId, sessionId);

            // Create a download link and trigger it
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName || 'document';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            console.log('Document downloaded:', fileName);
        } catch (error) {
            console.error('Failed to trigger download:', error);
            alert('Failed to download document: ' + error.message);
        }
    },

    // ===================================
    // DOCUMENT DELETION (Admin only)
    // ===================================

    /**
     * Delete a document (admin/hospital_admin/system_admin only)
     * @param {string} docId - The document ID to delete
     * @returns {Promise<{success: boolean, message: string}>}
     */
    async deleteRiskAssessment(docId) {
        if (!this.config.enabled) {
            console.log('Backend disabled, simulating delete');
            return { success: true, message: 'Document deleted (mock)' };
        }

        try {
            const user = this.getCurrentUser();

            // Check if user has admin role
            if (!['hospital_admin', 'system_admin'].includes(user.role)) {
                throw new Error('Only administrators can delete documents');
            }

            const response = await fetch(`${this.config.baseURL}/api/documents/${docId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Role': user.role
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Delete failed');
            }

            const result = await response.json();
            console.log('Document deleted:', result);
            return result;
        } catch (error) {
            console.error('Failed to delete document:', error);
            throw error;
        }
    },

    // ===================================
    // UTILITY FUNCTIONS
    // ===================================

    /**
     * Create a downloadable file from assessment results
     * @param {Object} assessment - The risk assessment object
     * @param {string} format - 'json', 'csv', or 'txt'
     * @returns {Blob} The file as a Blob
     */
    createAssessmentFile(assessment, format = 'json') {
        let content = '';
        let mimeType = 'text/plain';

        if (format === 'json') {
            content = JSON.stringify(assessment, null, 2);
            mimeType = 'application/json';
        } else if (format === 'csv') {
            // Create CSV format
            const headers = ['Category', 'Risk Percentage', 'Risk Level', 'Affected Genes'];
            const rows = assessment.results.map(r => [
                r.category,
                r.riskPercentage + '%',
                r.riskLevel,
                (r.affectedGenes || []).join('; ')
            ]);

            content = [headers, ...rows].map(row => row.join(',')).join('\n');
            content = `Risk Assessment Report\nGenerated: ${assessment.computedAt}\nOverall Risk: ${assessment.overallRisk}%\n\n${content}`;
            mimeType = 'text/csv';
        } else {
            // Text format
            content = `Risk Assessment Report\n`;
            content += `Generated: ${assessment.computedAt}\n`;
            content += `Overall Risk: ${assessment.overallRisk}%\n\n`;
            content += `Results:\n`;

            assessment.results.forEach(r => {
                content += `\nCategory: ${r.category}\n`;
                content += `Risk: ${r.riskPercentage}% (${r.riskLevel})\n`;
                content += `Affected Genes: ${(r.affectedGenes || []).join(', ')}\n`;
            });

            mimeType = 'text/plain';
        }

        return new Blob([content], { type: mimeType });
    },

    // ===================================
    // GENE ENTRIES MANAGEMENT (Hospital)
    // ===================================

    /**
     * Get all gene entries for a hospital
     * @param {string} hospitalId - Hospital ID
     * @returns {Promise<Array>} Array of gene entries
     */
    async getGeneEntries(hospitalId) {
        if (!this.config.enabled) {
            console.log('Backend disabled, returning empty entries');
            return [];
        }

        try {
            const url = hospitalId 
                ? `${this.config.baseURL}/api/genes?hospital_id=${encodeURIComponent(hospitalId)}`
                : `${this.config.baseURL}/api/genes`;
                
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to get gene entries');
            }

            const data = await response.json();
            return data.entries || [];
        } catch (error) {
            console.error('Error fetching gene entries:', error);
            throw error;
        }
    },

    /**
     * Get unique diseases for a hospital
     * @param {string} hospitalId - Hospital ID
     * @returns {Promise<Array>} Array of unique diseases
     */
    async getUniqueDiseases(hospitalId) {
        if (!this.config.enabled) {
            console.log('Backend disabled, returning empty diseases');
            return [];
        }

        try {
            const response = await fetch(
                `${this.config.baseURL}/api/genes/diseases?hospital_id=${encodeURIComponent(hospitalId)}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to get diseases');
            }

            const data = await response.json();
            return data.diseases || [];
        } catch (error) {
            console.error('Error fetching diseases:', error);
            throw error;
        }
    },

    /**
     * Search gene entries
     * @param {string} hospitalId - Hospital ID
     * @param {string} searchTerm - Search term
     * @returns {Promise<Array>} Array of matching entries
     */
    async searchGeneEntries(hospitalId, searchTerm) {
        if (!this.config.enabled) {
            console.log('Backend disabled');
            return [];
        }

        try {
            const response = await fetch(
                `${this.config.baseURL}/api/genes/search?hospital_id=${encodeURIComponent(hospitalId)}&q=${encodeURIComponent(searchTerm)}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to search gene entries');
            }

            const data = await response.json();
            return data.entries || [];
        } catch (error) {
            console.error('Error searching gene entries:', error);
            throw error;
        }
    },

    /**
     * Get a single gene entry by ID
     * @param {string} id - Gene entry ID
     * @returns {Promise<Object>} Gene entry
     */
    async getGeneEntry(id) {
        if (!this.config.enabled) {
            throw new Error('Backend disabled');
        }

        try {
            const response = await fetch(`${this.config.baseURL}/api/genes/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to get gene entry');
            }

            const data = await response.json();
            return data.entry;
        } catch (error) {
            console.error('Error fetching gene entry:', error);
            throw error;
        }
    },

    /**
     * Create a new gene entry
     * @param {Object} data - Gene entry data
     * @returns {Promise<Object>} Created gene entry
     */
    async createGeneEntry(data) {
        if (!this.config.enabled) {
            console.log('Backend disabled, skipping gene entry creation');
            return { success: false };
        }

        try {
            const response = await fetch(`${this.config.baseURL}/api/genes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create gene entry');
            }

            const result = await response.json();
            console.log('Gene entry created:', result);
            return result;
        } catch (error) {
            console.error('Error creating gene entry:', error);
            throw error;
        }
    },

    /**
     * Update a gene entry
     * @param {string} id - Gene entry ID
     * @param {Object} data - Updated data
     * @returns {Promise<Object>} Updated gene entry
     */
    async updateGeneEntry(id, data) {
        if (!this.config.enabled) {
            console.log('Backend disabled, skipping gene entry update');
            return { success: false };
        }

        try {
            const response = await fetch(`${this.config.baseURL}/api/genes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to update gene entry');
            }

            const result = await response.json();
            console.log('Gene entry updated:', result);
            return result;
        } catch (error) {
            console.error('Error updating gene entry:', error);
            throw error;
        }
    },

    /**
     * Delete a gene entry
     * @param {string} id - Gene entry ID
     * @returns {Promise<Object>} Deletion result
     */
    async deleteGeneEntry(id) {
        if (!this.config.enabled) {
            console.log('Backend disabled, skipping gene entry deletion');
            return { success: false };
        }

        try {
            const response = await fetch(`${this.config.baseURL}/api/genes/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to delete gene entry');
            }

            const result = await response.json();
            console.log('Gene entry deleted:', result);
            return result;
        } catch (error) {
            console.error('Error deleting gene entry:', error);
            throw error;
        }
    },

    /**
     * Upload CSV file with gene entries
     * @param {File} file - CSV file
     * @param {string} hospitalId - Hospital ID
     * @returns {Promise<Object>} Upload result with inserted/skipped counts
     */
    async uploadGeneEntriesCSV(file, hospitalId) {
        if (!this.config.enabled) {
            console.log('Backend disabled, skipping CSV upload');
            return { success: false };
        }

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('hospital_id', hospitalId);

            const response = await fetch(`${this.config.baseURL}/api/genes/upload`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to upload CSV');
            }

            const result = await response.json();
            console.log('CSV upload result:', result);
            return result;
        } catch (error) {
            console.error('Error uploading CSV:', error);
            throw error;
        }
    },

    /**
     * Generate SHA-256 hash preview for a gene symbol (client-side)
     * This is the same algorithm used by the backend
     * @param {string} geneSymbol - Gene symbol to hash
     * @returns {Promise<string>} SHA-256 hash
     */
    async generateHashPreview(geneSymbol) {
        const encoder = new TextEncoder();
        const data = encoder.encode(geneSymbol.toUpperCase());
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
};

// Make it available as both BackendAPI and API for compatibility
window.BackendAPI = BackendAPI;
window.API = BackendAPI;


