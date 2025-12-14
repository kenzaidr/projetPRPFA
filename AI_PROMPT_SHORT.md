# Quick AI Prompt: Driver Login & Register Pages

Build React TypeScript login and register pages for Grab Morocco driver partners matching this exact theme:

**Tech Stack**: React 19 + TypeScript, Tailwind CSS (CDN), Lucide React icons, React Router, Inter font

**Colors**: 
- Primary: `morocco-red: '#C1272D'`, `morocco-green: '#006233'`
- Accent: `morocco-gold: '#D4AF37'`, `morocco-sand: '#F2E8C9'`

**Design Patterns**:
- Gradients: `bg-gradient-to-r from-morocco-red to-morocco-green` for buttons/text
- Cards: `bg-white rounded-3xl shadow-lg p-8`
- Inputs: `border-gray-200 rounded-xl focus:ring-2 focus:ring-morocco-red/50`
- Buttons: Gradient background, white text, `hover:shadow-lg hover:scale-105`

**Multi-Language (CRITICAL)**:
- Support Arabic (RTL), French, English using `translations.ts` utility
- Import: `import { languageConfig, getTranslation, getCurrentLanguage, setLanguage, type Language } from '../utils/translations'`
- Set `dir={config.dir}` on main container
- Use `t(key)` function for all text
- Include language switcher in header (same pattern as HomePage.tsx)

**Pages to Create**:

1. **DriverLogin.tsx** (`frontend/src/pages/DriverLogin.tsx`):
   - Header: Logo (gradient G box + "Grab Morocco" text) + language switcher
   - Centered white card with login form
   - Email/Phone input with Mail icon
   - Password input with Lock icon + show/hide toggle
   - "Forgot Password?" link
   - Submit button (gradient, loading state)
   - "Don't have account? Sign Up" link to `/driver/signup`
   - Form validation with translated errors
   - Responsive, RTL support

2. **DriverSignup.tsx** (`frontend/src/pages/DriverSignup.tsx`):
   - Same header as login
   - Registration form with sections:
     - Personal: Name, Email, Phone, Password (with strength), Confirm Password
     - Vehicle: Model, License Plate, Vehicle Type
     - Documents: Placeholder for uploads
     - Terms checkbox (required)
   - Submit button with loading
   - "Already have account? Login" link to `/driver/login`
   - All fields validated, translated errors
   - Responsive, RTL support

**Reference**: Match design patterns from `HomePage.tsx` exactly - same logo, language switcher, color scheme, spacing, shadows, rounded corners.

**Add routes** in `App.tsx`: `/driver/login` and `/driver/signup`

**Add translations** to `translations.ts` for all auth-related strings in AR/FR/EN.

Make it beautiful, modern, and perfectly integrated with the existing Grab Morocco design system.

