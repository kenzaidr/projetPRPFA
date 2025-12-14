import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChevronDown, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  AlertCircle,
  Loader2,
  User,
  Phone,
  Sparkles,
  Zap,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { 
  languageConfig, 
  getTranslation, 
  getCurrentLanguage, 
  setLanguage, 
  type Language 
} from '../utils/translations';

interface UserFormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreedToTerms: boolean;
}

// Form Input Component
interface FormInputProps {
  icon: React.ComponentType<any>;
  label: string;
  name: keyof Omit<UserFormData, 'agreedToTerms'>;
  type?: string;
  placeholder: string;
  value: string;
  error?: string;
  isRTL: boolean;
  onChange: (name: keyof Omit<UserFormData, 'agreedToTerms'>, value: string) => void;
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
      {Icon && React.createElement(Icon, { 
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

const UserLogin: React.FC = () => {
  const navigate = useNavigate();
  const [currentLang, setCurrentLangState] = useState<Language>(getCurrentLanguage());
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  
  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Signup state
  const [formData, setFormData] = useState<UserFormData>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreedToTerms: false
  });
  const [errors, setErrors] = useState<Partial<Record<keyof UserFormData, string>>>({});
  const [isLoadingSignup, setIsLoadingSignup] = useState(false);

  const t = (key: string) => getTranslation(key, currentLang);
  const config = languageConfig[currentLang];
  const isRTL = config.dir === 'rtl';

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.setAttribute('lang', config.lang);
    document.documentElement.setAttribute('dir', config.dir);
    document.body.className = document.body.className.replace(/\b(rtl|ltr)\b/g, '');
    document.body.classList.add(config.dir);
  }, [currentLang, config]);

  const handleLangChange = (lang: Language) => {
    setLanguage(lang);
    setCurrentLangState(lang);
    setShowLangMenu(false);
  };

  // Login handlers
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoadingLogin(true);

    if (!email || !password) {
      setLoginError(t('auth.error.invalidCredentials'));
      setIsLoadingLogin(false);
      return;
    }

