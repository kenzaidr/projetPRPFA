import React, { useState, useEffect } from 'react';
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
  Briefcase,
  Sparkles
} from 'lucide-react';
import { 
  languageConfig, 
  getTranslation, 
  getCurrentLanguage, 
  setLanguage, 
  type Language 
} from '../utils/translations';

const DriverLogin: React.FC = () => {
  const navigate = useNavigate();
  const [currentLang, setCurrentLangState] = useState<Language>(getCurrentLanguage());
  const [showLangMenu, setShowLangMenu] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = (key: string) => getTranslation(key, currentLang);
  const config = languageConfig[currentLang];
  const isRTL = config.dir === 'rtl';

  useEffect(() => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!email || !password) {
      setError(t('auth.error.invalidCredentials'));
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      setIsLoading(false);
      navigate('/driver');
    }, 1500);
  };

  return (
    <div className="login-page-container min-h-screen bg-gradient-to-br from-morocco-sand/40 via-white via-morocco-green/5 to-morocco-red/10 relative overflow-hidden" dir={config.dir}>
      {/* Animated Background Elements */}
      <div className="login-background-pattern absolute inset-0 moroccan-pattern opacity-[0.03] pointer-events-none"></div>
      
      {/* Floating Gradient Orbs */}
      <div className="login-orb-1 absolute top-20 -left-20 w-96 h-96 bg-gradient-to-br from-morocco-red/20 to-morocco-green/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="login-orb-2 absolute bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-morocco-green/20 to-morocco-gold/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* Header */}
      <header className="login-header relative z-20 w-full p-4 md:p-6 flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/" className="login-logo-link flex items-center gap-3 group">
          <div className="login-logo-icon w-12 h-12 bg-gradient-to-br from-morocco-red via-morocco-green to-morocco-gold rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-morocco-red/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl">
            G
          </div>
          <span className="login-logo-text font-bold text-lg hidden sm:block bg-gradient-to-r from-morocco-red via-morocco-green to-morocco-gold bg-clip-text text-transparent">
            Grab Morocco
          </span>
        </Link>

        <div className="login-language-switcher relative">
          <button 
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="login-language-button flex items-center gap-2 px-4 py-2.5 bg-white/80 backdrop-blur-md rounded-full shadow-md hover:shadow-lg transition-all border border-white/50 hover:scale-105"
          >
            <span className="font-medium text-gray-700">{config.label}</span>
            <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${showLangMenu ? 'rotate-180' : ''}`} />
          </button>

          {showLangMenu && (
            <div className={`login-language-dropdown absolute top-full mt-2 py-2 w-36 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/50 z-50 animate-in fade-in slide-in-from-top-2 ${isRTL ? 'left-0' : 'right-0'}`}>
              {(Object.keys(languageConfig) as Language[]).map((langCode) => (
                <button
                  key={langCode}
                  onClick={() => handleLangChange(langCode)}
                  className={`login-language-option w-full px-4 py-2.5 text-sm transition-all duration-200 flex items-center justify-between
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
      <main className="login-main-content relative z-10 container mx-auto px-4 py-8 md:py-12 flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
        
        <div className="login-content-wrapper w-full max-w-md">
          {/* Back Link */}
          <Link to="/" className={`login-back-link inline-flex items-center gap-2 text-gray-500 hover:text-morocco-green mb-8 transition-all duration-300 group ${isRTL ? 'flex-row-reverse' : ''}`}>
            <ArrowLeft size={20} className={`${isRTL ? 'rotate-180' : ''} group-hover:translate-x-[-4px] transition-transform`} />
            <span className="font-medium">{t('nav.backToHome')}</span>
          </Link>

          {/* Login Card with Glassmorphism */}
          <div className="login-card bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-white/50 relative overflow-hidden group hover:shadow-3xl transition-all duration-500">
            {/* Animated Gradient Border */}
            <div className="absolute inset-0 bg-gradient-to-r from-morocco-red/20 via-morocco-green/20 to-morocco-gold/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"></div>
            
            {/* Decorative Corner Accents */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-morocco-red/10 to-transparent rounded-bl-full opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-morocco-green/10 to-transparent rounded-tr-full opacity-50"></div>
            
            {/* Icon Header with Animation */}
            <div className="login-icon-header flex justify-center mb-8">
                <div className="login-icon-wrapper w-20 h-20 bg-gradient-to-br from-morocco-green/20 via-morocco-green/10 to-morocco-red/10 rounded-2xl flex items-center justify-center text-morocco-green shadow-lg shadow-morocco-green/20 relative group-hover:scale-110 transition-transform duration-300">
                    <Briefcase size={36} className="relative z-10" />
                    <div className="absolute inset-0 bg-gradient-to-br from-morocco-green/30 to-morocco-red/30 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
            </div>

            <div className="login-header-text text-center mb-8">
              <h1 className="login-title text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-morocco-red via-morocco-green to-morocco-gold bg-clip-text text-transparent">
                {t('auth.login.title')}
              </h1>
              <p className="login-subtitle text-gray-600 text-lg">{t('auth.login.subtitle')}</p>
            </div>

            {error && (
              <div className={`login-error-alert mb-6 p-4 rounded-2xl bg-gradient-to-r from-red-50 to-red-100/50 border-2 border-red-200/50 flex items-start gap-3 shadow-lg animate-in slide-in-from-top-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
                <span className={`text-sm text-red-700 font-medium ${isRTL ? 'text-right' : 'text-left'}`}>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form space-y-6">
              
              {/* Email Input */}
              <div className="login-input-group">
                <label className={`login-input-label block text-sm font-semibold text-gray-700 mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('auth.login.email')}
                </label>
                <div className="login-input-wrapper relative group">
                  <Mail 
                    className={`login-input-icon absolute top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-morocco-red transition-colors duration-300 ${isRTL ? 'right-4' : 'left-4'}`} 
                    size={20} 
                  />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`login-input-email w-full py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-morocco-red/20 focus:border-morocco-red transition-all duration-300 bg-white/50 backdrop-blur-sm
                      ${isRTL ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4 text-left'}`}
                    placeholder={t('auth.login.emailPlaceholder')}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="login-input-group">
                <label className={`login-input-label block text-sm font-semibold text-gray-700 mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('auth.login.password')}
                </label>
                <div className="login-input-wrapper relative group">
                  <Lock 
                    className={`login-input-icon absolute top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-morocco-red transition-colors duration-300 ${isRTL ? 'right-4' : 'left-4'}`} 
                    size={20} 
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`login-input-password w-full py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-morocco-red/20 focus:border-morocco-red transition-all duration-300 bg-white/50 backdrop-blur-sm
                      ${isRTL ? 'pr-12 pl-12 text-right' : 'pl-12 pr-12 text-left'}`}
                    placeholder={t('auth.login.passwordPlaceholder')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`login-password-toggle absolute top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-morocco-red transition-all duration-300 ${isRTL ? 'left-4' : 'right-4'}`}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className={`login-forgot-password mt-3 flex ${isRTL ? 'justify-start' : 'justify-end'}`}>
                  <button type="button" className="login-forgot-link text-sm text-morocco-red hover:text-morocco-green font-semibold transition-all duration-300 hover:underline">
                    {t('auth.login.forgotPassword')}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="login-submit-button w-full py-4 px-6 bg-gradient-to-r from-morocco-red via-morocco-green to-morocco-red text-white font-bold rounded-xl shadow-xl shadow-morocco-green/30 hover:shadow-2xl hover:shadow-morocco-green/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      {t('auth.login.submit')}
                      <ArrowLeft size={18} className={`${isRTL ? '' : 'rotate-180'} group-hover:translate-x-1 transition-transform`} />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-morocco-green via-morocco-red to-morocco-green bg-[length:200%_100%] animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </button>
            </form>

           {/* Footer */}
           <div className="login-footer mt-8 pt-6 border-t-2 border-gray-100/50 text-center">
              <p className="login-footer-text text-gray-600">
                {t('auth.login.noAccount')}{' '}
                <Link
                  to="/partner"
                  className="login-signup-link text-morocco-red hover:text-morocco-green font-bold transition-all duration-300 ml-1 inline-block hover:underline hover:scale-105"
                >
                  {t('auth.login.signupLink')}
                </Link>
              </p>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default DriverLogin;
