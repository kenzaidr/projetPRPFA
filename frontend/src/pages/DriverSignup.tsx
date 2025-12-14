import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChevronDown, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Car, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Store,
  MapPin,
  Utensils,
  Sparkles,
  Zap
} from 'lucide-react';
import { 
  languageConfig, 
  getTranslation, 
  getCurrentLanguage, 
  setLanguage, 
  type Language 
} from '../utils/translations';
import type { PartnerRegistrationData } from '../types';

const DriverSignup: React.FC = () => {
  const navigate = useNavigate();
  const [currentLang, setCurrentLangState] = useState<Language>(getCurrentLanguage());
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
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

  const handleInputChange = (field: keyof PartnerRegistrationData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

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

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof PartnerRegistrationData, string>> = {};
    let isValid = true;

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
      isValid = false;
    }

    setErrors(newErrors);
    return isValid && Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        navigate('/driver');
      }, 2000);
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const FormInput = ({ 
    icon: Icon, 
    label, 
    name, 
    type = "text", 
    placeholder 
  }: { 
    icon: any, 
    label: string, 
    name: keyof PartnerRegistrationData, 
    type?: string, 
    placeholder: string 
  }) => (
    <div className="signup-input-group mb-5">
      <label className={`signup-input-label block text-sm font-semibold text-gray-700 mb-2.5 ${isRTL ? 'text-right' : 'text-left'}`}>
        {label}
      </label>
      <div className="signup-input-wrapper relative group">
        <Icon className={`signup-input-icon absolute top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-morocco-red transition-colors duration-300 ${isRTL ? 'right-4' : 'left-4'}`} size={20} />
        <input
          type={type}
          name={name}
          value={formData[name] as string}
          onChange={(e) => handleInputChange(name, e.target.value)}
          className={`signup-input-field w-full py-4 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 bg-white/60 backdrop-blur-sm
            ${errors[name] 
              ? 'border-red-300 focus:ring-red-200/50 bg-red-50/50' 
              : 'border-gray-200 focus:ring-morocco-red/20 focus:border-morocco-red'}
            ${isRTL ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4 text-left'}`}
          placeholder={placeholder}
        />
        {errors[name] && (
          <div className={`signup-input-error absolute -bottom-6 ${isRTL ? 'right-0' : 'left-0'} text-xs text-red-500 flex items-center gap-1.5 animate-in slide-in-from-top-1`}>
             <AlertCircle size={12} /> {errors[name]}
          </div>
        )}
      </div>
    </div>
  );

  const strength = getPasswordStrength(formData.password);

  return (
    <div className="signup-page-container min-h-screen bg-gradient-to-br from-morocco-sand/40 via-white via-morocco-green/5 to-morocco-red/10 relative overflow-hidden pb-12" dir={config.dir}>
      {/* Animated Background */}
      <div className="signup-background-pattern absolute inset-0 moroccan-pattern opacity-[0.02] pointer-events-none"></div>
      
      {/* Floating Gradient Orbs */}
      <div className="signup-orb-1 absolute top-10 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-morocco-red/15 to-morocco-green/15 rounded-full blur-3xl animate-pulse"></div>
      <div className="signup-orb-2 absolute bottom-10 -right-32 w-[500px] h-[500px] bg-gradient-to-br from-morocco-green/15 to-morocco-gold/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>

      {/* Header */}
      <header className="signup-header bg-white/80 backdrop-blur-xl shadow-lg sticky top-0 z-50 border-b border-white/50">
        <div className="signup-header-container max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link to="/" className="signup-logo-link flex items-center gap-3 group">
            <div className="signup-logo-icon w-12 h-12 bg-gradient-to-br from-morocco-red via-morocco-green to-morocco-gold rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                G
            </div>
            <span className="signup-logo-text font-bold text-lg hidden sm:block bg-gradient-to-r from-morocco-red via-morocco-green to-morocco-gold bg-clip-text text-transparent">
                Grab Morocco
            </span>
            </Link>

            <div className="signup-language-switcher relative">
            <button 
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="signup-language-button flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 hover:scale-105"
            >
                <span className="text-sm font-semibold text-gray-700">{config.label}</span>
                <ChevronDown size={14} className={`text-gray-500 transition-transform duration-300 ${showLangMenu ? 'rotate-180' : ''}`} />
            </button>
            {showLangMenu && (
                <div className={`signup-language-dropdown absolute top-full mt-2 w-36 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/50 py-1 z-50 animate-in fade-in slide-in-from-top-2 ${isRTL ? 'left-0' : 'right-0'}`}>
                {(Object.keys(languageConfig) as Language[]).map((lang) => (
                    <button
                    key={lang}
                    onClick={() => handleLangChange(lang)}
                    className={`signup-language-option w-full px-4 py-2.5 text-sm transition-all duration-200 flex items-center justify-between hover:bg-gray-50/80 ${currentLang === lang ? 'bg-gradient-to-r from-morocco-red/10 to-morocco-green/10 text-morocco-red font-bold' : 'text-gray-600'} ${isRTL ? 'text-right' : 'text-left'}`}
                    >
                    {languageConfig[lang].label}
                    {currentLang === lang && <Sparkles size={14} className="text-morocco-green" />}
                    </button>
                ))}
                </div>
            )}
            </div>
        </div>
      </header>

      <main className="signup-main-content container mx-auto px-4 py-8 max-w-3xl relative z-10">
        <div className="signup-header-section text-center mb-10">
            <h1 className="signup-title text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-morocco-red via-morocco-green to-morocco-gold bg-clip-text text-transparent">
                {t('auth.signup.title')}
            </h1>
            <p className="signup-subtitle text-gray-600 text-lg md:text-xl">{t('auth.signup.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50 relative group hover:shadow-3xl transition-all duration-500">
            {/* Animated Gradient Border */}
            <div className="absolute inset-0 bg-gradient-to-r from-morocco-red/20 via-morocco-green/20 to-morocco-gold/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"></div>
            
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-morocco-red/10 to-transparent rounded-bl-full"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-morocco-green/10 to-transparent rounded-tr-full"></div>
            
            {/* PARTNER TYPE SELECTION */}
            <div className="signup-type-selection p-8 md:p-10 pb-6 relative z-10">
                <label className={`signup-type-label block text-xl font-bold text-gray-800 mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <span className="flex items-center gap-2">
                        <Zap className="text-morocco-gold" size={24} />
                        {t('auth.signup.selectType')}
                    </span>
                </label>
                <div className="signup-type-grid grid grid-cols-1 md:grid-cols-2 gap-5">
                    <button
                        type="button"
                        onClick={() => handleTypeSelect('driver')}
                        className={`signup-type-card-driver relative p-6 rounded-2xl border-2 text-left transition-all duration-300 group/type overflow-hidden ${
                            formData.partnerType === 'driver' 
                            ? 'border-morocco-green bg-gradient-to-br from-morocco-green/10 to-morocco-green/5 ring-2 ring-morocco-green/30 shadow-lg scale-[1.02]' 
                            : 'border-gray-200 hover:border-morocco-green/40 bg-white hover:shadow-xl hover:scale-[1.01]'
                        }`}
                    >
                        <div className={`signup-type-icon-driver w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 ${
                            formData.partnerType === 'driver' 
                            ? 'bg-gradient-to-br from-morocco-green to-morocco-green/70 text-white shadow-lg' 
                            : 'bg-morocco-sand/50 text-morocco-green'
                        }`}>
                            <Car size={28} />
                        </div>
                        <h3 className={`signup-type-title font-bold text-xl mb-2 transition-colors ${
                            formData.partnerType === 'driver' ? 'text-morocco-green' : 'text-gray-800'
                        }`}>
                            {t('auth.signup.type.driver')}
                        </h3>
                        <p className="signup-type-description text-sm text-gray-500 leading-relaxed">
                            {t('auth.signup.type.driverDesc')}
                        </p>
                        {formData.partnerType === 'driver' && (
                            <div className={`signup-type-check absolute top-4 ${isRTL ? 'left-4' : 'right-4'} text-morocco-green animate-in zoom-in`}>
                                <CheckCircle2 size={28} className="drop-shadow-lg" />
                            </div>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => handleTypeSelect('restaurant')}
                        className={`signup-type-card-restaurant relative p-6 rounded-2xl border-2 text-left transition-all duration-300 group/type overflow-hidden ${
                            formData.partnerType === 'restaurant' 
                            ? 'border-morocco-red bg-gradient-to-br from-morocco-red/10 to-morocco-red/5 ring-2 ring-morocco-red/30 shadow-lg scale-[1.02]' 
                            : 'border-gray-200 hover:border-morocco-red/40 bg-white hover:shadow-xl hover:scale-[1.01]'
                        }`}
                    >
                        <div className={`signup-type-icon-restaurant w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 ${
                            formData.partnerType === 'restaurant' 
                            ? 'bg-gradient-to-br from-morocco-red to-morocco-red/70 text-white shadow-lg' 
                            : 'bg-morocco-sand/50 text-morocco-red'
                        }`}>
                            <Store size={28} />
                        </div>
                        <h3 className={`signup-type-title font-bold text-xl mb-2 transition-colors ${
                            formData.partnerType === 'restaurant' ? 'text-morocco-red' : 'text-gray-800'
                        }`}>
                            {t('auth.signup.type.restaurant')}
                        </h3>
                        <p className="signup-type-description text-sm text-gray-500 leading-relaxed">
                            {t('auth.signup.type.restaurantDesc')}
                        </p>
                        {formData.partnerType === 'restaurant' && (
                            <div className={`signup-type-check absolute top-4 ${isRTL ? 'left-4' : 'right-4'} text-morocco-red animate-in zoom-in`}>
                                <CheckCircle2 size={28} className="drop-shadow-lg" />
                            </div>
                        )}
                    </button>
                </div>
            </div>

            <div className="signup-divider h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-auto max-w-[90%]"></div>

            <div className="signup-form-sections p-8 md:p-10 space-y-10 relative z-10">
                
                {/* Section 1: Personal Info */}
                <section className="signup-section-personal">
                    <div className={`signup-section-header flex items-center gap-4 mb-7 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className="signup-section-icon w-12 h-12 rounded-xl bg-gradient-to-br from-morocco-green/20 to-morocco-green/10 flex items-center justify-center text-morocco-green shadow-md">
                            <User size={24} />
                        </div>
                        <h2 className="signup-section-title text-2xl font-bold text-gray-800">{t('auth.signup.section.personal')}</h2>
                    </div>

                    <div className="signup-section-fields space-y-1">
                        <FormInput icon={User} label={t('auth.signup.fullName')} name="fullName" placeholder={t('auth.signup.fullNamePlaceholder')} />
                        <FormInput icon={Mail} label={t('auth.login.email')} name="email" type="email" placeholder={t('auth.login.emailPlaceholder')} />
                        <FormInput icon={Phone} label={t('auth.signup.phone')} name="phone" type="tel" placeholder={t('auth.signup.phonePlaceholder')} />
                        
                        <div className="signup-password-grid grid grid-cols-1 md:grid-cols-2 gap-5">
                            <FormInput icon={Lock} label={t('auth.login.password')} name="password" type="password" placeholder="••••••••" />
                            <FormInput icon={Lock} label={t('auth.signup.confirmPassword')} name="confirmPassword" type="password" placeholder="••••••••" />
                        </div>
                        
                        {formData.password && (
                            <div className={`signup-password-strength flex items-center gap-3 mt-3 p-3 rounded-xl bg-gray-50/50 ${isRTL ? 'justify-end' : ''}`}>
                                <div className="signup-password-bars flex gap-1.5 h-2 flex-1 max-w-[120px]">
                                    <div className={`signup-password-bar flex-1 rounded-full transition-all duration-300 ${strength >= 1 ? (strength === 1 ? 'bg-red-500' : strength === 2 ? 'bg-yellow-500' : 'bg-green-500') : 'bg-gray-200'}`}></div>
                                    <div className={`signup-password-bar flex-1 rounded-full transition-all duration-300 ${strength >= 2 ? (strength === 2 ? 'bg-yellow-500' : 'bg-green-500') : 'bg-gray-200'}`}></div>
                                    <div className={`signup-password-bar flex-1 rounded-full transition-all duration-300 ${strength >= 3 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                                </div>
                                <span className="signup-password-strength-text text-xs font-semibold text-gray-600">
                                    {strength === 0 && ''}
                                    {strength === 1 && <span className="text-red-500">{t('auth.password.strength.weak')}</span>}
                                    {strength === 2 && <span className="text-yellow-500">{t('auth.password.strength.medium')}</span>}
                                    {strength === 3 && <span className="text-green-500">{t('auth.password.strength.strong')}</span>}
                                </span>
                            </div>
                        )}
                    </div>
                </section>

                <hr className="signup-section-divider border-gray-100" />

                {/* Section 2: Specific Info */}
                <section className="signup-section-specific">
                    <div className={`signup-section-header flex items-center gap-4 mb-7 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className={`signup-section-icon w-12 h-12 rounded-xl flex items-center justify-center shadow-md transition-all duration-300 ${
                            formData.partnerType === 'driver' 
                            ? 'bg-gradient-to-br from-morocco-green/20 to-morocco-green/10 text-morocco-green' 
                            : 'bg-gradient-to-br from-morocco-red/20 to-morocco-red/10 text-morocco-red'
                        }`}>
                            {formData.partnerType === 'driver' ? <Car size={24} /> : <Store size={24} />}
                        </div>
                        <h2 className="signup-section-title text-2xl font-bold text-gray-800">
                            {formData.partnerType === 'driver' ? t('auth.signup.section.vehicle') : t('auth.signup.section.business')}
                        </h2>
                    </div>

                    {formData.partnerType === 'driver' ? (
                        <div className="signup-section-fields space-y-5">
                            <div className="signup-vehicle-grid grid grid-cols-1 md:grid-cols-2 gap-5">
                                <FormInput icon={Car} label={t('auth.signup.vehicleModel')} name="vehicleModel" placeholder="e.g. Dacia Logan" />
                                <FormInput icon={FileText} label={t('auth.signup.licensePlate')} name="licensePlate" placeholder="12345-A-1" />
                            </div>

                            <div className="signup-vehicle-type-select">
                                <label className={`signup-select-label block text-sm font-semibold text-gray-700 mb-2.5 ${isRTL ? 'text-right' : 'text-left'}`}>
                                    {t('auth.signup.vehicleType')}
                                </label>
                                <div className="relative group">
                                    <select 
                                        className={`signup-select-field w-full py-4 px-4 border-2 border-gray-200 rounded-xl appearance-none bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-morocco-red/20 focus:border-morocco-red transition-all duration-300 ${isRTL ? 'text-right' : 'text-left'}`}
                                        value={formData.vehicleType}
                                        onChange={(e) => handleInputChange('vehicleType', e.target.value)}
                                    >
                                        <option value="car">{t('auth.signup.type.car')}</option>
                                        <option value="motorcycle">{t('auth.signup.type.motorcycle')}</option>
                                    </select>
                                    <ChevronDown className={`signup-select-arrow absolute top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none transition-colors group-focus-within:text-morocco-red ${isRTL ? 'left-4' : 'right-4'}`} size={20} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="signup-section-fields space-y-5">
                            <FormInput icon={Store} label={t('auth.signup.restaurantName')} name="restaurantName" placeholder="e.g. Tasty Tagine" />
                            <FormInput icon={MapPin} label={t('auth.signup.restaurantAddress')} name="restaurantAddress" placeholder="e.g. 123 Mohammed V Blvd" />
                            <FormInput icon={Utensils} label={t('auth.signup.cuisineType')} name="cuisineType" placeholder="e.g. Moroccan, Fast Food" />
                        </div>
                    )}
                </section>

                <hr className="signup-section-divider border-gray-100" />

                {/* Terms & Submit */}
                <section className="signup-section-submit">
                    <div 
                        className={`signup-terms-checkbox flex items-center gap-4 mb-7 p-5 rounded-2xl cursor-pointer transition-all duration-300 ${
                            errors.agreedToTerms 
                            ? 'ring-2 ring-red-200 bg-red-50/50' 
                            : 'bg-gray-50/50 hover:bg-gray-100/50'
                        }`}
                        onClick={() => handleInputChange('agreedToTerms', !formData.agreedToTerms)}
                    >
                        <div className={`signup-checkbox w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all duration-300 shadow-sm ${
                            formData.agreedToTerms 
                            ? 'bg-gradient-to-br from-morocco-green to-morocco-green/80 border-morocco-green scale-110' 
                            : 'border-gray-300 bg-white hover:border-morocco-green/50'
                        }`}>
                            {formData.agreedToTerms && <CheckCircle2 size={18} className="text-white" />}
                        </div>
                        <span className={`signup-terms-text text-sm font-medium ${errors.agreedToTerms ? 'text-red-600' : 'text-gray-700'}`}>
                            {t('auth.signup.terms')}
                        </span>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="signup-submit-button w-full py-5 px-6 bg-gradient-to-r from-morocco-red via-morocco-green to-morocco-red text-white font-bold rounded-xl shadow-xl shadow-morocco-green/30 hover:shadow-2xl hover:shadow-morocco-green/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg relative overflow-hidden group"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={22} />
                            ) : (
                                <>
                                    {t('auth.signup.submit')}
                                    {isRTL ? <ArrowLeft size={20} className="group-hover:translate-x-[-4px] transition-transform" /> : <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                                </>
                            )}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-morocco-green via-morocco-red to-morocco-green bg-[length:200%_100%] animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </button>
                </section>
            </div>
            
            <div className="signup-footer bg-gradient-to-r from-gray-50/80 to-gray-50/50 p-6 text-center border-t-2 border-gray-100/50 backdrop-blur-sm">
                <p className="signup-footer-text text-gray-600">
                    {t('auth.signup.hasAccount')}{' '}
                    <Link to="/driver/login" className="signup-login-link text-morocco-red font-bold hover:text-morocco-green transition-all duration-300 hover:underline hover:scale-105 inline-block">
                        {t('auth.signup.loginLink')}
                    </Link>
                </p>
            </div>
        </form>
      </main>
    </div>
  );
};

export default DriverSignup;
