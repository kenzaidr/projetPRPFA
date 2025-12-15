import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChevronDown, 
  ArrowLeft, 
  AlertCircle,
  Briefcase,
  User,
  Phone,
  Car,
  FileText,
  CheckCircle2,
  ArrowRight,
  Store,
  MapPin,
  Utensils,
  Sparkles,
  Zap,
  Mail,
  Loader2,
  Lock
} from 'lucide-react';
import { 
  languageConfig, 
  getTranslation, 
  getCurrentLanguage, 
  setLanguage, 
  type Language 
} from '../utils/translations';
import type { PartnerRegistrationData } from '../types';

// Form Input Component - Defined outside to prevent recreation on every render
interface FormInputProps {
  icon: any;
  label: string;
  name: keyof PartnerRegistrationData;
  type?: string;
  placeholder: string;
  value: string;
  error?: string;
  isRTL: boolean;
  onChange: (name: keyof PartnerRegistrationData, value: string) => void;
}

const FormInputComponent: React.FC<FormInputProps> = ({ 
  icon: Icon, 
  label, 
  name, 
  type = "text", 
  placeholder,
  value,
  error,
  isRTL,
  onChange
}) => (
  <div className="mb-2">
    <label className={`block text-xs font-medium text-gray-700 mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>
      {label}
    </label>
    <div className="relative">
      {Icon && React.createElement(Icon as React.ComponentType<any>, { 
        className: `absolute top-1/2 transform -translate-y-1/2 text-gray-400 ${isRTL ? 'right-2.5' : 'left-2.5'}`, 
        size: 16 
      })}
      <input
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className={`w-full py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all
          ${error
            ? 'border-red-300 focus:ring-red-200 bg-red-50' 
            : 'border-gray-200 focus:ring-morocco-red/50 focus:border-morocco-red/50'}
          ${isRTL ? 'pr-8 pl-3 text-right' : 'pl-8 pr-3 text-left'}`}
        placeholder={placeholder}
      />
      {error && (
        <div className={`absolute -bottom-4 ${isRTL ? 'right-0' : 'left-0'} text-xs text-red-500 flex items-center gap-1`}>
           <AlertCircle size={10} /> {error}
        </div>
      )}
    </div>
  </div>
);

const FormInput = React.memo(FormInputComponent);
FormInput.displayName = 'FormInput';

const PartnerLoginSignUP: React.FC = () => {
  const navigate = useNavigate();
  const [currentLang, setCurrentLangState] = useState<Language>(getCurrentLanguage());
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('signup');
  const [loginType, setLoginType] = useState<'driver' | 'restaurant' | null>(null);

  // Signup state
  const [isLoadingSignup, setIsLoadingSignup] = useState(false);
  const [formData, setFormData] = useState<PartnerRegistrationData>({
    partnerType: 'driver',
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    vehicleModel: '',
    licensePlate: '',
    vehicleType: 'car',
    restaurantName: '',
    restaurantAddress: '',
    cuisineType: '',
    agreedToTerms: false
  });
  const [errors, setErrors] = useState<Partial<Record<keyof PartnerRegistrationData, string>>>({});

  const t = (key: string) => getTranslation(key, currentLang);
  const config = languageConfig[currentLang];
  const isRTL = config.dir === 'rtl';

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Update document attributes when language changes
    document.documentElement.setAttribute('lang', config.lang);
    document.documentElement.setAttribute('dir', config.dir);
    document.body.className = document.body.className.replace(/\b(rtl|ltr)\b/g, '');
    document.body.classList.add(config.dir);
    
    // Debug: Log component mount
    console.log('PartnerLoginSignUP component mounted');
  }, [currentLang, config]);
  
  // Separate useEffect for initial mount only
  useEffect(() => {
    console.log('PartnerLoginSignUP initial mount');
  }, []);

  const handleLangChange = (lang: Language) => {
    setLanguage(lang);
    setCurrentLangState(lang);
    setShowLangMenu(false);
  };


  // Signup handlers
  const handleInputChange = useCallback((field: keyof PartnerRegistrationData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => {
      if (prev[field]) {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      }
      return prev;
    });
  }, []);

  const handleTypeSelect = (type: 'driver' | 'restaurant') => {
    setFormData(prev => ({ ...prev, partnerType: type }));
    setErrors({});
  };

  const getPasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length > 7) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const validateSignup = (): boolean => {
    const newErrors: Partial<Record<keyof PartnerRegistrationData, string>> = {};

    if (!formData.fullName.trim()) newErrors.fullName = t('auth.error.required');
    
    if (!formData.email.trim()) {
      newErrors.email = t('auth.error.required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('auth.error.email');
    }

    if (!formData.phone.trim()) newErrors.phone = t('auth.error.required');
    
    if (!formData.password) {
      newErrors.password = t('auth.error.required');
    } else if (formData.password.length < 8) {
      newErrors.password = t('auth.password.strength.weak');
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.error.match');
    }

    if (formData.partnerType === 'driver') {
        if (!formData.vehicleModel?.trim()) newErrors.vehicleModel = t('auth.error.required');
        if (!formData.licensePlate?.trim()) newErrors.licensePlate = t('auth.error.required');
    } else if (formData.partnerType === 'restaurant') {
        if (!formData.restaurantName?.trim()) newErrors.restaurantName = t('auth.error.required');
        if (!formData.restaurantAddress?.trim()) newErrors.restaurantAddress = t('auth.error.required');
    }
    
    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = t('auth.error.terms');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateSignup()) {
      setIsLoadingSignup(true);
      setTimeout(() => {
        setIsLoadingSignup(false);
        // Navigate to verification page only for drivers
        if (formData.partnerType === 'driver') {
          navigate('/driver/verification');
        } else {
          // For restaurants, go directly to dashboard
          navigate('/driver');
        }
      }, 2000);
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };


  const strength = getPasswordStrength(formData.password);

  // Safety check
  if (!config || !currentLang) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="partner-auth-page-container min-h-screen bg-gradient-to-br from-morocco-sand/40 via-white via-morocco-green/5 to-morocco-red/10 relative overflow-hidden" dir={config.dir}>
      {/* Animated Background */}
      <div className="partner-auth-background-pattern absolute inset-0 moroccan-pattern opacity-[0.03] pointer-events-none"></div>
      
      {/* Floating Gradient Orbs */}
      <div className="partner-auth-orb-1 absolute top-20 -left-32 w-[600px] h-[600px] bg-gradient-to-br from-morocco-red/15 to-morocco-green/15 rounded-full blur-3xl animate-pulse"></div>
      <div className="partner-auth-orb-2 absolute bottom-20 -right-32 w-[600px] h-[600px] bg-gradient-to-br from-morocco-green/15 to-morocco-gold/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>

      {/* Header */}
      <header className="partner-auth-header relative z-20 w-full p-2 md:p-3 flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/" className="partner-auth-logo-link flex items-center gap-2 group">
          <div className="partner-auth-logo-icon w-9 h-9 bg-gradient-to-br from-morocco-red via-morocco-green to-morocco-gold rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-morocco-red/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl">
            G
          </div>
          <span className="partner-auth-logo-text font-bold text-base hidden sm:block bg-gradient-to-r from-morocco-red via-morocco-green to-morocco-gold bg-clip-text text-transparent">
            Grab Morocco
          </span>
        </Link>

        <div className="partner-auth-language-switcher relative">
          <button 
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="partner-auth-language-button flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-md rounded-full shadow-md hover:shadow-lg transition-all border border-white/50 hover:scale-105"
          >
            <span className="font-medium text-gray-700">{config.label}</span>
            <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${showLangMenu ? 'rotate-180' : ''}`} />
          </button>

          {showLangMenu && (
            <div className={`partner-auth-language-dropdown absolute top-full mt-2 py-2 w-36 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/50 z-50 animate-in fade-in slide-in-from-top-2 ${isRTL ? 'left-0' : 'right-0'}`}>
              {(Object.keys(languageConfig) as Language[]).map((langCode) => (
                <button
                  key={langCode}
                  onClick={() => handleLangChange(langCode)}
                  className={`partner-auth-language-option w-full px-4 py-2.5 text-sm transition-all duration-200 flex items-center justify-between
                    ${currentLang === langCode 
                      ? 'bg-gradient-to-r from-morocco-red/10 to-morocco-green/10 text-morocco-red font-semibold' 
                      : 'text-gray-600 hover:bg-gray-50/80'
                    } ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  {languageConfig[langCode].label}
                  {currentLang === langCode && <Sparkles size={14} className="text-morocco-green" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-3 md:py-4 flex flex-col items-center justify-center min-h-[calc(100vh-60px)]">
        
        <div className="w-full max-w-4xl">
          {/* Back Link */}
          <Link to="/" className={`inline-flex items-center gap-1.5 text-gray-500 hover:text-morocco-green mb-2 transition-colors text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
            <ArrowLeft size={16} className={isRTL ? 'rotate-180' : ''} />
            <span>{t('nav.backToHome')}</span>
          </Link>

          {/* Tab Switcher with Modern Design */}
          <div className="partner-auth-tab-switcher bg-white/80 backdrop-blur-xl rounded-xl shadow-xl overflow-hidden mb-3 border border-white/50 relative group hover:shadow-2xl transition-all duration-500">
            {/* Animated Gradient Border */}
            <div className="absolute inset-0 bg-gradient-to-r from-morocco-red/20 via-morocco-green/20 to-morocco-gold/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-lg"></div>
            
            <div className="partner-auth-tabs flex border-b-2 border-gray-100 relative">
              {/* Animated Slider Background */}
              <div 
                className={`partner-auth-tab-slider absolute bottom-0 h-1 bg-gradient-to-r from-morocco-red via-morocco-green to-morocco-red transition-all duration-500 ease-in-out ${
                  activeTab === 'signup' ? 'left-0 w-1/2' : 'left-1/2 w-1/2'
                }`}
              ></div>
              
              <button
                onClick={() => setActiveTab('signup')}
                className={`partner-auth-tab-signup flex-1 py-2.5 px-4 font-bold text-sm transition-all duration-300 relative z-10 ${
                  activeTab === 'signup'
                    ? 'bg-gradient-to-r from-morocco-red to-morocco-green text-white shadow-md'
                    : 'text-gray-600 hover:text-morocco-red hover:bg-gray-50/50'
                }`}
              >
                <span className="flex items-center justify-center gap-1.5">
                  <Zap size={14} className={activeTab === 'signup' ? 'text-white' : 'text-morocco-gold'} />
                  {t('auth.signup.title')}
                </span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('login');
                  setLoginType(null); // Reset login type when switching to login tab
                }}
                className={`partner-auth-tab-login flex-1 py-2.5 px-4 font-bold text-sm transition-all duration-300 relative z-10 ${
                  activeTab === 'login'
                    ? 'bg-gradient-to-r from-morocco-red to-morocco-green text-white shadow-md'
                    : 'text-gray-600 hover:text-morocco-green hover:bg-gray-50/50'
                }`}
              >
                <span className="flex items-center justify-center gap-1.5">
                  <Briefcase size={14} className={activeTab === 'login' ? 'text-white' : 'text-morocco-green'} />
                  User Login
                </span>
              </button>
            </div>
          </div>

          {/* Login Form */}
          {activeTab === 'login' && (
            <div className="partner-auth-login-card bg-white/80 backdrop-blur-xl rounded-xl shadow-xl p-4 md:p-6 border border-white/50 relative overflow-hidden group hover:shadow-2xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-morocco-green/10 to-transparent rounded-bl-full"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-morocco-red/10 to-transparent rounded-tr-full"></div>
              
              {/* Type Selection Screen */}
              {!loginType && (
                <div className="relative z-10">
                  <div className="partner-auth-login-icon-header flex justify-center mb-4">
                    <div className="partner-auth-login-icon-wrapper w-12 h-12 bg-gradient-to-br from-morocco-green/20 via-morocco-green/10 to-morocco-red/10 rounded-xl flex items-center justify-center text-morocco-green shadow-lg shadow-morocco-green/20 relative group-hover:scale-110 transition-transform duration-300">
                        <Briefcase size={24} className="relative z-10" />
                        <div className="absolute inset-0 bg-gradient-to-br from-morocco-green/30 to-morocco-red/30 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>

                  <div className="partner-auth-login-header-text text-center mb-6">
                    <h1 className="partner-auth-login-title text-2xl font-bold text-gray-900 mb-1 bg-gradient-to-r from-morocco-red via-morocco-green to-morocco-gold bg-clip-text text-transparent">
                      {t('auth.login.title')}
                    </h1>
                    <p className="partner-auth-login-subtitle text-gray-600 text-sm">Select your account type to continue</p>
                  </div>

                  {/* Type Selection Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <button
                      onClick={() => {
                        setLoginType('driver');
                        navigate('/driver/login');
                      }}
                      className="relative p-4 rounded-xl border-2 border-gray-200 hover:border-morocco-green bg-white hover:bg-gradient-to-br hover:from-morocco-green/10 hover:to-morocco-green/5 transition-all duration-300 group hover:shadow-lg hover:scale-[1.02] text-left"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-morocco-green/20 to-morocco-green/10 flex items-center justify-center mb-3 group-hover:bg-gradient-to-br group-hover:from-morocco-green group-hover:to-morocco-green/70 transition-all">
                        <Car size={24} className="text-morocco-green group-hover:text-white transition-colors" />
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-morocco-green transition-colors">Driver</h3>
                      <p className="text-xs text-gray-500">Login as a driver partner</p>
                      <ArrowRight size={16} className="absolute top-4 right-4 text-gray-400 group-hover:text-morocco-green group-hover:translate-x-1 transition-all" />
                    </button>

                    <button
                      onClick={() => setLoginType('restaurant')}
                      className="relative p-4 rounded-xl border-2 border-gray-200 hover:border-morocco-red bg-white hover:bg-gradient-to-br hover:from-morocco-red/10 hover:to-morocco-red/5 transition-all duration-300 group hover:shadow-lg hover:scale-[1.02] text-left"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-morocco-red/20 to-morocco-red/10 flex items-center justify-center mb-3 group-hover:bg-gradient-to-br group-hover:from-morocco-red group-hover:to-morocco-red/70 transition-all">
                        <Store size={24} className="text-morocco-red group-hover:text-white transition-colors" />
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-morocco-red transition-colors">Restaurant</h3>
                      <p className="text-xs text-gray-500">Login as a restaurant partner</p>
                      <ArrowRight size={16} className="absolute top-4 right-4 text-gray-400 group-hover:text-morocco-red group-hover:translate-x-1 transition-all" />
                    </button>
                  </div>
                </div>
              )}

              {/* Restaurant Login Form (Empty) */}
              {loginType === 'restaurant' && (
                <div className="relative z-10">
                  <button
                    onClick={() => setLoginType(null)}
                    className={`mb-4 flex items-center gap-2 text-gray-500 hover:text-morocco-red transition-colors text-sm ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <ArrowLeft size={16} className={isRTL ? 'rotate-180' : ''} />
                    <span>Back to selection</span>
                  </button>

                  <div className="partner-auth-login-icon-header flex justify-center mb-4">
                    <div className="partner-auth-login-icon-wrapper w-12 h-12 bg-gradient-to-br from-morocco-red/20 via-morocco-red/10 to-morocco-red/5 rounded-xl flex items-center justify-center text-morocco-red shadow-lg shadow-morocco-red/20">
                        <Store size={24} />
                    </div>
                  </div>

                  <div className="partner-auth-login-header-text text-center mb-6">
                    <h1 className="partner-auth-login-title text-2xl font-bold text-gray-900 mb-1 bg-gradient-to-r from-morocco-red to-morocco-red/80 bg-clip-text text-transparent">
                      Restaurant Login
                    </h1>
                    <p className="partner-auth-login-subtitle text-gray-600 text-sm">Restaurant login form coming soon</p>
                  </div>

                  {/* Empty Placeholder */}
                  <div className="bg-gray-50 rounded-xl p-8 text-center border-2 border-dashed border-gray-200">
                    <Store size={48} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-sm">Restaurant login functionality will be available soon.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Signup Form */}
          {activeTab === 'signup' && (
            <div className="partner-auth-signup-card bg-white/80 backdrop-blur-xl rounded-xl shadow-xl overflow-hidden border border-white/50 relative group hover:shadow-2xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
              {/* Animated Gradient Border */}
              <div className="absolute inset-0 bg-gradient-to-r from-morocco-red/20 via-morocco-green/20 to-morocco-gold/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-lg"></div>
              
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-morocco-red/10 to-transparent rounded-bl-full"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-morocco-green/10 to-transparent rounded-tr-full"></div>
              
              <div className="partner-auth-signup-content p-4 md:p-6 relative z-10">
                <div className="partner-auth-signup-header text-center mb-4">
                  <h1 className="partner-auth-signup-title text-2xl md:text-3xl font-bold text-gray-900 mb-1 bg-gradient-to-r from-morocco-red via-morocco-green to-morocco-gold bg-clip-text text-transparent">
                    {t('auth.signup.title')}
                  </h1>
                  <p className="partner-auth-signup-subtitle text-gray-600 text-sm">{t('auth.signup.subtitle')}</p>
                </div>

                <form onSubmit={handleSignupSubmit}>
                  {/* Partner Type Selection */}
                  <div className="partner-auth-type-selection mb-4">
                    <label className={`partner-auth-type-label block text-base font-bold text-gray-800 mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                      <span className="flex items-center gap-1.5">
                        <Zap className="text-morocco-gold" size={16} />
                        {t('auth.signup.selectType')}
                      </span>
                    </label>
                    <div className="partner-auth-type-grid grid grid-cols-1 md:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleTypeSelect('driver')}
                        className={`partner-auth-type-card-driver relative p-3 rounded-lg border-2 text-left transition-all duration-300 group/type overflow-hidden ${
                          formData.partnerType === 'driver' 
                          ? 'border-morocco-green bg-gradient-to-br from-morocco-green/10 to-morocco-green/5 ring-2 ring-morocco-green/30 shadow-md scale-[1.02]' 
                          : 'border-gray-200 hover:border-morocco-green/40 bg-white hover:shadow-lg hover:scale-[1.01]'
                        }`}
                      >
                        <div className={`partner-auth-type-icon-driver w-10 h-10 rounded-lg flex items-center justify-center mb-2 transition-all duration-300 ${
                          formData.partnerType === 'driver' 
                          ? 'bg-gradient-to-br from-morocco-green to-morocco-green/70 text-white shadow-md' 
                          : 'bg-morocco-sand/50 text-morocco-green'
                        }`}>
                          <Car size={20} />
                        </div>
                        <h3 className={`partner-auth-type-title font-bold text-base mb-1 transition-colors ${
                          formData.partnerType === 'driver' ? 'text-morocco-green' : 'text-gray-800'
                        }`}>
                          {t('auth.signup.type.driver')}
                        </h3>
                        <p className="partner-auth-type-description text-xs text-gray-500 leading-snug">
                          {t('auth.signup.type.driverDesc')}
                        </p>
                        {formData.partnerType === 'driver' && (
                          <div className={`partner-auth-type-check absolute top-2 ${isRTL ? 'left-2' : 'right-2'} text-morocco-green animate-in zoom-in`}>
                            <CheckCircle2 size={20} className="drop-shadow-md" />
                          </div>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleTypeSelect('restaurant')}
                        className={`partner-auth-type-card-restaurant relative p-3 rounded-lg border-2 text-left transition-all duration-300 group/type overflow-hidden ${
                          formData.partnerType === 'restaurant' 
                          ? 'border-morocco-red bg-gradient-to-br from-morocco-red/10 to-morocco-red/5 ring-2 ring-morocco-red/30 shadow-md scale-[1.02]' 
                          : 'border-gray-200 hover:border-morocco-red/40 bg-white hover:shadow-lg hover:scale-[1.01]'
                        }`}
                      >
                        <div className={`partner-auth-type-icon-restaurant w-10 h-10 rounded-lg flex items-center justify-center mb-2 transition-all duration-300 ${
                          formData.partnerType === 'restaurant' 
                          ? 'bg-gradient-to-br from-morocco-red to-morocco-red/70 text-white shadow-md' 
                          : 'bg-morocco-sand/50 text-morocco-red'
                        }`}>
                          <Store size={20} />
                        </div>
                        <h3 className={`partner-auth-type-title font-bold text-base mb-1 transition-colors ${
                          formData.partnerType === 'restaurant' ? 'text-morocco-red' : 'text-gray-800'
                        }`}>
                          {t('auth.signup.type.restaurant')}
                        </h3>
                        <p className="partner-auth-type-description text-xs text-gray-500 leading-snug">
                          {t('auth.signup.type.restaurantDesc')}
                        </p>
                        {formData.partnerType === 'restaurant' && (
                          <div className={`partner-auth-type-check absolute top-2 ${isRTL ? 'left-2' : 'right-2'} text-morocco-red animate-in zoom-in`}>
                            <CheckCircle2 size={20} className="drop-shadow-md" />
                          </div>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="h-px w-full bg-gray-100 mb-4"></div>

                  {/* Personal Info */}
                  <div className="mb-4">
                    <div className={`flex items-center gap-2 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="w-7 h-7 rounded-full bg-morocco-sand/50 flex items-center justify-center text-morocco-green">
                        <User size={14} />
                      </div>
                      <h2 className="text-base font-bold text-gray-800">{t('auth.signup.section.personal')}</h2>
                    </div>

                    <div className="space-y-0.5">
                      <FormInput 
                        icon={User} 
                        label={t('auth.signup.fullName')} 
                        name="fullName" 
                        placeholder={t('auth.signup.fullNamePlaceholder')}
                        value={formData.fullName}
                        error={errors.fullName}
                        isRTL={isRTL}
                        onChange={handleInputChange}
                      />
                      <FormInput 
                        icon={Mail} 
                        label={t('auth.login.email')} 
                        name="email" 
                        type="email" 
                        placeholder={t('auth.login.emailPlaceholder')}
                        value={formData.email}
                        error={errors.email}
                        isRTL={isRTL}
                        onChange={handleInputChange}
                      />
                      <FormInput 
                        icon={Phone} 
                        label={t('auth.signup.phone')} 
                        name="phone" 
                        type="tel" 
                        placeholder={t('auth.signup.phonePlaceholder')}
                        value={formData.phone}
                        error={errors.phone}
                        isRTL={isRTL}
                        onChange={handleInputChange}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3">
                        <FormInput 
                          icon={Lock} 
                          label={t('auth.login.password')} 
                          name="password" 
                          type="password" 
                          placeholder="••••••••"
                          value={formData.password}
                          error={errors.password}
                          isRTL={isRTL}
                          onChange={handleInputChange}
                        />
                        <FormInput 
                          icon={Lock} 
                          label={t('auth.signup.confirmPassword')} 
                          name="confirmPassword" 
                          type="password" 
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          error={errors.confirmPassword}
                          isRTL={isRTL}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      {formData.password && (
                        <div className={`flex items-center gap-2 pt-0.5 ${isRTL ? 'justify-end' : ''}`}>
                          <div className="flex gap-1 h-1 flex-1 max-w-[70px]">
                            <div className={`flex-1 rounded-full ${strength >= 1 ? 'bg-red-500' : 'bg-gray-200'}`}></div>
                            <div className={`flex-1 rounded-full ${strength >= 2 ? 'bg-yellow-500' : 'bg-gray-200'}`}></div>
                            <div className={`flex-1 rounded-full ${strength >= 3 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                          </div>
                          <span className="text-xs text-gray-500">
                            {strength === 1 && t('auth.password.strength.weak')}
                            {strength === 2 && t('auth.password.strength.medium')}
                            {strength === 3 && t('auth.password.strength.strong')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <hr className="border-gray-100 mb-4" />

                  {/* Vehicle/Business Info */}
                  <div className="mb-4">
                    <div className={`flex items-center gap-2 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center ${formData.partnerType === 'driver' ? 'bg-morocco-green/10 text-morocco-green' : 'bg-morocco-red/10 text-morocco-red'}`}>
                        {formData.partnerType === 'driver' ? <Car size={14} /> : <Store size={14} />}
                      </div>
                      <h2 className="text-base font-bold text-gray-800">
                        {formData.partnerType === 'driver' ? t('auth.signup.section.vehicle') : t('auth.signup.section.business')}
                      </h2>
                    </div>

                    {formData.partnerType === 'driver' ? (
                      <div className="space-y-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3">
                          <FormInput 
                            icon={Car} 
                            label={t('auth.signup.vehicleModel')} 
                            name="vehicleModel" 
                            placeholder="e.g. Dacia Logan"
                            value={formData.vehicleModel || ''}
                            error={errors.vehicleModel}
                            isRTL={isRTL}
                            onChange={handleInputChange}
                          />
                          <FormInput 
                            icon={FileText} 
                            label={t('auth.signup.licensePlate')} 
                            name="licensePlate" 
                            placeholder="12345-A-1"
                            value={formData.licensePlate || ''}
                            error={errors.licensePlate}
                            isRTL={isRTL}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <label className={`block text-xs font-medium text-gray-700 mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                            {t('auth.signup.vehicleType')}
                          </label>
                          <div className="relative">
                            <select 
                              className={`w-full py-2 text-sm px-3 border border-gray-200 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-morocco-red/50 ${isRTL ? 'text-right pr-8 pl-3' : 'text-left pl-8 pr-3'}`}
                              value={formData.vehicleType}
                              onChange={(e) => handleInputChange('vehicleType', e.target.value)}
                            >
                              <option value="car">{t('auth.signup.type.car')}</option>
                              <option value="motorcycle">{t('auth.signup.type.motorcycle')}</option>
                            </select>
                            <ChevronDown className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none ${isRTL ? 'left-3' : 'right-3'}`} size={16} />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <FormInput 
                          icon={Store} 
                          label={t('auth.signup.restaurantName')} 
                          name="restaurantName" 
                          placeholder="e.g. Tasty Tagine"
                          value={formData.restaurantName || ''}
                          error={errors.restaurantName}
                          isRTL={isRTL}
                          onChange={handleInputChange}
                        />
                        <FormInput 
                          icon={MapPin} 
                          label={t('auth.signup.restaurantAddress')} 
                          name="restaurantAddress" 
                          placeholder="e.g. 123 Mohammed V Blvd"
                          value={formData.restaurantAddress || ''}
                          error={errors.restaurantAddress}
                          isRTL={isRTL}
                          onChange={handleInputChange}
                        />
                        <FormInput 
                          icon={Utensils} 
                          label={t('auth.signup.cuisineType')} 
                          name="cuisineType" 
                          placeholder="e.g. Moroccan, Fast Food"
                          value={formData.cuisineType || ''}
                          error={errors.cuisineType}
                          isRTL={isRTL}
                          onChange={handleInputChange}
                        />
                      </div>
                    )}
                  </div>

                  <hr className="border-gray-100 mb-4" />

                  {/* Terms & Submit */}
                  <div className={`flex items-center gap-2 mb-3 p-2.5 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors ${errors.agreedToTerms ? 'ring-2 ring-red-200 bg-red-50' : ''}`}
                       onClick={() => handleInputChange('agreedToTerms', !formData.agreedToTerms)}>
                    <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center transition-colors ${formData.agreedToTerms ? 'bg-morocco-green border-morocco-green' : 'border-gray-300 bg-white'}`}>
                      {formData.agreedToTerms && <CheckCircle2 size={12} className="text-white" />}
                    </div>
                    <span className={`text-xs ${errors.agreedToTerms ? 'text-red-600' : 'text-gray-600'}`}>{t('auth.signup.terms')}</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoadingSignup}
                    className="partner-auth-signup-submit-button w-full py-2.5 px-4 bg-gradient-to-r from-morocco-red via-morocco-green to-morocco-red text-white font-bold rounded-lg shadow-lg shadow-morocco-green/30 hover:shadow-xl hover:shadow-morocco-green/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm relative overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center gap-1.5">
                      {isLoadingSignup ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <>
                          {t('auth.signup.submit')}
                          {isRTL ? <ArrowLeft size={14} className="group-hover:translate-x-[-4px] transition-transform" /> : <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />}
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-morocco-green via-morocco-red to-morocco-green bg-[length:200%_100%] animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PartnerLoginSignUP;

