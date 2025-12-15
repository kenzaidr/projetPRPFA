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
  CheckCircle2,
  Smartphone,
  Globe
} from 'lucide-react';
import { 
  languageConfig, 
  getTranslation, 
  getCurrentLanguage, 
  setLanguage, 
  type Language 
} from '../utils/translations';

// === User (Passenger) Data Interface ===
interface UserFormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreedToTerms: boolean;
}

// === Reusable Form Input Component ===
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
  <div className="mb-3">
    <label className={`block text-xs font-medium text-gray-700 mb-1.5 ${isRTL ? 'text-right' : 'text-left'}`}>
      {label}
    </label>
    <div className="relative group">
      {Icon && React.createElement(Icon, { 
        className: `absolute top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-morocco-red transition-colors duration-300 ${isRTL ? 'right-3' : 'left-3'}`, 
        size: 18 
      })}
      <input
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className={`w-full py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300
          ${error
            ? 'border-red-300 focus:ring-red-200 bg-red-50' 
            : 'border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-morocco-red/20 focus:border-morocco-red'}
          ${isRTL ? 'pr-10 pl-3 text-right' : 'pl-10 pr-3 text-left'}`}
        placeholder={placeholder}
      />
      {error && (
        <div className={`absolute -bottom-5 ${isRTL ? 'right-0' : 'left-0'} text-xs text-red-500 flex items-center gap-1 animate-in slide-in-from-top-1`}>
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

  // Login Logic
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
      navigate('/home'); 
    }, 1500);
  };

  // Signup Logic
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
        navigate('/home');
      }, 2000);
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const strength = getPasswordStrength(formData.password);

  const SocialLoginSection = () => (
    <div className="mt-6 mb-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button type="button" className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <Globe size={18} className="text-gray-600" /> 
          <span className="text-sm font-medium text-gray-600">Google</span>
        </button>
        <button type="button" className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <Smartphone size={18} className="text-gray-600" /> 
          <span className="text-sm font-medium text-gray-600">Mobile</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="user-interface-root min-h-screen bg-gradient-to-br from-morocco-sand/20 via-white via-morocco-green/5 to-morocco-red/5 relative overflow-hidden" dir={config.dir}>
      {/* Background */}
      <div className="absolute inset-0 moroccan-pattern opacity-[0.02] pointer-events-none"></div>
      <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-morocco-red/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-morocco-green/5 rounded-full blur-3xl"></div>

      {/* Header */}
      <header className="relative z-20 w-full p-4 flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-morocco-red via-morocco-green to-morocco-gold rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg transition-transform group-hover:scale-105">
            G
          </div>
          <span className="font-bold text-lg hidden sm:block bg-gradient-to-r from-morocco-red to-morocco-green bg-clip-text text-transparent">
            Grab Morocco
          </span>
        </Link>
        <div className="relative">
          <button 
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full shadow-sm border border-gray-100 hover:shadow-md transition-all"
          >
            <span className="text-sm font-medium text-gray-700">{config.label}</span>
            <ChevronDown size={14} className={`text-gray-400 transition-transform ${showLangMenu ? 'rotate-180' : ''}`} />
          </button>
          {showLangMenu && (
            <div className={`absolute top-full mt-2 py-2 w-36 bg-white rounded-xl shadow-xl border border-gray-100 z-50 ${isRTL ? 'left-0' : 'right-0'}`}>
              {(Object.keys(languageConfig) as Language[]).map((langCode) => (
                <button
                  key={langCode}
                  onClick={() => handleLangChange(langCode)}
                  className={`w-full px-4 py-2 text-sm transition-colors flex items-center justify-between
                    ${currentLang === langCode ? 'text-morocco-red font-semibold bg-red-50' : 'text-gray-600 hover:bg-gray-50'} 
                    ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  {languageConfig[langCode].label}
                  {currentLang === langCode && <CheckCircle2 size={14} className="text-morocco-red" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-6 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        
        <div className="w-full max-w-md">
          <Link to="/" className={`inline-flex items-center gap-2 text-gray-500 hover:text-morocco-red mb-6 transition-colors text-sm font-medium ${isRTL ? 'flex-row-reverse' : ''}`}>
            <ArrowLeft size={18} className={isRTL ? 'rotate-180' : ''} />
            <span>{t('nav.backToHome')}</span>
          </Link>

          {/* Toggle Tabs - UPDATED: Hardcoded "Log In" and "Sign Up" to remove "Partner" */}
          <div className="bg-white rounded-2xl p-1 shadow-lg shadow-gray-200/50 mb-6 border border-gray-100">
            <div className="flex relative">
              <div 
                className={`absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-morocco-red to-morocco-green rounded-xl shadow-md transition-all duration-300 ease-in-out ${
                  activeTab === 'login' ? 'left-0' : 'left-1/2'
                }`}
              ></div>
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-2.5 text-sm font-bold relative z-10 transition-colors duration-300 ${
                  activeTab === 'login' ? 'text-white' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Log In
              </button>
              <button
                onClick={() => setActiveTab('signup')}
                className={`flex-1 py-2.5 text-sm font-bold relative z-10 transition-colors duration-300 ${
                  activeTab === 'signup' ? 'text-white' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Login Form */}
          {activeTab === 'login' && (
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/40 border border-gray-100 p-6 md:p-8 animate-in fade-in zoom-in-95 duration-300">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-morocco-red">
                  <User size={32} />
                </div>
                {/* Changed Title to hardcoded 'Welcome Back' */}
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                <p className="text-gray-500 text-sm">Please enter your details to sign in</p>
              </div>

              {loginError && (
                <div className={`mb-4 p-3 rounded-xl bg-red-50 border border-red-100 flex items-start gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={16} />
                  <span className={`text-sm text-red-600 font-medium ${isRTL ? 'text-right' : 'text-left'}`}>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className={`block text-xs font-semibold text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}>{t('auth.login.email')}</label>
                  <div className="relative group">
                    <Mail className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} size={18} />
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-morocco-red/20 focus:border-morocco-red transition-all
                        ${isRTL ? 'pr-10 pl-3 text-right' : 'pl-10 pr-3 text-left'}`}
                      placeholder="hello@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className={`block text-xs font-semibold text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}>{t('auth.login.password')}</label>
                  <div className="relative group">
                    <Lock className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} size={18} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-morocco-red/20 focus:border-morocco-red transition-all
                        ${isRTL ? 'pr-10 pl-10 text-right' : 'pl-10 pr-10 text-left'}`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-morocco-red transition-colors ${isRTL ? 'left-3' : 'right-3'}`}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className={`flex ${isRTL ? 'justify-start' : 'justify-end'}`}>
                  <button type="button" className="text-xs font-medium text-morocco-red hover:text-morocco-green transition-colors">
                    {t('auth.login.forgotPassword')}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoadingLogin}
                  className="w-full py-3 bg-gradient-to-r from-morocco-red to-morocco-green text-white font-bold rounded-xl shadow-lg shadow-morocco-red/20 hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {/* Changed button text to hardcoded 'Log In' */}
                  {isLoadingLogin ? <Loader2 className="animate-spin" size={20} /> : "Log In"}
                </button>
              </form>

              <SocialLoginSection />
            </div>
          )}

          {/* Signup Form */}
          {activeTab === 'signup' && (
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/40 border border-gray-100 p-6 md:p-8 animate-in fade-in zoom-in-95 duration-300">
               <div className="text-center mb-6">
                 {/* Changed Title to hardcoded 'Create Account' */}
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
                <p className="text-gray-500 text-sm">Join us and start riding today</p>
              </div>

              <form onSubmit={handleSignupSubmit}>
                <div className="space-y-2">
                  <FormInput 
                    icon={User} 
                    label={t('auth.signup.fullName')} 
                    name="fullName" 
                    placeholder="John Doe"
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
                    placeholder="hello@example.com"
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
                    placeholder="+212 6..."
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
                    <div className="flex gap-1 h-1.5 mb-4">
                      <div className={`flex-1 rounded-full transition-colors ${strength >= 1 ? 'bg-red-500' : 'bg-gray-100'}`}></div>
                      <div className={`flex-1 rounded-full transition-colors ${strength >= 2 ? 'bg-yellow-500' : 'bg-gray-100'}`}></div>
                      <div className={`flex-1 rounded-full transition-colors ${strength >= 3 ? 'bg-green-500' : 'bg-gray-100'}`}></div>
                    </div>
                  )}

                  <div className={`flex items-start gap-3 p-3 rounded-lg border ${errors.agreedToTerms ? 'border-red-200 bg-red-50' : 'border-gray-100 bg-gray-50'}`}>
                    <div 
                      className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-colors ${formData.agreedToTerms ? 'bg-morocco-green border-morocco-green' : 'border-gray-300 bg-white'}`}
                      onClick={() => setFormData(prev => ({ ...prev, agreedToTerms: !prev.agreedToTerms }))}
                    >
                      {formData.agreedToTerms && <CheckCircle2 size={14} className="text-white" />}
                    </div>
                    <span className="text-xs text-gray-500 leading-relaxed">
                      I agree to the <span className="text-morocco-green font-semibold cursor-pointer">Terms of Service</span> and <span className="text-morocco-green font-semibold cursor-pointer">Privacy Policy</span>.
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoadingSignup}
                    className="w-full mt-4 py-3 bg-gradient-to-r from-morocco-red to-morocco-green text-white font-bold rounded-xl shadow-lg shadow-morocco-green/20 hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {/* Changed button text to hardcoded 'Sign Up' */}
                    {isLoadingSignup ? <Loader2 className="animate-spin" size={20} /> : "Sign Up"}
                  </button>
                </div>
              </form>
              <SocialLoginSection />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserLogin;