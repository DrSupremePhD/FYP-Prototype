// server.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const { runMigrations } = require('./db/db');
const documentService = require('./services/documentService');
const userService = require('./services/userService');
const { requireRole } = require('./middleware/auth');
const corsMiddleware = require('./middleware/cors');

// For disease category
const psiService = require('./services/psiService');
const diseaseService = require('./services/diseaseService');

// For risk assessment
const riskAssessmentService = require('./services/riskAssessmentService');



const app = express();
const PORT = process.env.PORT || 3001;

// Apply CORS middleware FIRST
app.use(corsMiddleware);

// Run migrations at startup (safe no-op if already applied) - don't exit server
runMigrations(false);

// multer: memory storage to compute checksum then write via service
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50 MB limit
});

app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'PrivaGene Document Storage API',
    version: '1.0.0'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: 'connected'
  });
});

// ===================================
// USER MANAGEMENT ENDPOINTS
// ===================================

// Register new user
app.post('/api/users/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['email', 'password', 'role']
      });
    }

    // Check if user already exists
    const existing = await userService.getUserByEmail(email);
    if (existing) {
      return res.status(409).json({
        error: 'User already exists',
        email: email
      });
    }

    // Determine status based on role
    let status = 'active';
    if (role === 'hospital' || role === 'doctor' || role === 'admin' || role === 'hospital_admin') {
      status = 'pending_approval';
    }

    const userData = {
      ...req.body,
      status
    };

    const user = await userService.createUser(userData);

    return res.status(201).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status
      },
      message: status === 'pending_approval'
        ? 'Registration successful. Awaiting admin approval.'
        : 'Registration successful.'
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({
      error: 'Registration failed',
      message: err.message
    });
  }
});

// Login user
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['email', 'password']
      });
    }

    const user = await userService.getUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password incorrect'
      });
    }

    // Simple password comparison (NOTE: In production, use bcrypt!)
    if (user.password !== password) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password incorrect'
      });
    }

    // Check if user is approved
    if (user.status === 'pending_approval') {
      return res.status(403).json({
        error: 'Account pending approval',
        message: 'Your account is awaiting admin approval'
      });
    }

    if (user.status !== 'active') {
      return res.status(403).json({
        error: 'Account inactive',
        message: 'Your account has been deactivated'
      });
    }

    // Return user data (excluding password)
    const { password: _, ...userData } = user;
    return res.json({
      success: true,
      user: userData,
      message: 'Login successful'
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      error: 'Login failed',
      message: err.message
    });
  }
});

// Get user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    const { password: _, ...userData } = user;
    return res.json({
      success: true,
      user: userData
    });
  } catch (err) {
    console.error('Get user error:', err);
    return res.status(500).json({
      error: 'Failed to retrieve user',
      message: err.message
    });
  }
});

// Update user profile
app.put('/api/users/:id', async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    const { password: _, ...userData } = user;
    return res.json({
      success: true,
      user: userData,
      message: 'Profile updated successfully'
    });
  } catch (err) {
    console.error('Update user error:', err);
    return res.status(500).json({
      error: 'Failed to update user',
      message: err.message
    });
  }
});

// Delete user account
app.delete('/api/users/:id', async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);

    return res.json({
      success: true,
      message: 'User account deleted successfully'
    });
  } catch (err) {
    console.error('Delete user error:', err);
    return res.status(500).json({
      error: 'Failed to delete user',
      message: err.message
    });
  }
});

// List all users (with optional filters)
app.get('/api/users', async (req, res) => {
  try {
    const filters = {};
    if (req.query.role) filters.role = req.query.role;
    if (req.query.status) filters.status = req.query.status;

    const users = await userService.getUsers(filters);

    // Remove passwords from response
    const usersWithoutPasswords = users.map(({ password: _, ...user }) => user);

    return res.json({
      success: true,
      count: usersWithoutPasswords.length,
      users: usersWithoutPasswords
    });
  } catch (err) {
    console.error('List users error:', err);
    return res.status(500).json({
      error: 'Failed to retrieve users',
      message: err.message
    });
  }
});

