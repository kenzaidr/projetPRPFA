# AI Agent Prompt: Build Driver Login & Register Pages

## 🎯 Task
Build two React TypeScript pages for driver authentication (Login and Register) that match the existing Grab Morocco project theme and design patterns.

---

## 📋 Project Context

### Tech Stack
- **Framework**: React 19.2.0 with TypeScript 5.9.3
- **Styling**: Tailwind CSS (via CDN) with custom CSS
- **Icons**: Lucide React (`lucide-react`)
- **Routing**: React Router DOM 7.10.1
- **Font**: Inter (Google Fonts)
- **Build Tool**: Vite

### Project Structure
```
frontend/src/
├── pages/
│   ├── HomePage.tsx (reference for design patterns)
│   ├── DriverLogin.tsx ← CREATE THIS
│   └── DriverSignup.tsx ← CREATE THIS
├── utils/
│   └── translations.ts (use this for i18n)
└── types.ts (use existing types)
```

---

## 🎨 Design Theme & Branding

### Color Palette (Morocco Theme)
```typescript
morocco-red: '#C1272D'    // Primary red
morocco-green: '#006233'   // Primary green
morocco-gold: '#D4AF37'    // Accent gold
morocco-sand: '#F2E8C9'    // Background sand
```

### Design Patterns to Follow

1. **Gradients**:
   - Logo: `bg-gradient-to-br from-morocco-red to-morocco-green`
   - Text: `bg-gradient-to-r from-morocco-red to-morocco-green bg-clip-text text-transparent`
   - Buttons: `bg-gradient-to-r from-morocco-red to-morocco-green`

2. **Rounded Corners**:
   - Cards: `rounded-2xl` or `rounded-3xl`
   - Buttons: `rounded-lg` or `rounded-xl`
   - Inputs: `rounded-lg` or `rounded-xl`

3. **Shadows**:
   - Cards: `shadow-sm` or `shadow-lg`
   - Buttons: `shadow-md` or `shadow-lg`
   - Hover: `hover:shadow-xl`

4. **Spacing**:
   - Padding: `p-6`, `p-8` for cards
   - Gaps: `gap-4`, `gap-6` for flex containers
   - Margins: `mb-4`, `mb-6` for sections

5. **Typography**:
   - Font: `font-inter` (Inter font family)
   - Headings: `font-bold`, `text-2xl`, `text-3xl`
   - Body: `text-gray-700`, `text-gray-600`

6. **Backgrounds**:
   - Main: `bg-white` or `bg-gray-50`
   - Cards: `bg-white`
   - Patterns: Use `.moroccan-pattern` class for decorative backgrounds

---

## 🌍 Multi-Language Support (CRITICAL)

### Implementation Requirements

1. **Import translation utilities**:
```typescript
import { languageConfig, getTranslation, getCurrentLanguage, setLanguage, type Language } from '../utils/translations';
```

2. **State management**:
```typescript
const [currentLang, setCurrentLangState] = useState<Language>(getCurrentLanguage());
const t = (key: string) => getTranslation(key, currentLang);
const config = languageConfig[currentLang];
```

3. **Set document attributes**:
```typescript
useEffect(() => {
    const config = languageConfig[currentLang];
    document.documentElement.setAttribute('lang', config.lang);
    document.documentElement.setAttribute('dir', config.dir);
    document.body.className = document.body.className.replace(/\b(rtl|ltr)\b/g, '');
    document.body.classList.add(config.dir);
}, [currentLang]);
```

4. **Add translations** to `translations.ts`:
```typescript
'auth.login.title': { ar: 'تسجيل الدخول', fr: 'Connexion', en: 'Login' },
'auth.login.email': { ar: 'البريد الإلكتروني', fr: 'Email', en: 'Email' },
'auth.login.password': { ar: 'كلمة المرور', fr: 'Mot de passe', en: 'Password' },
'auth.login.submit': { ar: 'تسجيل الدخول', fr: 'Se connecter', en: 'Sign In' },
'auth.login.noAccount': { ar: 'ليس لديك حساب؟', fr: 'Pas de compte?', en: 'Don\'t have an account?' },
'auth.login.signupLink': { ar: 'سجل الآن', fr: 'S\'inscrire', en: 'Sign Up' },
'auth.signup.title': { ar: 'إنشاء حساب سائق', fr: 'Créer un compte chauffeur', en: 'Create Driver Account' },
// ... add all necessary translations
```

5. **RTL Support**:
   - Use `dir={config.dir}` on main container
   - Text alignment: Use conditional classes based on direction
   - Flex direction: Tailwind handles RTL automatically with `dir` attribute

6. **Language Switcher**:
   - Include language switcher in header (same pattern as HomePage)
   - Use ChevronDown icon from lucide-react

---

## 📄 Page Requirements

### DriverLogin.tsx

**Location**: `frontend/src/pages/DriverLogin.tsx`

**Features**:
1. **Header Section**:
   - Logo (same as HomePage: gradient box with "G" + "Grab Morocco" text)
   - Language switcher (same pattern as HomePage)
   - Link back to home page

