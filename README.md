# PrivaGene - Secure Genetic Risk Assessment Platform

## 🚀 Quick Start

### Running the Application
1. Navigate to the `pages` folder
2. Double-click `index.html` to open in browser
3. **OR** use VS Code Live Server (recommended)

## 🔑 Demo Credentials

### System Admin (Pre-configured Account)
**Email:** `sysadmin@privagene.com`  
**Password:** `admin123`

> ℹ️ **Note:** System Admin is the ONLY pre-configured account. System Admin accounts cannot be self-registered and must be created externally.

### All Other Roles - Self-Registration
All other roles must register through the application:
1. Click "Get Started" on landing page
2. Select your role:
   - **Patient** - No approval needed (instant access)
   - **Doctor** - Requires system admin approval
   - **Hospital Admin** - Requires system admin approval
   - **Researcher** - Instant access after registration
3. Complete registration form
4. For roles requiring approval, wait for system admin to approve your account through User Management

**Patient & Researcher:** Auto-login after registration ✅  
**Doctor & Hospital Admin:** Login after system admin approval ⏳

---

## 📁 Application Structure

```
PrivaGene/
├── css/
│   ├── global.css          # Design system (colors, dark mode)
│   └── components.css      # Reusable UI components
├── js/
│   ├── storage.js          # Mock localStorage database
│   ├── auth.js             # Authentication & sessions
│   ├── api-mock.js         # Backend API simulation
│   └── navigation.js       # UI utilities & helpers
└── pages/
    ├── index.html          # Landing page
    ├── login.html
    ├── role-selection.html
    ├── register-*.html     # Role-specific registration
    ├── patient/           # Patient portal (3 pages)
    ├── hospital/          # Doctor portal (4 pages)
    ├── admin/             # Hospital Admin portal (2 pages)
    ├── system-admin/      # System Admin portal (5 pages)
    └── researcher/        # Researcher portal (4 pages)
```

---

## 👥 User Roles & Features

### 👤 Patient
**Pages:** Dashboard, Upload Gene, Risk Assessment, Results, Appointments, Profile
- Upload genetic data files (drag-and-drop)
- Compute disease risk assessments with PSI
- View personalized risk visualizations
- Book appointments with genetic counselors
- Manage privacy settings

### 🏥 Doctor
**Pages:** Dashboard, Patients, Appointments, Profile
- View assigned patients
- Manage consultation schedule (upcoming/past/cancelled)
- Complete appointments
- Update professional credentials

### ⚙️ Hospital Admin  
**Pages:** Dashboard, Gene Database, Profile
- Manage organizational gene database
- Add/edit/delete gene entries
- Categorize diseases

### 🔧 System Admin
**Pages:** Dashboard, Audit Logs, User Management, Security
- Monitor platform-wide audit logs
- Suspend/activate/delete users
- Initiate security key rotation
- View system health metrics

### 📊 Researcher
**Pages:** Dashboard, Datasets, Analytics, Profile
- Access anonymized research data
- Export datasets as CSV
- View statistical analytics
- All data privacy-protected

---

## ✨ Key Features

### Security & Privacy
✅ **AES-256 Encryption** - All genetic data encrypted
✅ **PSI Technology** - Privacy-preserving risk computation
✅ **Role-Based Access Control** - Strict permission system
✅ **Audit Logging** - All actions tracked
✅ **Suspended User Blocking** - Cannot login if suspended

### User Experience
✅ **Auto-Registration** - Register + auto-login for all roles
✅ **Dark Mode** - System-wide theme support
✅ **Responsive Design** - Works on all screen sizes
✅ **Form Validation** - Real-time input validation
✅ **Loading States** - Smooth user feedback

### Public Access (No Login Required)
✅ **FAQ Page** - Searchable questions & answers
✅ **Privacy Policy** - Comprehensive data protection info
✅ **Terms of Service** - Legal terms & medical disclaimer
✅ **Contact Support** - Submit support tickets

---

## 🧪 Testing Workflows

### Test Patient Workflow
1. Register as patient → Auto-logged in
2. Upload gene file (any file works in demo)
3. Select disease categories
4. Compute risk assessment
5. View results visualization
6. Book an appointment
7. Update profile & privacy settings

### Test Doctor
1. Register as doctor
2. View patients list (search functionality)
3. Check appointments (upcoming/past tabs)
4. Complete an appointment
5. Update professional profile

### Test System Admin
1. Login: `sysadmin@privagene.com` / `admin123`
2. View audit logs (filter by user/action/date)
3. Manage users (suspend/activate/delete)
4. Initiate key rotation
5. Export audit logs as CSV

---

## 🔌 Backend Integration

All code with `// BACKEND_INTEGRATION:` comments shows where to connect your actual API.

**Key Integration Points:**
- **Auth:** `js/auth.js` - Login, register, password reset
- **Gene Upload:** `js/api-mock.js` - File upload processing
- **Risk Computation:** `js/api-mock.js` - PSI algorithm calls
- **Database:** `js/storage.js` - Replace localStorage with API calls

**Example:**
```javascript
// Current (Mock)
async login(email, password) {
    // BACKEND_INTEGRATION: Replace with: fetch('/api/auth/login')
    const user = Storage.getUser(email);
    // ...mock logic
}

// Replace with (Real)
async login(email, password) {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    return response.json();
}
```

---

## 🐛 Troubleshooting

### Can't see pages?
- Ensure you're opening `pages/index.html`
- Check browser console (F12) for errors
- Use relative paths (no `C:\` absolute paths)

### Login Issues?
- Use exact credentials (case-sensitive)
- Check console for error messages
- Clear localStorage: `localStorage.clear()` in console

### Styling Problems?
- Verify CSS files load (Network tab in DevTools)
- Hard refresh: `Ctrl+Shift+R` (Windows) / `Cmd+Shift+R` (Mac)

### Data Reset
Open browser console (F12) and run:
```javascript
localStorage.clear()
location.reload()
```

---

## 💡 Development Notes

### Mock Data
- All data stored in browser `localStorage`
- Demo users created automatically on first visit
- Each browser/profile has separate data

### Design System
Global CSS variables in `css/global.css`:
- Colors: `--primary-color`, `--secondary-color`, etc.
- Spacing: `--space-xs` to `--space-3xl`
- Radius: `--radius-sm`, `--radius-md`, `--radius-lg`
- Dark mode: Auto-switched via CSS variables

### Components
Reusable components in `css/components.css`:
- Buttons: `.btn`, `.btn-primary`, `.btn-outline`
- Cards: `.card`, `.card-header`, `.card-body`
- Forms: `.form-group`, `.form-control`, `.form-label`
- Badges: `.badge-success`, `.badge-error`, etc.

---

## 📚 Additional Documentation

- **Walkthrough:** `walkthrough.md` - Complete feature documentation
- **Implementation Plan:** `implementation_plan.md` - Technical architecture
- **Task Tracking:** `task.md` - Development progress

---

## 🛡️ Security Features

1. **Suspended User Protection** - Blocked at login
2. **Session Management** - Auto-timeout after inactivity
3. **Role Verification** - Page-level access control
4. **Audit Logging** - All actions tracked with timestamps
5. **Key Rotation** - Regular encryption key updates

---

## 📞 Support

For issues or questions:
- Use Contact Support page (no login required)
- Submit a support ticket
- Email: support@privagene.com (demo)
- Phone: +1 (555) 123-4567 (demo)

---

**Note:** This is a demonstration platform. All data is stored locally in browser storage for presentation purposes.