// Update user status (for admin approval)
app.patch('/api/users/:id/status', requireRole(['admin', 'system_admin']), async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        error: 'Missing status field'
      });
    }

    const user = await userService.updateUserStatus(req.params.id, status);

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    const { password: _, ...userData } = user;
    return res.json({
      success: true,
      user: userData,
      message: 'User status updated successfully'
    });
  } catch (err) {
    console.error('Update status error:', err);
    return res.status(500).json({
      error: 'Failed to update status',
      message: err.message
    });
  }
});


// ===================================
// DOCUMENT MANAGEMENT ENDPOINTS
// ===================================


// Upload result (patient or researcher uploads analysis files)
// Required headers: X-Role (must be 'patient' or 'researcher' or 'doctor'), X-Session-ID (session linkage)
app.post('/api/documents/upload', requireRole(['patient', 'researcher', 'doctor', 'admin']), upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded',
        hint: 'Use multipart/form-data with field name "file"'
      });
    }

    const sessionId = req.context.sessionId || req.body.session_id;
    if (!sessionId) {
      return res.status(400).json({
        error: 'Session ID required',
        hint: 'Include X-Session-ID header or session_id form field'
      });
    }

    const result = await documentService.storeFileFromBuffer(req.file.buffer, req.file.originalname, req.file.mimetype, sessionId);
    return res.json({
      success: true,
      id: result.id,
      fileName: result.fileName,
      size: result.size
    });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({
      error: 'Failed to upload document',
      message: err.message
    });
  }
});

// List documents for a session (doctor/researcher)
app.get('/api/documents', requireRole(['doctor', 'researcher', 'admin']), async (req, res) => {
  try {
    const sessionId = req.query.session_id || req.context.sessionId;
    if (!sessionId) {
      return res.status(400).json({
        error: 'Session ID required',
        hint: 'Include session_id query parameter or X-Session-ID header'
      });
    }

    const rows = await service.listDocumentsBySession(sessionId);
    return res.json({
      success: true,
      count: rows.length,
      documents: rows
    });
  } catch (err) {
    console.error('List error:', err);
    return res.status(500).json({
      error: 'Failed to retrieve documents',
      message: err.message
    });
  }
});

// Download document by id (doctor/researcher)
app.get('/api/documents/:id/download', requireRole(['doctor', 'researcher', 'admin', 'patient']), async (req, res) => {
  try {
    const id = req.params.id;
    const meta = await service.getDocumentMeta(id);

    if (!meta) {
      return res.status(404).json({
        error: 'Document not found',
        documentId: id
      });
    }

    // Optionally enforce session header matches meta.session_id for extra safety
    const sessionId = req.context.sessionId;
    if (sessionId && sessionId !== meta.session_id) {
      return res.status(403).json({
        error: 'Access denied - session mismatch',
        hint: 'You can only access documents from your own session'
      });
    }

    return service.streamDocumentFile(res, meta.storage_path, meta.file_name);
  } catch (err) {
    console.error('Download error:', err);
    return res.status(500).json({
      error: 'Failed to download document',
      message: err.message
    });
  }
});