2. **Main Content**:
   - Centered card with max-width (e.g., `max-w-md mx-auto`)
   - Background: White card on gradient background
   - Title: "Login to Driver Portal" (translated)
   - Subtitle: "Access your driver dashboard" (translated)

3. **Login Form**:
   - Email/Phone input field
     - Label (translated)
     - Placeholder (translated)
     - Icon: Mail or Phone from lucide-react
     - Styling: `border-gray-200`, `focus:ring-2 focus:ring-morocco-red/50`
   - Password input field
     - Label (translated)
     - Placeholder (translated)
     - Icon: Lock from lucide-react
     - Show/hide password toggle (Eye/EyeOff icons)
   - "Forgot Password?" link (translated)
   - Submit button
     - Gradient: `bg-gradient-to-r from-morocco-red to-morocco-green`
     - Text: White
     - Hover effects: `hover:shadow-lg hover:scale-105`
     - Loading state (spinner when submitting)

4. **Footer Links**:
   - "Don't have an account? Sign Up" (translated)
   - Link to `/driver/signup`
   - "Back to Home" link

5. **Form Validation**:
   - Client-side validation
   - Error messages (translated)
   - Visual error states (red border, error text)

6. **Responsive Design**:
   - Mobile: Full width, padding
   - Tablet: Centered card
   - Desktop: Max-width card, centered

**Visual Style**:
- Card: `bg-white rounded-3xl shadow-lg p-8`
- Inputs: `w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-morocco-red/50`
- Button: `w-full py-3 px-6 bg-gradient-to-r from-morocco-red to-morocco-green text-white font-semibold rounded-xl hover:shadow-lg transition-all`

---

### DriverSignup.tsx

**Location**: `frontend/src/pages/DriverSignup.tsx`

**Features**:
1. **Header Section** (same as Login)

2. **Main Content**:
   - Multi-step form OR single scrollable form
   - Title: "Join as a Driver Partner" (translated)
   - Subtitle: "Start earning with Grab Morocco" (translated)

3. **Registration Form Fields**:
   - **Personal Information**:
     - Full Name (required)
     - Email (required, validated)
     - Phone Number (required, Moroccan format)
     - Password (required, min 8 chars, show strength indicator)
     - Confirm Password (required, must match)
   
   - **Vehicle Information**:
     - Vehicle Model (required)
     - License Plate (required)
     - Vehicle Type (dropdown: Car, Motorcycle, etc.)
   
   - **Documents** (optional for now, can be placeholder):
     - Driver's License upload
     - Vehicle Insurance upload
   
   - **Terms & Conditions**:
     - Checkbox: "I agree to Terms & Conditions" (translated)
     - Required to submit

4. **Form Features**:
   - Password strength indicator (weak/medium/strong)
   - Real-time validation
   - Error messages (translated)
   - Success states
   - Loading state on submit

5. **Footer Links**:
   - "Already have an account? Login" (translated)
   - Link to `/driver/login`

6. **Visual Enhancements**:
   - Section dividers
   - Icons for each section (User, Car, FileText from lucide-react)
   - Progress indicator if using multi-step

**Visual Style** (same as Login):
- Same card styling
- Same input styling
- Same button styling
- Additional: Section headers with icons

---

## 🎯 Component Patterns to Follow

### 1. Language Switcher Component
Use the exact pattern from HomePage.tsx (lines 110-150):
- Button with current language
- Dropdown with 3 languages (AR, FR, EN)
- RTL-aware positioning
- Hover effects with morocco-red/5 background

### 2. Input Field Pattern
```typescript
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    {t('auth.login.email')}
  </label>
  <div className="relative">
    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
    <input
      type="email"
      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-morocco-red/50"
      placeholder={t('auth.login.emailPlaceholder')}
    />
  </div>
</div>
```

### 3. Button Pattern
```typescript
<button
  type="submit"
  className="w-full py-3 px-6 bg-gradient-to-r from-morocco-red to-morocco-green text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
>
  {t('auth.login.submit')}
</button>
```

### 4. Link Pattern
```typescript
<Link
  to="/driver/signup"
  className="text-morocco-red hover:text-morocco-green font-medium transition-colors"
>
  {t('auth.login.signupLink')}
</Link>
```

---

## 🔄 Navigation & Routing

### Routes to Add (in App.tsx):
```typescript
<Route path="/driver/login" element={<DriverLogin />} />
<Route path="/driver/signup" element={<DriverSignup />} />
```

### Navigation Flow:
- HomePage "Login" button → `/driver/login`
- Login page "Sign Up" link → `/driver/signup`
- Signup page "Login" link → `/driver/login`
- After successful login → `/driver` (dashboard)
- After successful signup → `/driver` (dashboard)

---

## ✨ Animations & Interactions

1. **Page Transitions**:
   - Fade in on mount
   - Smooth transitions

2. **Form Interactions**:
   - Input focus: Ring effect with morocco-red
   - Button hover: Scale and shadow
   - Error shake animation (optional)