    setTimeout(() => {
      setIsLoadingLogin(false);
      navigate('/driver');
    }, 1500);
  };

  // Signup handlers
  const handleInputChange = useCallback((field: keyof Omit<UserFormData, 'agreedToTerms'>, value: string) => {
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

  const getPasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length > 7) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const validateSignup = (): boolean => {
    const newErrors: Partial<Record<keyof UserFormData, string>> = {};

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
        navigate('/driver');
      }, 2000);
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const strength = getPasswordStrength(formData.password);

  return (
    <div className="user-login-page-container min-h-screen bg-gradient-to-br from-morocco-sand/40 via-white via-morocco-green/5 to-morocco-red/10 relative overflow-hidden" dir={config.dir}>
      {/* Animated Background */}
      <div className="user-login-background-pattern absolute inset-0 moroccan-pattern opacity-[0.03] pointer-events-none"></div>
      
      {/* Floating Gradient Orbs */}
      <div className="user-login-orb-1 absolute top-20 -left-32 w-[600px] h-[600px] bg-gradient-to-br from-morocco-red/15 to-morocco-green/15 rounded-full blur-3xl animate-pulse"></div>
      <div className="user-login-orb-2 absolute bottom-20 -right-32 w-[600px] h-[600px] bg-gradient-to-br from-morocco-green/15 to-morocco-gold/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>

      {/* Header */}
      <header className="user-login-header relative z-20 w-full p-2 md:p-3 flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/" className="user-login-logo-link flex items-center gap-2 group">
          <div className="user-login-logo-icon w-9 h-9 bg-gradient-to-br from-morocco-red via-morocco-green to-morocco-gold rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-morocco-red/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl">
            G
          </div>
          <span className="user-login-logo-text font-bold text-base hidden sm:block bg-gradient-to-r from-morocco-red via-morocco-green to-morocco-gold bg-clip-text text-transparent">
            Grab Morocco
          </span>
        </Link>

        <div className="user-login-language-switcher relative">
          <button 
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="user-login-language-button flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-md rounded-full shadow-md hover:shadow-lg transition-all border border-white/50 hover:scale-105"
          >
            <span className="font-medium text-gray-700">{config.label}</span>
            <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${showLangMenu ? 'rotate-180' : ''}`} />
          </button>

          {showLangMenu && (
            <div className={`user-login-language-dropdown absolute top-full mt-2 py-2 w-36 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/50 z-50 animate-in fade-in slide-in-from-top-2 ${isRTL ? 'left-0' : 'right-0'}`}>
              {(Object.keys(languageConfig) as Language[]).map((langCode) => (
                <button
                  key={langCode}
                  onClick={() => handleLangChange(langCode)}
                  className={`user-login-language-option w-full px-4 py-2.5 text-sm transition-all duration-200 flex items-center justify-between
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
        
        <div className="w-full max-w-md">
          {/* Back Link */}
          <Link to="/" className={`inline-flex items-center gap-1.5 text-gray-500 hover:text-morocco-green mb-2 transition-colors text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
            <ArrowLeft size={16} className={isRTL ? 'rotate-180' : ''} />
            <span>{t('nav.backToHome')}</span>
          </Link>

          {/* Tab Switcher */}
          <div className="user-login-tab-switcher bg-white/80 backdrop-blur-xl rounded-xl shadow-xl overflow-hidden mb-3 border border-white/50 relative group hover:shadow-2xl transition-all duration-500">
            <div className="user-login-tabs flex border-b-2 border-gray-100 relative">
              <div 
                className={`user-login-tab-slider absolute bottom-0 h-1 bg-gradient-to-r from-morocco-red via-morocco-green to-morocco-red transition-all duration-500 ease-in-out ${
                  activeTab === 'login' ? 'left-0 w-1/2' : 'left-1/2 w-1/2'
                }`}
              ></div>
              
              <button
                onClick={() => setActiveTab('login')}
                className={`user-login-tab-login flex-1 py-2.5 px-4 font-bold text-sm transition-all duration-300 relative z-10 ${
                  activeTab === 'login'
                    ? 'bg-gradient-to-r from-morocco-red to-morocco-green text-white shadow-md'
                    : 'text-gray-600 hover:text-morocco-red hover:bg-gray-50/50'
                }`}
              >
                <span className="flex items-center justify-center gap-1.5">
                  <User size={14} className={activeTab === 'login' ? 'text-white' : 'text-morocco-red'} />
                  {t('auth.login.title')}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('signup')}
                className={`user-login-tab-signup flex-1 py-2.5 px-4 font-bold text-sm transition-all duration-300 relative z-10 ${
                  activeTab === 'signup'
                    ? 'bg-gradient-to-r from-morocco-red to-morocco-green text-white shadow-md'
                    : 'text-gray-600 hover:text-morocco-green hover:bg-gray-50/50'
                }`}
              >
                <span className="flex items-center justify-center gap-1.5">
                  <Zap size={14} className={activeTab === 'signup' ? 'text-white' : 'text-morocco-gold'} />
                  {t('auth.signup.title')}
                </span>
              </button>
            </div>
          </div>

          {/* Login Form */}
          {activeTab === 'login' && (
            <div className="user-login-card bg-white/80 backdrop-blur-xl rounded-xl shadow-xl p-4 md:p-6 border border-white/50 relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-morocco-green/10 to-transparent rounded-bl-full"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-morocco-red/10 to-transparent rounded-tr-full"></div>
              
              <div className="user-login-icon-header flex justify-center mb-4 relative z-10">
                <div className="user-login-icon-wrapper w-12 h-12 bg-gradient-to-br from-morocco-green/20 via-morocco-green/10 to-morocco-red/10 rounded-xl flex items-center justify-center text-morocco-green shadow-lg shadow-morocco-green/20 relative group-hover:scale-110 transition-transform duration-300">
                    <User size={24} className="relative z-10" />
                </div>
              </div>

              <div className="user-login-header-text text-center mb-4 relative z-10">
                <h1 className="user-login-title text-2xl font-bold text-gray-900 mb-1 bg-gradient-to-r from-morocco-red via-morocco-green to-morocco-gold bg-clip-text text-transparent">
                  {t('auth.login.title')}
                </h1>
                <p className="user-login-subtitle text-gray-600 text-sm">{t('auth.login.subtitle')}</p>
              </div>

              {loginError && (
                <div className={`user-login-error mb-3 p-2.5 rounded-lg bg-gradient-to-r from-red-50 to-red-100/50 border border-red-200/50 flex items-start gap-2 shadow-md relative z-10 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={16} />
                  <span className={`text-xs text-red-700 font-medium ${isRTL ? 'text-right' : 'text-left'}`}>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="user-login-form space-y-3 relative z-10">
                <div className="user-login-input-group">
                  <label className={`block text-xs font-semibold text-gray-700 mb-1.5 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('auth.login.email')}
                  </label>
                  <div className="relative group">
                    {React.createElement(Mail, { 
                      className: `absolute top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-morocco-red transition-colors duration-300 ${isRTL ? 'right-3' : 'left-3'}`, 
                      size: 16 
                    })}
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-morocco-red/30 focus:border-morocco-red transition-all duration-300 bg-white/50 backdrop-blur-sm
                        ${isRTL ? 'pr-8 pl-3 text-right' : 'pl-8 pr-3 text-left'}`}
                      placeholder={t('auth.login.emailPlaceholder')}
                    />
                  </div>
                </div>

                <div className="user-login-input-group">
                  <label className={`block text-xs font-semibold text-gray-700 mb-1.5 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('auth.login.password')}
                  </label>
                  <div className="relative group">
                    {React.createElement(Lock, { 
                      className: `absolute top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-morocco-red transition-colors duration-300 ${isRTL ? 'right-3' : 'left-3'}`, 
                      size: 16 
                    })}
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-morocco-red/30 focus:border-morocco-red transition-all duration-300 bg-white/50 backdrop-blur-sm
                        ${isRTL ? 'pr-10 pl-8 text-right' : 'pl-8 pr-10 text-left'}`}
                      placeholder={t('auth.login.passwordPlaceholder')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-morocco-red transition-all duration-300 ${isRTL ? 'left-3' : 'right-3'}`}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <div className={`mt-1 flex ${isRTL ? 'justify-start' : 'justify-end'}`}>
                    <button type="button" className="text-xs text-morocco-red hover:text-morocco-green font-semibold transition-all duration-300 hover:underline">
                      {t('auth.login.forgotPassword')}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoadingLogin}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-morocco-red via-morocco-green to-morocco-red text-white font-bold rounded-lg shadow-lg shadow-morocco-green/30 hover:shadow-xl hover:shadow-morocco-green/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 relative overflow-hidden group text-sm"
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    {isLoadingLogin ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        {t('auth.login.submit')}
                        <ArrowLeft size={14} className={`${isRTL ? '' : 'rotate-180'} group-hover:translate-x-1 transition-transform`} />
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-morocco-green via-morocco-red to-morocco-green bg-[length:200%_100%] animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </button>
              </form>
            </div>
          )}

          {/* Signup Form */}
          {activeTab === 'signup' && (
            <div className="user-signup-card bg-white/80 backdrop-blur-xl rounded-xl shadow-xl overflow-hidden border border-white/50 relative group hover:shadow-2xl transition-all duration-500">
              <div className="h-1 bg-gradient-to-r from-morocco-red via-morocco-green to-morocco-gold"></div>
              
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-morocco-red/10 to-transparent rounded-bl-full"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-morocco-green/10 to-transparent rounded-tr-full"></div>
              
              <div className="user-signup-content p-4 md:p-6 relative z-10">
                <div className="user-signup-header text-center mb-4">
                  <h1 className="user-signup-title text-2xl md:text-3xl font-bold text-gray-900 mb-1 bg-gradient-to-r from-morocco-red via-morocco-green to-morocco-gold bg-clip-text text-transparent">
                    {t('auth.signup.title')}
                  </h1>
                  <p className="user-signup-subtitle text-gray-600 text-sm">{t('auth.signup.subtitle')}</p>
                </div>

                <form onSubmit={handleSignupSubmit}>
                  <div className="space-y-2">
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

                  <div className={`flex items-center gap-2 mb-4 mt-4 p-2.5 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors ${errors.agreedToTerms ? 'ring-2 ring-red-200 bg-red-50' : ''}`}
                       onClick={() => setFormData(prev => ({ ...prev, agreedToTerms: !prev.agreedToTerms }))}>
                    <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center transition-colors ${formData.agreedToTerms ? 'bg-morocco-green border-morocco-green' : 'border-gray-300 bg-white'}`}>
                      {formData.agreedToTerms && <CheckCircle2 size={12} className="text-white" />}
                    </div>
                    <span className={`text-xs ${errors.agreedToTerms ? 'text-red-600' : 'text-gray-600'}`}>{t('auth.signup.terms')}</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoadingSignup}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-morocco-red via-morocco-green to-morocco-red text-white font-bold rounded-lg shadow-lg shadow-morocco-green/30 hover:shadow-xl hover:shadow-morocco-green/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm relative overflow-hidden group"
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

export default UserLogin;