// Delete document (admin only)
app.delete('/api/documents/:id', requireRole(['admin']), async (req, res) => {
  try {
    const id = req.params.id;
    const ok = await service.deleteDocument(id);

    if (!ok) {
      return res.status(404).json({
        error: 'Document not found',
        documentId: id
      });
    }

    return res.json({
      success: true,
      message: 'Document deleted successfully',
      documentId: id
    });
  } catch (err) {
    console.error('Delete error:', err);
    return res.status(500).json({
      error: 'Failed to delete document',
      message: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`PrivaGene DB service running on http://localhost:${PORT}`);
});




// ===================================
// DISEASE CATEGORY ENDPOINTS
// ===================================

// Get all disease categories (WITHOUT genes for privacy)
// Matches Flask: GET /api/disease-categories
app.get('/api/disease-categories', (req, res) => {
  try {
    const categories = diseaseService.getDiseaseCategories();
    
    // Remove genes before sending to frontend - critical for PSI privacy
    const safeList = categories.map(({ genes, ...rest }) => rest);
    
    return res.status(200).json(safeList);
  } catch (err) {
    console.error('Get diseases error:', err);
    return res.status(500).json({
      error: 'Failed to retrieve diseases',
      message: err.message
    });
  }
});

// ===================================
// PSI COMPUTATION ENDPOINT
// ===================================

// Backend PSI computation
// Matches Flask: POST /api/backend_psi
app.post('/api/backend_psi', (req, res) => {
  try {
    const data = req.body;
    
    console.log("=== Incoming PSI payload ===");
    console.log(data);
    console.log();
    console.log(`${data.blinded_patient?.length || 0} blinded patient values`);
    console.log("=== End of payload ===");

    // Extract from frontend body
    const blindedPatientValues = data.blinded_patient;
    const diseaseId = data.disease;

    if (!blindedPatientValues || !diseaseId) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['blinded_patient', 'disease']
      });
    }

    if (!Array.isArray(blindedPatientValues)) {
      return res.status(400).json({
        error: 'blinded_patient must be an array'
      });
    }

    console.log(`disease_id: ${diseaseId}`);

    // Get disease genes from database (server-side only)
    // Get disease genes from database (server-side only)
    const diseaseGenes = diseaseService.getDiseaseGenes(diseaseId);  // ✅ CORRECT function name

    if (!diseaseGenes) {
      return res.status(404).json({
        error: 'Disease not found',
        diseaseId: diseaseId
      });
    }

    console.log(`Disease has ${diseaseGenes.length} genes`);

    // Run backend PSI compute() - matches Python PSI class
    const result = psiService.compute(blindedPatientValues, diseaseGenes);

    return res.json(result);
  } catch (err) {
    console.error('PSI computation error:', err);
    return res.status(500).json({
      error: 'PSI computation failed',
      message: err.message
    });
  }
});

// ===================================
// RISK ASSESSMENT STORAGE
// ===================================

// Create (store) risk assessment results
app.post('/api/risk-assessments', async (req, res) => {
  try {
    const { userId, overallRisk, diseaseId, matchCount, matchedGenes, riskPercentage } = req.body;

    if (!userId || overallRisk === undefined) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['userId', 'overallRisk']
      });
    }

    // Store in database using service
    const assessment = await riskAssessmentService.createAssessment({
      userId,
      overallRisk,
      diseaseId,
      matchCount,
      matchedGenes,
      riskPercentage
    });

    console.log('Risk assessment stored in database:', assessment.id);

    return res.status(201).json({
      success: true,
      assessment
    });
  } catch (err) {
    console.error('Store assessment error:', err);
    return res.status(500).json({
      error: 'Failed to store assessment',
      message: err.message
    });
  }
});

// Get all risk assessments for a user
app.get('/api/risk-assessments/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Query from database
    const assessments = await riskAssessmentService.getAssessmentsByUser(userId);

    console.log(`Retrieved ${assessments.length} assessments for user ${userId}`);

    return res.json({
      success: true,
      count: assessments.length,
      assessments
    });
  } catch (err) {
    console.error('Get assessments error:', err);
    return res.status(500).json({
      error: 'Failed to retrieve assessments',
      message: err.message
    });
  }
});

// Get a specific assessment by ID
app.get('/api/risk-assessments/assessment/:assessmentId', async (req, res) => {
  try {
    const { assessmentId } = req.params;

    const assessment = await riskAssessmentService.getAssessmentById(assessmentId);

    if (!assessment) {
      return res.status(404).json({
        error: 'Assessment not found'
      });
    }

    return res.json({
      success: true,
      assessment
    });
  } catch (err) {
    console.error('Get assessment error:', err);
    return res.status(500).json({
      error: 'Failed to retrieve assessment',
      message: err.message
    });
  }
});

// Delete an assessment
app.delete('/api/risk-assessments/:assessmentId', async (req, res) => {
  try {
    const { assessmentId } = req.params;

    const deleted = riskAssessmentService.deleteAssessment(assessmentId);

    if (!deleted) {
      return res.status(404).json({
        error: 'Assessment not found'
      });
    }

    return res.json({
      success: true,
      message: 'Assessment deleted successfully'
    });
  } catch (err) {
    console.error('Delete assessment error:', err);
    return res.status(500).json({
      error: 'Failed to delete assessment',
      message: err.message
    });
  }
});

