const { v4: uuidv4 } = require('uuid');
const { run, get, all } = require('../../DBMS/db/db');

/**
 * User Service - handles user registration, authentication, and management
 */

// Create a new user
async function createUser(userData) {
    const {
        email,
        password,
        role,
        firstName,
        lastName,
        phone,
        dateOfBirth,
        address,
        organizationName,
        organizationId,
        licenseNumber,
        specialty,
        institution,
        researchArea,
        researchConsent = false,  // NEW: Default to false if not provided
        status = 'active'
    } = userData;

    const id = uuidv4();
    const now = new Date().toISOString();

    // Convert boolean to integer for SQLite (0 or 1)
    const researchConsentInt = researchConsent ? 1 : 0;

    const sql = `
    INSERT INTO users (
      id, email, password, role, first_name, last_name, phone, date_of_birth,
      address, organization_name, organization_id, license_number, specialty,
      institution, research_area, research_consent, status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

    await run(sql, [
        id, email, password, role, firstName, lastName, phone, dateOfBirth,
        address, organizationName, organizationId, licenseNumber, specialty,
        institution, researchArea, researchConsentInt, status, now, now
    ]);

    return { id, email, role, status, researchConsent: researchConsentInt === 1, createdAt: now };
}

// Find user by email
async function getUserByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const user = await get(sql, [email]);
    if (user) {
        // Convert research_consent from integer to boolean for consistency
        user.research_consent = user.research_consent === 1;
    }
    return user;
}

// Find user by ID
async function getUserById(id) {
    const sql = 'SELECT * FROM users WHERE id = ?';
    const user = await get(sql, [id]);
    if (user) {
        // Convert research_consent from integer to boolean for consistency
        user.research_consent = user.research_consent === 1;
    }
    return user;
}

// Check if email already exists
async function emailExists(email) {
    const sql = 'SELECT id FROM users WHERE email = ?';
    const user = await get(sql, [email]);
    return !!user;
}

// Check if license number already exists
async function licenseNumberExists(licenseNumber) {
    const sql = 'SELECT id FROM users WHERE license_number = ?';
    const user = await get(sql, [licenseNumber]);
    return !!user;
}

// Get all hospital specialists (role = 'hospital') by organization name
async function getHospitalSpecialistsByOrganization(organizationName) {
    const sql = `
        SELECT * FROM users 
        WHERE role = 'hospital' AND organization_name = ?
        ORDER BY created_at DESC
    `;
    const users = await all(sql, [organizationName]);
    
    return users.map(user => ({
        ...user,
        research_consent: user.research_consent === 1
    }));
}

// Update user
async function updateUser(id, updates) {
    const allowedFields = [
        'first_name', 'last_name', 'phone', 'date_of_birth', 'address',
        'organization_name', 'license_number', 'specialty', 'institution',
        'research_area', 'research_consent', 'status'
    ];

    const fields = [];
    const values = [];

    Object.keys(updates).forEach(key => {
        const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        if (allowedFields.includes(snakeKey)) {
            fields.push(`${snakeKey} = ?`);
            // Handle boolean to integer conversion for research_consent
            if (snakeKey === 'research_consent') {
                values.push(updates[key] ? 1 : 0);
            } else {
                values.push(updates[key]);
            }
        }
    });

    if (fields.length === 0) {
        throw new Error('No valid fields to update');
    }

    fields.push('updated_at = ?');
    values.push(new Date().toISOString());
    values.push(id);

    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    await run(sql, values);

    return await getUserById(id);
}

// Delete user
async function deleteUser(id) {
    const sql = 'DELETE FROM users WHERE id = ?';
    await run(sql, [id]);
    return true;
}

// Get all users (filtered by role or status if provided)
async function getUsers(filters = {}) {
    let sql = 'SELECT * FROM users WHERE 1=1';
    const params = [];

    if (filters.role) {
        sql += ' AND role = ?';
        params.push(filters.role);
    }

    if (filters.status) {
        sql += ' AND status = ?';
        params.push(filters.status);
    }

    // NEW: Filter by research consent
    if (filters.researchConsent !== undefined) {
        sql += ' AND research_consent = ?';
        params.push(filters.researchConsent ? 1 : 0);
    }

    const users = await all(sql, params);
    
    // Convert research_consent from integer to boolean for all users
    return users.map(user => ({
        ...user,
        research_consent: user.research_consent === 1
    }));
}

// NEW: Get users who have consented to research data sharing
async function getConsentedUsers() {
    const sql = 'SELECT * FROM users WHERE research_consent = 1 AND role = ?';
    const users = await all(sql, ['patient']);
    
    return users.map(user => ({
        ...user,
        research_consent: true
    }));
}

// Change password
async function changePassword(id, newPassword) {
    const sql = 'UPDATE users SET password = ?, updated_at = ? WHERE id = ?';
    await run(sql, [newPassword, new Date().toISOString(), id]);
    return true;
}

// Update user status (for admin approval workflow)
async function updateUserStatus(id, status) {
    const sql = 'UPDATE users SET status = ?, updated_at = ? WHERE id = ?';
    await run(sql, [status, new Date().toISOString(), id]);
    return await getUserById(id);
}

// NEW: Update research consent preference
async function updateResearchConsent(id, consent) {
    const sql = 'UPDATE users SET research_consent = ?, updated_at = ? WHERE id = ?';
    await run(sql, [consent ? 1 : 0, new Date().toISOString(), id]);
    return await getUserById(id);
}

module.exports = {
    createUser,
    getUserByEmail,
    getUserById,
    emailExists,                           // NEW export
    licenseNumberExists,                   // NEW export
    getHospitalSpecialistsByOrganization,  // NEW export
    updateUser,
    deleteUser,
    getUsers,
    getConsentedUsers,
    changePassword,
    updateUserStatus,
    updateResearchConsent
};