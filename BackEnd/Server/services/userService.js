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
        status = 'active'
    } = userData;

    const id = uuidv4();
    const now = new Date().toISOString();

    const sql = `
    INSERT INTO users (
      id, email, password, role, first_name, last_name, phone, date_of_birth,
      address, organization_name, organization_id, license_number, specialty,
      institution, research_area, status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

    await run(sql, [
        id, email, password, role, firstName, lastName, phone, dateOfBirth,
        address, organizationName, organizationId, licenseNumber, specialty,
        institution, researchArea, status, now, now
    ]);

    return { id, email, role, status, createdAt: now };
}

// Find user by email
async function getUserByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    return await get(sql, [email]);
}

// Find user by ID
async function getUserById(id) {
    const sql = 'SELECT * FROM users WHERE id = ?';
    return await get(sql, [id]);
}

// Update user
async function updateUser(id, updates) {
    const allowedFields = [
        'first_name', 'last_name', 'phone', 'date_of_birth', 'address',
        'organization_name', 'license_number', 'specialty', 'institution',
        'research_area', 'status'
    ];

    const fields = [];
    const values = [];

    Object.keys(updates).forEach(key => {
        const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        if (allowedFields.includes(snakeKey)) {
            fields.push(`${snakeKey} = ?`);
            values.push(updates[key]);
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

    return await all(sql, params);
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

module.exports = {
    createUser,
    getUserByEmail,
    getUserById,
    updateUser,
    deleteUser,
    getUsers,
    changePassword,
    updateUserStatus
};