// ===================================
// DISEASE MANAGEMENT ENDPOINTS 
// ===================================

// Add this at the top with other service imports:
// const diseaseService = require('./services/diseaseService');

// Get all diseases for a hospital
app.get('/api/diseases', async (req, res) => {
  try {
    const hospitalId = req.query.hospital_id;
    
    let diseases;
    if (hospitalId) {
      diseases = await diseaseService.getDiseasesByHospital(hospitalId);
    } else {
      diseases = await diseaseService.getAllDiseases();
    }

    return res.json({
      success: true,
      count: diseases.length,
      diseases
    });
  } catch (err) {
    console.error('Get diseases error:', err);
    return res.status(500).json({
      error: 'Failed to retrieve diseases',
      message: err.message
    });
  }
});

// Get unique diseases for a hospital
app.get('/api/diseases/unique', async (req, res) => {
  try {
    const hospitalId = req.query.hospital_id;
    
    if (!hospitalId) {
      return res.status(400).json({
        error: 'Missing hospital_id parameter'
      });
    }

    const diseases = await diseaseService.getUniqueDiseases(hospitalId);

    return res.json({
      success: true,
      count: diseases.length,
      diseases
    });
  } catch (err) {
    console.error('Get unique diseases error:', err);
    return res.status(500).json({
      error: 'Failed to retrieve unique diseases',
      message: err.message
    });
  }
});

// Search diseases
app.get('/api/diseases/search', async (req, res) => {
  try {
    const { hospital_id, q } = req.query;
    
    if (!hospital_id) {
      return res.status(400).json({
        error: 'Missing hospital_id parameter'
      });
    }

    if (!q) {
      // If no search term, return all diseases
      const diseases = await diseaseService.getDiseasesByHospital(hospital_id);
      return res.json({
        success: true,
        count: diseases.length,
        diseases
      });
    }

    const diseases = await diseaseService.searchDiseases(hospital_id, q);

    return res.json({
      success: true,
      count: diseases.length,
      diseases
    });
  } catch (err) {
    console.error('Search diseases error:', err);
    return res.status(500).json({
      error: 'Failed to search diseases',
      message: err.message
    });
  }
});

// Get a single disease by ID
app.get('/api/diseases/:id', async (req, res) => {
  try {
    const disease = await diseaseService.getDiseaseById(req.params.id);

    if (!disease) {
      return res.status(404).json({
        error: 'Disease not found'
      });
    }

    return res.json({
      success: true,
      disease
    });
  } catch (err) {
    console.error('Get disease error:', err);
    return res.status(500).json({
      error: 'Failed to retrieve disease',
      message: err.message
    });
  }
});

// Create a new disease
app.post('/api/diseases', async (req, res) => {
  try {
    const { hospital_id, disease_name, disease_code, gene_symbols, gene_symbol, description } = req.body;

    // Handle both gene_symbols (array) and gene_symbol (string) for backwards compatibility
    let geneSymbolsArray = [];
    
    if (gene_symbols) {
      // New format: array of symbols
      if (typeof gene_symbols === 'string') {
        // If it's a string, split by comma
        geneSymbolsArray = gene_symbols.split(',').map(s => s.trim()).filter(s => s);
      } else if (Array.isArray(gene_symbols)) {
        geneSymbolsArray = gene_symbols;
      }
    } else if (gene_symbol) {
      // Old format: single symbol or comma-separated string
      if (typeof gene_symbol === 'string') {
        geneSymbolsArray = gene_symbol.split(',').map(s => s.trim()).filter(s => s);
      }
    }

    // Validate required fields
    if (!hospital_id || !disease_name || !disease_code || geneSymbolsArray.length === 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['hospital_id', 'disease_name', 'disease_code', 'gene_symbols (array or comma-separated string)']
      });
    }

    // Check if disease already exists
    const isDuplicateDisease = await diseaseService.checkDuplicateDisease(
      hospital_id,
      disease_code
    );

    if (isDuplicateDisease) {
      return res.status(409).json({
        error: 'Duplicate disease',
        message: `Disease with code ${disease_code} already exists for this hospital`
      });
    }

    // Create the disease with multiple gene symbols
    const disease = await diseaseService.createDisease({
      hospital_id,
      disease_name,
      disease_code,
      gene_symbols: geneSymbolsArray,
      description
    });

    return res.status(201).json({
      success: true,
      disease,
      message: 'Disease created successfully'
    });
  } catch (err) {
    console.error('Create disease error:', err);
    return res.status(500).json({
      error: 'Failed to create disease',
      message: err.message
    });
  }
});

