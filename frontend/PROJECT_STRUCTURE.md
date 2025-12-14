# Grab Morocco - Project Structure

## 📁 Frontend Project Structure

This document explains the structure of the Grab Morocco frontend React application.

```
frontend/
├── 📄 index.html                 # Main HTML entry point (React root)
├── 📄 package.json               # Dependencies and scripts
├── 📄 vite.config.ts            # Vite build configuration
├── 📄 tsconfig.json              # TypeScript configuration
├── 📄 eslint.config.js           # ESLint configuration
│
├── 📁 public/                    # Static public assets
│   └── vite.svg
│
└── 📁 src/                       # Source code
    │
    ├── 📄 main.tsx               # React app entry point
    ├── 📄 App.tsx                # Main App component (renders HomePage)
    ├── 📄 App.css                # App-specific styles
    ├── 📄 index.css              # Global styles + imports custom CSS
    │
    ├── 📁 pages/                 # Page components
    │   └── HomePage.tsx          # ⭐ Main landing page (converted from HTML)
    │
    ├── 📁 components/            # Reusable UI components
    │   └── driver/              # Driver-related components
    │
    ├── 📁 features/              # Feature-based modules
    │   ├── admin/
    │   │   └── admin.jsx        # Admin feature
    │   ├── auth/
    │   │   └── auth.jsx          # Authentication feature
    │   ├── driver/
    │   │   └── driver.jsx        # Driver feature
    │   ├── notification/
    │   │   └── notification.jsx # Notifications feature
    │   ├── payment/
    │   │   └── payment.jsx       # Payment feature
    │   ├── restaurant/
    │   │   └── restaurant.jsx   # Restaurant feature
    │   ├── ride/
    │   │   └── ride.jsx          # Ride booking feature
    │   └── user/
    │       └── user.jsx          # User feature
    │
    ├── 📁 assets/                # Static assets (images, styles)
    │   ├── css/
    │   │   └── styles.css        # Custom CSS (animations, patterns, RTL support)
    │   └── images/
    │       └── icons/            # SVG icons
    │           ├── car.svg
    │           ├── clock.svg
    │           ├── navigation.svg
    │           ├── package.svg
    │           ├── restaurant.svg
    │           ├── shield.svg
    │           └── wallet.svg
    │
    ├── 📁 utils/                 # Utility functions
    │   └── translations.ts       # ⭐ i18n translations (AR/FR/EN)
    │
    ├── 📁 shared/                # Shared code across features
    │   ├── components/
    │   │   └── co.jsx
    │   ├── hooks/
    │   │   └── ho.jsx
    │   └── lib/
    │       └── l.jsx
    │
    ├── 📁 types/                 # TypeScript type definitions
    │
    ├── 📁 i18n/                  # Internationalization
    │   └── locales/              # Translation files
    │
    └── 📁 main/                  # ⚠️ OLD STRUCTURE (can be removed)
        └── resources/            # Legacy files (not used in React)
            └── static/
                ├── css/
                ├── images/
                └── js/
```

---

## 🎯 Key Files Explained

### **Entry Points**
- **`index.html`** - HTML template with Tailwind CDN and React root
- **`main.tsx`** - React app initialization
- **`App.tsx`** - Main component that renders `HomePage`

### **Main Landing Page**
- **`pages/HomePage.tsx`** ⭐
  - Converted from static HTML to React component
  - Includes: Navigation, Hero, Services, How It Works, Features, Partner CTA, Footer
  - Multi-language support (Arabic, French, English)
  - RTL/LTR direction switching
  - Mobile responsive menu

### **Internationalization**
- **`utils/translations.ts`** ⭐
  - Translation system for 3 languages (AR, FR, EN)
  - Language switching functionality
  - RTL/LTR direction management

### **Styling**
- **`assets/css/styles.css`** ⭐
  - Moroccan pattern backgrounds
  - Animations (float, fade-in)
  - RTL/LTR support styles
  - Custom scrollbar
  - Responsive typography

### **Features** (Future Development)
The `features/` folder contains modules for different app functionalities:
- **admin** - Admin dashboard
- **auth** - Authentication (login, signup)
- **driver** - Driver management
- **notification** - User notifications
- **payment** - Payment processing
- **restaurant** - Restaurant features
- **ride** - Ride booking
- **user** - User profile/management

---

## 🚀 Getting Started

### Install Dependencies
```bash
cd frontend
npm install
```

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

---

## 📦 Technologies Used

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Utility-first CSS (via CDN)
- **React Query** - Data fetching
- **Axios** - HTTP client

---

## 🌍 Multi-Language Support

The app supports 3 languages:
- **Arabic (AR)** - RTL layout
- **French (FR)** - LTR layout
- **English (EN)** - LTR layout

Language preference is saved in `localStorage` and persists across sessions.

---

## 📝 Notes

1. **Old Structure**: The `src/main/resources/` folder contains legacy files from the old static HTML setup. These can be safely removed as they're no longer used.

2. **Features Folder**: Contains placeholder components for future development. These are not yet fully implemented.

3. **Assets**: All images and styles are now in `src/assets/` following React best practices.

4. **Backend**: Currently not in use. The frontend is standalone for now.

---

## 🔄 Recent Changes

- ✅ Converted static HTML to React component (`HomePage.tsx`)
- ✅ Created TypeScript translation system
- ✅ Moved assets to proper React structure (`src/assets/`)
- ✅ Removed old JavaScript files (replaced with React)
- ✅ Set up multi-language support with RTL/LTR switching

---

## 📞 Questions?

If you have questions about the project structure, check:
1. `HomePage.tsx` - Main landing page implementation
2. `utils/translations.ts` - How translations work
3. `assets/css/styles.css` - Custom styling

---

**Last Updated**: December 2025

