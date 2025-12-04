// ===================================
// PRIVAGENE - API MOCK
// Simulated backend API endpoints
// ===================================

// BACKEND_INTEGRATION: Replace all functions in this file with real fetch() calls to your backend API

const API = {
    // Helper to simulate network delay
    delay(ms = 500) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    // Helper to simulate random failures (for testing error handling)
    randomFailure(probability = 0.05) {
        if (Math.random() < probability) {
            throw new Error('Network error');
        }
    },

    // ===================================
    // GENE UPLOAD & PROCESSING
    // ===================================

    async uploadGeneFile(file, userId) {
        // BACKEND_INTEGRATION: Replace with: 
        // const formData = new FormData();
        // formData.append('file', file);
        // return fetch('/api/gene-uploads', { method: 'POST', body: formData })

        await this.delay(1500); // Simulate upload time

        // Validate file
        const allowedTypes = ['.vcf', '.txt', '.csv', '.fasta'];
        const fileExt = file.name.substring(file.name.lastIndexOf('.'));

        if (!allowedTypes.includes(fileExt.toLowerCase())) {
            throw new Error('Invalid file format. Allowed: VCF, TXT, CSV, FASTA');
        }

        // Simulate file encryption and storage
        const upload = {
            userId,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            encryptedBlobId: 'encrypted_' + this.generateId(), // Simulated encrypted blob ID
            status: 'processed'
        };

        return Storage.addGeneUpload(upload);
    },

    async getGeneUploads(userId) {
        // BACKEND_INTEGRATION: Replace with: fetch(`/api/gene-uploads?userId=${userId}`)
        await this.delay();
        return Storage.getGeneUploads(userId);
    },

    // ===================================
    // DISEASE RISK ASSESSMENT (PSI)
    // ===================================

    async computeRiskAssessment(userId, selectedCategories) {
        // BACKEND_INTEGRATION: Replace with: fetch('/api/risk-assessment/compute', {
        //   method: 'POST',
        //   body: JSON.stringify({ userId, categories: selectedCategories })
        // })

        await this.delay(2000); // Simulate PSI computation time

        // Mock risk calculation
        const results = selectedCategories.map(category => {
            const riskPercentage = Math.floor(Math.random() * 100); // Random risk 0-100%
            let riskLevel = 'low';
            if (riskPercentage > 70) riskLevel = 'high';
            else if (riskPercentage > 40) riskLevel = 'medium';

            return {
                category,
                riskPercentage,
                riskLevel,
                affectedGenes: this.getMockAffectedGenes()
            };
        });

        const assessment = {
            userId,
            results,
            overallRisk: Math.floor(results.reduce((sum, r) => sum + r.riskPercentage, 0) / results.length),
            computedAt: new Date().toISOString()
        };

        // Store in localStorage
        const savedAssessment = Storage.addRiskAssessment(assessment);

        // Upload assessment results to backend database
        if (window.BackendAPI && window.BackendAPI.config.enabled) {
            try {
                // Create assessment document files in multiple formats
                const jsonBlob = BackendAPI.createAssessmentFile(savedAssessment, 'json');
                const csvBlob = BackendAPI.createAssessmentFile(savedAssessment, 'csv');
                const txtBlob = BackendAPI.createAssessmentFile(savedAssessment, 'txt');

                // Upload JSON version
                const jsonFile = new File([jsonBlob], `risk_assessment_${savedAssessment.id}.json`, { type: 'application/json' });
                const jsonResult = await BackendAPI.uploadRiskAssessment(jsonFile, userId, savedAssessment.id);

                // Upload CSV version
                const csvFile = new File([csvBlob], `risk_assessment_${savedAssessment.id}.csv`, { type: 'text/csv' });
                const csvResult = await BackendAPI.uploadRiskAssessment(csvFile, userId, savedAssessment.id);

                // Store document IDs with the assessment
                savedAssessment.documentIds = {
                    json: jsonResult.id,
                    csv: csvResult.id
                };

                // Update localStorage with document IDs
                Storage.updateRiskAssessment(savedAssessment.id, { documentIds: savedAssessment.documentIds });

                console.log('Risk assessment documents uploaded to backend:', savedAssessment.documentIds);
            } catch (error) {
                console.warn('Failed to upload assessment to backend (continuing anyway):', error);
                // Don't fail the whole operation if backend upload fails
            }
        }

        return savedAssessment;
    },

    async getRiskAssessments(userId) {
        // BACKEND_INTEGRATION: Replace with: fetch(`/api/risk-assessments?userId=${userId}`)
        await this.delay();
        return Storage.getRiskAssessments(userId);
    },

    async getRiskExplanation(assessmentId) {
        // BACKEND_INTEGRATION: Replace with: fetch(`/api/risk-assessments/${assessmentId}/explanation`)
        await this.delay();

        return {
            interpretation: 'Based on your genetic profile, the risk assessment indicates...',
            recommendations: [
                'Consult with a genetic counselor',
                'Consider regular screening',
                'Maintain a healthy lifestyle'
            ],
            geneDetails: [
                { gene: 'BRCA1', impact: 'High', description: 'Associated with breast and ovarian cancer' }
            ]
        };
    },

    getMockAffectedGenes() {
        const genes = ['BRCA1', 'BRCA2', 'TP53', 'APOE4', 'HFE'];
        const count = Math.floor(Math.random() * 3) + 1;
        return genes.slice(0, count);
    },

    // ===================================
    // APPOINTMENTS
    // ===================================

    async getAvailableSlots(hospitalId, date) {
        // BACKEND_INTEGRATION: Replace with: fetch(`/api/appointments/slots?hospitalId=${hospitalId}&date=${date}`)
        await this.delay();

        // Mock available time slots
        const slots = [];
        for (let hour = 9; hour < 17; hour++) {
            slots.push({
                id: this.generateId(),
                time: `${hour}:00`,
                available: Math.random() > 0.3 // 70% chance of being available
            });
        }

        return slots;
    },

    async bookAppointment(patientId, hospitalId, slot, date, reason) {
        // BACKEND_INTEGRATION: Replace with: fetch('/api/appointments', {
        //   method: 'POST',
        //   body: JSON.stringify({ patientId, hospitalId, slot, date, reason })
        // })

        await this.delay();

        const appointment = {
            patientId,
            hospitalId,
            slot,
            date,
            reason,
            status: 'confirmed'
        };

        return Storage.addAppointment(appointment);
    },

    async getAppointments(userId, role) {
        // BACKEND_INTEGRATION: Replace with: fetch(`/api/appointments?userId=${userId}&role=${role}`)
        await this.delay();
        return Storage.getAppointments(userId, role);
    },

    async cancelAppointment(appointmentId) {
        // BACKEND_INTEGRATION: Replace with: fetch(`/api/appointments/${appointmentId}`, {
        //   method: 'DELETE'
        // })

        await this.delay();
        Storage.deleteAppointment(appointmentId);
        return { message: 'Appointment cancelled successfully' };
    },

    async updateAppointmentStatus(appointmentId, status) {
        // BACKEND_INTEGRATION: Replace with: fetch(`/api/appointments/${appointmentId}/status`, {
        //   method: 'PUT',
        //   body: JSON.stringify({ status })
        // })

        await this.delay();
        return Storage.updateAppointment(appointmentId, { status });
    },

    // ===================================
    // GENE DATABASE MANAGEMENT
    // ===================================

    async addGene(geneData) {
        // BACKEND_INTEGRATION: Replace with: fetch('/api/genes', {
        //   method: 'POST',
        //   body: JSON.stringify(geneData)
        // })

        await this.delay();

        // Validate gene data
        if (!geneData.name || !geneData.type || !geneData.coefficient) {
            throw new Error('Missing required fields: name, type, coefficient');
        }

        return Storage.addGene(geneData);
    },

    async getGenes(filters = {}) {
        // BACKEND_INTEGRATION: Replace with: fetch('/api/genes?' + new URLSearchParams(filters))
        await this.delay();

        let genes = Storage.getGenes();

        // Apply filters
        if (filters.category) {
            genes = genes.filter(g => g.categories && g.categories.includes(filters.category));
        }
        if (filters.search) {
            const search = filters.search.toLowerCase();
            genes = genes.filter(g => g.name.toLowerCase().includes(search));
        }

        return genes;
    },

    async updateGene(geneId, updates) {
        // BACKEND_INTEGRATION: Replace with: fetch(`/api/genes/${geneId}`, {
        //   method: 'PUT',
        //   body: JSON.stringify(updates)
        // })

        await this.delay();
        return Storage.updateGene(geneId, updates);
    },

    async deleteGene(geneId) {
        // BACKEND_INTEGRATION: Replace with: fetch(`/api/genes/${geneId}`, { method: 'DELETE' })
        await this.delay();
        Storage.deleteGene(geneId);
        return { message: 'Gene deleted successfully' };
    },

    async categorizeGenes(geneIds, category) {
        // BACKEND_INTEGRATION: Replace with: fetch('/api/genes/categorize', {
        //   method: 'POST',
        //   body: JSON.stringify({ geneIds, category })
        // })

        await this.delay();

        geneIds.forEach(id => {
            const gene = Storage.getGenes().find(g => g.id === id);
            if (gene) {
                const categories = gene.categories || [];
                if (!categories.includes(category)) {
                    categories.push(category);
                    Storage.updateGene(id, { categories });
                }
            }
        });

        return { message: 'Genes categorized successfully' };
    },

    // ===================================
    // ORGANIZATION MANAGEMENT
    // ===================================

    async registerOrganization(orgData) {
        // BACKEND_INTEGRATION: Replace with: fetch('/api/organizations', {
        //   method: 'POST',
        //   body: JSON.stringify(orgData)
        // })

        await this.delay();
        return Storage.addOrganization(orgData);
    },

    async getOrganizations(status = null) {
        // BACKEND_INTEGRATION: Replace with: fetch('/api/organizations?' + new URLSearchParams({ status }))
        await this.delay();

        let orgs = Storage.getOrganizations();
        if (status) {
            orgs = orgs.filter(o => o.status === status);
        }

        return orgs;
    },

    async approveOrganization(orgId) {
        // BACKEND_INTEGRATION: Replace with: fetch(`/api/organizations/${orgId}/approve`, {
        //   method: 'POST'
        // })

        await this.delay();
        return Storage.updateOrganization(orgId, { status: 'approved' });
    },

    async rejectOrganization(orgId, reason) {
        // BACKEND_INTEGRATION: Replace with: fetch(`/api/organizations/${orgId}/reject`, {
        //   method: 'POST',
        //   body: JSON.stringify({ reason })
        // })

        await this.delay();
        return Storage.updateOrganization(orgId, { status: 'rejected', rejectionReason: reason });
    },

    // ===================================
    // ANALYTICS & RESEARCH
    // ===================================

    async getAnalytics(filters = {}) {
        // BACKEND_INTEGRATION: Replace with: fetch('/api/analytics', {
        //   method: 'POST',
        //   body: JSON.stringify(filters)
        // })

        await this.delay(1000);

        // Get anonymized data
        const rawData = Storage.getAnalyticsData(filters);

        // Strip identifying information (for privacy)
        return rawData.map(({ id, userId, ...anonymizedData }) => anonymizedData);
    },

    async exportAnalytics(filters = {}, format = 'csv') {
        // BACKEND_INTEGRATION: Replace with: fetch('/api/analytics/export', {
        //   method: 'POST',
        //   body: JSON.stringify({ filters, format })
        // })

        await this.delay(1500);

        const data = await this.getAnalytics(filters);

        if (format === 'csv') {
            return this.convertToCSV(data);
        } else if (format === 'json') {
            return JSON.stringify(data, null, 2);
        }

        throw new Error('Unsupported export format');
    },

    convertToCSV(data) {
        if (data.length === 0) return '';

        const headers = Object.keys(data[0]);
        const csvRows = [headers.join(',')];

        data.forEach(row => {
            const values = headers.map(header => {
                const value = row[header];
                return typeof value === 'string' ? `"${value}"` : value;
            });
            csvRows.push(values.join(','));
        });

        return csvRows.join('\n');
    },

    // ===================================
    // DISEASE CATEGORIES
    // ===================================

    async getDiseaseCategories() {
        // BACKEND_INTEGRATION: Replace with: fetch('/api/disease-categories')
        await this.delay();
        return Storage.get('disease_categories') || [];
    },

    // ===================================
    // CONTACT SUPPORT
    // ===================================

    async submitContactForm(formData) {
        // BACKEND_INTEGRATION: Replace with: fetch('/api/contact', {
        //   method: 'POST',
        //   body: JSON.stringify(formData)
        // })

        await this.delay(800);

        // Mock ticket creation
        const ticket = {
            ...formData,
            ticketId: 'TICKET-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            status: 'open',
            createdAt: new Date().toISOString()
        };

        // Store in localStorage
        const tickets = JSON.parse(localStorage.getItem('privagene_support_tickets') || '[]');
        tickets.push(ticket);
        localStorage.setItem('privagene_support_tickets', JSON.stringify(tickets));

        return ticket;
    },

    // ===================================
    // AUDIT LOGS (System Admin)
    // ===================================

    async getAuditLogs(filters = {}) {
        // BACKEND_INTEGRATION: Replace with: fetch('/api/audit-logs?' + new URLSearchParams(filters))
        await this.delay(1000);

        // Get or create audit logs
        let logs = JSON.parse(localStorage.getItem('privagene_audit_logs') || '[]');

        // Generate some mock logs if none exist
        if (logs.length === 0) {
            const users = Storage.get('users') || [];
            const actions = ['login', 'logout', 'upload_gene', 'compute_risk', 'book_appointment', 'update_profile'];

            for (let i = 0; i < 50; i++) {
                const randomUser = users[Math.floor(Math.random() * users.length)];
                logs.push({
                    id: this.generateId(),
                    userId: randomUser?.id || 'unknown',
                    userEmail: randomUser?.email || 'unknown@example.com',
                    action: actions[Math.floor(Math.random() * actions.length)],
                    timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
                    ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
                    details: 'Action performed successfully'
                });
            }
            localStorage.setItem('privagene_audit_logs', JSON.stringify(logs));
        }

        // Apply filters
        if (filters.userId) {
            logs = logs.filter(log => log.userId === filters.userId);
        }
        if (filters.action) {
            logs = logs.filter(log => log.action === filters.action);
        }
        if (filters.startDate) {
            logs = logs.filter(log => new Date(log.timestamp) >= new Date(filters.startDate));
        }
        if (filters.endDate) {
            logs = logs.filter(log => new Date(log.timestamp) <= new Date(filters.endDate));
        }

        // Sort by timestamp desc
        logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        return logs;
    },

    async logAction(userId, action, details = '') {
        // BACKEND_INTEGRATION: This will be handled by backend middleware automatically
        const log = {
            id: this.generateId(),
            userId,
            action,
            details,
            timestamp: new Date().toISOString(),
            ipAddress: 'simulated'
        };

        const logs = JSON.parse(localStorage.getItem('privagene_audit_logs') || '[]');
        logs.push(log);
        localStorage.setItem('privagene_audit_logs', JSON.stringify(logs));

        return log;
    },

    // ===================================
    // USER MANAGEMENT (System Admin)
    // ===================================

    async getAllUsers() {
        // BACKEND_INTEGRATION: Replace with: fetch('/api/users')
        await this.delay();
        return Storage.get('users') || [];
    },

    async suspendUser(userId, reason = '') {
        // BACKEND_INTEGRATION: Replace with: fetch(`/api/users/${userId}/suspend`, {
        //   method: 'POST',
        //   body: JSON.stringify({ reason })
        // })

        await this.delay(800);

        const user = Storage.getUserById(userId);
        if (!user) throw new Error('User not found');

        const updatedUser = Storage.updateUser(userId, {
            status: 'suspended',
            suspendedAt: new Date().toISOString(),
            suspensionReason: reason
        });

        // Log the action
        await this.logAction('system_admin', 'suspend_user', `Suspended user ${user.email}`);

        return updatedUser;
    },

    async activateUser(userId) {
        // BACKEND_INTEGRATION: Replace with: fetch(`/api/users/${userId}/activate`, { method: 'POST' })

        await this.delay(800);

        const user = Storage.getUserById(userId);
        if (!user) throw new Error('User not found');

        const updatedUser = Storage.updateUser(userId, {
            status: 'active',
            suspendedAt: null,
            suspensionReason: null
        });

        // Log the action
        await this.logAction('system_admin', 'activate_user', `Activated user ${user.email}`);

        return updatedUser;
    },

    // ===================================
    // SECURITY KEY ROTATION (System Admin)
    // ===================================

    async initiateKeyRotation() {
        // BACKEND_INTEGRATION: Replace with: fetch('/api/security/key-rotation', { method: 'POST' })

        await this.delay(3000); // Simulate long-running operation

        const rotation = {
            id: this.generateId(),
            initiatedAt: new Date().toISOString(),
            status: 'in_progress',
            progress: 0
        };

        // Store rotation in localStorage
        localStorage.setItem('privagene_active_rotation', JSON.stringify(rotation));

        // Simulate completion after delay
        setTimeout(() => {
            rotation.status = 'completed';
            rotation.progress = 100;
            rotation.completedAt = new Date().toISOString();
            localStorage.setItem('privagene_active_rotation', JSON.stringify(rotation));
        }, 5000);

        // Log the action
        await this.logAction('system_admin', 'initiate_key_rotation', 'Security key rotation initiated');

        return rotation;
    },

    async getKeyRotationStatus() {
        // BACKEND_INTEGRATION: Replace with: fetch('/api/security/key-rotation/status')

        await this.delay(300);

        const rotation = JSON.parse(localStorage.getItem('privagene_active_rotation') || 'null');
        return rotation;
    },

    async getKeyRotationHistory() {
        // BACKEND_INTEGRATION: Replace with: fetch('/api/security/key-rotation/history')

        await this.delay();

        // Return mock rotation history
        return [
            {
                id: 'rot_1',
                initiatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                completedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000 + 10000).toISOString(),
                status: 'completed',
                initiatedBy: 'System Admin'
            },
            {
                id: 'rot_2',
                initiatedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
                completedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000 + 12000).toISOString(),
                status: 'completed',
                initiatedBy: 'System Admin'
            }
        ];
    },

    // ===================================
    // UTILITIES
    // ===================================

    generateId() {
        return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
};

// Export for use in other scripts
window.API = API;