// Update a disease
app.put('/api/diseases/:id', async (req, res) => {
  try {
    const disease = await diseaseService.updateDisease(req.params.id, req.body);

    if (!disease) {
      return res.status(404).json({
        error: 'Disease not found'
      });
    }

    return res.json({
      success: true,
      disease,
      message: 'Disease updated successfully'
    });
  } catch (err) {
    console.error('Update disease error:', err);
    return res.status(500).json({
      error: 'Failed to update disease',
      message: err.message
    });
  }
});

// Delete a disease
app.delete('/api/diseases/:id', async (req, res) => {
  try {
    const deleted = await diseaseService.deleteDisease(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        error: 'Disease not found'
      });
    }

    return res.json({
      success: true,
      message: 'Disease deleted successfully'
    });
  } catch (err) {
    console.error('Delete disease error:', err);
    return res.status(500).json({
      error: 'Failed to delete disease',
      message: err.message
    });
  }
});

// Bulk upload diseases from CSV
app.post('/api/diseases/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded',
        hint: 'Use multipart/form-data with field name "file"'
      });
    }

    const hospitalId = req.body.hospital_id;
    if (!hospitalId) {
      return res.status(400).json({
        error: 'Missing hospital_id',
        hint: 'Include hospital_id in form data'
      });
    }

    // Check file type
    const fileName = req.file.originalname.toLowerCase();
    if (!fileName.endsWith('.csv')) {
      return res.status(400).json({
        error: 'Invalid file type',
        hint: 'Only CSV files are supported'
      });
    }

    // Parse CSV content
    const content = req.file.buffer.toString('utf-8');
    const lines = content.split(/\r?\n/).filter(line => line.trim());

    if (lines.length < 2) {
      return res.status(400).json({
        error: 'Invalid CSV file',
        hint: 'File must have a header row and at least one data row'
      });
    }

    // Parse header
    const header = lines[0].split(',').map(h => h.trim().toLowerCase());
    const requiredColumns = ['disease_name', 'disease_code', 'gene_symbol'];
    const missingColumns = requiredColumns.filter(col => !header.includes(col));

    if (missingColumns.length > 0) {
      return res.status(400).json({
        error: 'Missing required columns',
        missing: missingColumns,
        hint: 'CSV must have columns: disease_name, disease_code, gene_symbol, description (optional)'
      });
    }

    // Parse data rows
    const entries = [];
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      if (values.length === 0) continue;

      const entry = {};
      header.forEach((col, index) => {
        entry[col] = values[index] || '';
      });

      entries.push(entry);
    }

    // Bulk insert
    const result = await diseaseService.bulkInsertDiseases(entries, hospitalId);

    return res.json({
      success: true,
      inserted: result.inserted,
      skipped: result.skipped,
      total: entries.length,
      errors: result.errors.slice(0, 10), // Limit errors in response
      message: `Successfully inserted ${result.inserted} entries, skipped ${result.skipped}`
    });
  } catch (err) {
    console.error('CSV upload error:', err);
    return res.status(500).json({
      error: 'Failed to process CSV upload',
      message: err.message
    });
  }
});

// Generate hash preview (utility endpoint)
app.post('/api/diseases/hash-preview', (req, res) => {
  try {
    const { gene_symbol } = req.body;

    if (!gene_symbol) {
      return res.status(400).json({
        error: 'Missing gene_symbol'
      });
    }

    const hash = diseaseService.generateHash(gene_symbol);

    return res.json({
      success: true,
      gene_symbol: gene_symbol.toUpperCase(),
      hash_value: hash
    });
  } catch (err) {
    console.error('Hash preview error:', err);
    return res.status(500).json({
      error: 'Failed to generate hash',
      message: err.message
    });
  }
});




// Helper function to parse CSV line (handles quoted values)
function parseCSVLine(line) {
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