3. **Loading States**:
   - Spinner on submit button
   - Disable form during submission

4. **Success States**:
   - Green checkmark animation
   - Success message

---

## 📱 Responsive Design Requirements

### Breakpoints:
- **Mobile**: `< 640px` (sm)
- **Tablet**: `640px - 1024px` (md, lg)
- **Desktop**: `> 1024px` (xl)

### Mobile Optimizations:
- Full-width form
- Reduced padding
- Stacked layout
- Larger touch targets (min 44px)
- Keyboard-friendly inputs

### Desktop Optimizations:
- Centered card (max-width)
- More spacing
- Side-by-side layouts where appropriate

---

## 🎨 Background & Decorative Elements

### Background Pattern:
```typescript
<div className="min-h-screen bg-gradient-to-br from-morocco-sand/30 via-white to-morocco-green/10">
  {/* Optional: Add moroccan-pattern overlay */}
  <div className="absolute inset-0 moroccan-pattern opacity-5"></div>
  {/* Content */}
</div>
```

### Card Container:
```typescript
<div className="relative bg-white rounded-3xl shadow-xl p-8 max-w-md mx-auto">
  {/* Form content */}
</div>
```

---

## 🔐 Form Validation Requirements

### Login Form:
- Email: Valid email format
- Password: Required, min 6 characters
- Show errors below each field (translated)

### Signup Form:
- Name: Required, min 2 characters
- Email: Valid email format, unique (check with backend)
- Phone: Valid Moroccan phone format (e.g., +212 6XX-XXXXXX)
- Password: Min 8 chars, at least one number, one letter
- Confirm Password: Must match password
- Vehicle Model: Required
- License Plate: Required, valid format
- Terms: Must be checked

### Error Display:
```typescript
{error && (
  <div className="mt-2 text-sm text-red-600 flex items-center gap-2">
    <AlertCircle size={16} />
    <span>{t('auth.error.invalidCredentials')}</span>
  </div>
)}
```

---

## 🚀 Implementation Checklist

### DriverLogin.tsx:
- [ ] Import all necessary dependencies (React, React Router, Lucide icons, translations)
- [ ] Set up language state and translation function
- [ ] Create header with logo and language switcher
- [ ] Create login form with email and password fields
- [ ] Add show/hide password toggle
- [ ] Add "Forgot Password?" link
- [ ] Add submit button with loading state
- [ ] Add link to signup page
- [ ] Add form validation
- [ ] Add error handling
- [ ] Make responsive
- [ ] Add RTL support
- [ ] Add animations

### DriverSignup.tsx:
- [ ] Import all necessary dependencies
- [ ] Set up language state and translation function
- [ ] Create header with logo and language switcher
- [ ] Create multi-section form (Personal, Vehicle, Documents)
- [ ] Add all required input fields
- [ ] Add password strength indicator
- [ ] Add terms & conditions checkbox
- [ ] Add submit button with loading state
- [ ] Add link to login page
- [ ] Add form validation for all fields
- [ ] Add error handling
- [ ] Make responsive
- [ ] Add RTL support
- [ ] Add animations

### Additional:
- [ ] Add all translations to `translations.ts`
- [ ] Update `App.tsx` with new routes
- [ ] Test all language switches
- [ ] Test RTL layout (Arabic)
- [ ] Test responsive design
- [ ] Test form validation
- [ ] Test navigation flow

---

## 📝 Code Quality Requirements

1. **TypeScript**:
   - Proper typing for all props and state
   - Use existing types from `types.ts`
   - No `any` types

2. **React Best Practices**:
   - Functional components with hooks
   - Proper useEffect dependencies
   - Clean component structure
   - Reusable components where appropriate

3. **Accessibility**:
   - Proper labels for inputs
   - ARIA attributes where needed
   - Keyboard navigation support
   - Focus management

4. **Performance**:
   - Lazy loading if needed
   - Optimized re-renders
   - Memoization where appropriate

---

## 🎯 Final Notes

- **Match the existing design exactly** - Use HomePage.tsx as the primary reference
- **Follow the color scheme** - Morocco red and green gradients everywhere
- **Support all 3 languages** - Arabic (RTL), French, English
- **Make it responsive** - Mobile-first approach
- **Add smooth animations** - But keep them subtle
- **Use Lucide icons** - Consistent with the rest of the app
- **Follow Tailwind patterns** - Same utility class usage as HomePage

---

## 📚 Reference Files

Study these files for patterns:
- `frontend/src/pages/HomePage.tsx` - Design patterns, language switcher, navigation
- `frontend/src/utils/translations.ts` - Translation system
- `frontend/src/features/driver/DriverDashboard.tsx` - Driver-specific styling
- `frontend/src/assets/css/styles.css` - Custom CSS classes
- `frontend/index.html` - Tailwind config and color definitions

---

**Start building!** Create beautiful, functional login and signup pages that seamlessly integrate with the Grab Morocco platform. 🚀

