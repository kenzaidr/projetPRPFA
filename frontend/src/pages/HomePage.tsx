import { useState, useEffect, useRef } from 'react';
import { languageConfig, getTranslation, getCurrentLanguage, setLanguage, type Language } from '../utils/translations';
import { Link, useNavigate } from 'react-router-dom';
import { Car, Utensils, Package, Shield, Wallet, Navigation, Clock, ChevronDown, Play } from 'lucide-react';

export default function HomePage() {
    const [currentLang, setCurrentLangState] = useState<Language>(getCurrentLanguage());
    const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const languageDropdownRef = useRef<HTMLDivElement>(null);
    const languageButtonRef = useRef<HTMLButtonElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Update document attributes when language changes
        const config = languageConfig[currentLang];
        document.documentElement.setAttribute('lang', config.lang);
        document.documentElement.setAttribute('dir', config.dir);
        document.body.className = document.body.className.replace(/\b(rtl|ltr)\b/g, '');
        document.body.classList.add(config.dir);
        
        // Update title
        const titles = {
            ar: 'Grab Morocco - خدمات النقل والتوصيل',
            fr: 'Grab Morocco - Services de transport et livraison',
            en: 'Grab Morocco - Transport and delivery services'
        };
        document.title = titles[currentLang];
    }, [currentLang]);

    useEffect(() => {
        // Close dropdown when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (
                languageDropdownRef.current &&
                languageButtonRef.current &&
                !languageDropdownRef.current.contains(event.target as Node) &&
                !languageButtonRef.current.contains(event.target as Node)
            ) {
                setLanguageDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLanguageChange = (lang: Language) => {
        setLanguage(lang);
        setCurrentLangState(lang);
        setLanguageDropdownOpen(false);
    };

    const t = (key: string) => getTranslation(key, currentLang);
    const config = languageConfig[currentLang];

    const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setMobileMenuOpen(false);
        }
    };

    return (
        <div className="homepage-container font-inter bg-white" dir={config.dir}>
            {/* Navigation */}
            <nav className="navbar-main fixed w-full bg-white/95 backdrop-blur-md shadow-sm z-50 transition-all duration-300">
                <div className="navbar-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="navbar-content flex justify-between items-center h-20">
                        <div className="navbar-logo flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                            <div className="logo-icon w-10 h-10 bg-gradient-to-br from-morocco-red to-morocco-green rounded-lg flex items-center justify-center shadow-md">
                                <span className="logo-letter text-white font-bold text-xl">G</span>
                            </div>
                            <span className="logo-text text-2xl font-bold bg-gradient-to-r from-morocco-red to-morocco-green bg-clip-text text-transparent">Grab Morocco</span>
                        </div>
                        
                        <div className="navbar-links-desktop hidden md:flex items-center gap-8">
                            <a 
                                href="#services" 
                                onClick={(e) => handleSmoothScroll(e, 'services')}
                                className="nav-link-services text-gray-700 hover:text-morocco-red transition-colors font-medium"
                            >
                                {t('nav.services')}
                            </a>
                            <a 
                                href="#how-it-works" 
                                onClick={(e) => handleSmoothScroll(e, 'how-it-works')}
                                className="nav-link-how-it-works text-gray-700 hover:text-morocco-red transition-colors font-medium"
                            >
                                {t('nav.howItWorks')}
                            </a>
                            <a 
                                href="#safety" 
                                onClick={(e) => handleSmoothScroll(e, 'safety')}
                                className="nav-link-safety text-gray-700 hover:text-morocco-red transition-colors font-medium"
                            >
                                {t('nav.safety')}
                            </a>
                            <Link 
                                to="/partner"
                                className="nav-link-partner text-gray-700 hover:text-morocco-red transition-colors font-medium flex items-center gap-1"
                            >
                                {t('nav.partner')}
                            </Link>
                        </div>
                        
                        <div className="navbar-actions flex items-center gap-4">
                            {/* Language Switcher */}
                            <div className="language-switcher-container relative language-switcher">
                                <button 
                                    ref={languageButtonRef}
                                    id="languageButton" 
                                    onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                                    className="language-switcher-button flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all"
                                >
                                    <span className="language-code-badge w-5 h-5 flex items-center justify-center text-gray-700 font-bold text-xs border border-gray-300 rounded-sm">
                                        {currentLang.toUpperCase()}
                                    </span>
                                    <span id="currentLang" className="language-code-text font-medium text-gray-700 hidden sm:inline">{currentLang.toUpperCase()}</span>
                                    <ChevronDown size={16} className="language-chevron text-gray-700" />
                                </button>
                                <div 
                                    ref={languageDropdownRef}
                                    id="languageDropdown" 
                                    className={`language-dropdown-menu ${languageDropdownOpen ? '' : 'hidden'} absolute top-full mt-2 right-0 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[150px] z-50`}
                                >
                                    <button 
                                        onClick={() => handleLanguageChange('ar')}
                                        className={`language-option-arabic w-full px-4 py-2 text-right hover:bg-morocco-red/5 transition-colors flex items-center justify-between gap-3 ${currentLang === 'ar' ? 'bg-morocco-red/10 text-morocco-red font-semibold' : ''}`}
                                    >
                                        <span className="language-label font-medium">العربية</span>
                                        <span className="language-code text-sm text-gray-500">AR</span>
                                    </button>
                                    <button 
                                        onClick={() => handleLanguageChange('fr')}
                                        className={`language-option-french w-full px-4 py-2 text-right hover:bg-morocco-red/5 transition-colors flex items-center justify-between gap-3 ${currentLang === 'fr' ? 'bg-morocco-red/10 text-morocco-red font-semibold' : ''}`}
                                    >
                                        <span className="language-label font-medium">Français</span>
                                        <span className="language-code text-sm text-gray-500">FR</span>
                                    </button>
                                    <button 
                                        onClick={() => handleLanguageChange('en')}
                                        className={`language-option-english w-full px-4 py-2 text-right hover:bg-morocco-red/5 transition-colors flex items-center justify-between gap-3 ${currentLang === 'en' ? 'bg-morocco-red/10 text-morocco-red font-semibold' : ''}`}
                                    >
                                        <span className="language-label font-medium">English</span>
                                        <span className="language-code text-sm text-gray-500">EN</span>
                                    </button>
                                </div>
                            </div>
                            
                            <Link to="/driver/login" className="navbar-button-login hidden md:block px-6 py-2.5 text-morocco-red font-semibold hover:bg-morocco-red/5 rounded-lg transition-all">
                                {t('nav.login')}
                            </Link>
                            <Link to="/partner" className="navbar-button-become-partner px-6 py-2.5 bg-gradient-to-r from-morocco-red to-morocco-green text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all">
                                {t('nav.partner')}
                            </Link>
                            <button 
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="navbar-mobile-menu-button md:hidden p-2"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="mobile-menu-container md:hidden bg-white border-t border-gray-200 p-6 shadow-xl animate-in slide-in-from-top-5">
                        <div className="mobile-menu-links flex flex-col gap-4 text-right">
                            <a 
                                href="#services" 
                                onClick={(e) => handleSmoothScroll(e, 'services')}
                                className="mobile-menu-link-services text-gray-700 hover:text-morocco-red transition-colors font-medium py-2"
                            >
                                {t('nav.services')}
                            </a>
                            <a 
                                href="#how-it-works" 
                                onClick={(e) => handleSmoothScroll(e, 'how-it-works')}
                                className="mobile-menu-link-how-it-works text-gray-700 hover:text-morocco-red transition-colors font-medium py-2"
                            >
                                {t('nav.howItWorks')}
                            </a>
                            <a 
                                href="#safety" 
                                onClick={(e) => handleSmoothScroll(e, 'safety')}
                                className="mobile-menu-link-safety text-gray-700 hover:text-morocco-red transition-colors font-medium py-2"
                            >
                                {t('nav.safety')}
                            </a>
                            <Link 
                                to="/partner" 
                                className="mobile-menu-link-partner text-gray-700 hover:text-morocco-red transition-colors font-medium py-2"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {t('nav.partner')}
                            </Link>
                            <Link 
                                to="/driver/login"
                                className="mobile-menu-button-login w-full px-6 py-2.5 text-morocco-red font-semibold hover:bg-morocco-red/5 rounded-lg transition-all text-center border border-morocco-red/20"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {t('nav.login')}
                            </Link>
                            <Link 
                                to="/partner"
                                className="mobile-menu-button-become-partner w-full px-6 py-2.5 bg-gradient-to-r from-morocco-red to-morocco-green text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all text-center"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {t('nav.partner')}
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="hero-section relative min-h-screen flex items-center overflow-hidden pt-20">
                {/* Background Pattern */}
                <div className="hero-background-gradient absolute inset-0 bg-gradient-to-br from-morocco-sand/30 via-white to-morocco-green/10"></div>
                <div className="hero-background-pattern absolute top-0 right-0 w-1/2 h-full opacity-5">
                    <div className="moroccan-pattern"></div>
                </div>
                
                <div className="hero-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
                    <div className="hero-content-grid grid lg:grid-cols-2 gap-12 items-center">
                        {/* Hero Content */}
                        <div className="hero-text-content text-right lg:text-left rtl:lg:text-right">
                            <div className="hero-badge inline-block mb-6 px-4 py-2 bg-morocco-gold/20 rounded-full">
                                <span className="hero-badge-text text-morocco-red font-semibold text-sm">{t('hero.badge')}</span>
                            </div>
                            
                            <h1 className="hero-title text-5xl md:text-7xl font-bold mb-6 leading-tight">
                                <span className="hero-title-gradient bg-gradient-to-r from-morocco-red via-morocco-green to-morocco-gold bg-clip-text text-transparent">
                                    {t('hero.title1')}
                                </span>
                                <br />
                                <span className="hero-title-secondary text-gray-900">{t('hero.title2')}</span>
                            </h1>
                            
                            <p className="hero-description text-xl text-gray-600 mb-8 leading-relaxed">
                                {t('hero.description')}
                            </p>
                            
                            <div className="hero-cta-buttons flex flex-wrap gap-4 justify-end lg:justify-start rtl:lg:justify-end mb-8">
                                <button className="hero-button-book-now group px-8 py-4 bg-gradient-to-r from-morocco-red to-morocco-green text-white font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                                    <span className="flex items-center gap-2">
                                        <span>{t('hero.bookNow')}</span>
                                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                                        </svg>
                                    </span>
                                </button>
                                <button className="hero-button-watch-video px-8 py-4 bg-white border-2 border-morocco-red text-morocco-red font-bold rounded-xl hover:bg-morocco-red hover:text-white transition-all duration-300 flex items-center gap-2">
                                    <Play size={20} fill="currentColor" />
                                    {t('hero.watchVideo')}
                                </button>
                            </div>
                            
                            <div className="hero-stats flex gap-8 justify-end lg:justify-start rtl:lg:justify-end">
                                <div className="hero-stat-item text-center">
                                    <div className="hero-stat-value text-3xl font-bold text-morocco-red">+50K</div>
                                    <div className="hero-stat-label text-sm text-gray-600">{t('hero.stat1')}</div>
                                </div>
                                <div className="hero-stat-item text-center">
                                    <div className="hero-stat-value text-3xl font-bold text-morocco-green">+1M</div>
                                    <div className="hero-stat-label text-sm text-gray-600">{t('hero.stat2')}</div>
                                </div>
                                <div className="hero-stat-item text-center">
                                    <div className="hero-stat-value text-3xl font-bold text-morocco-gold">4.8★</div>
                                    <div className="hero-stat-label text-sm text-gray-600">{t('hero.stat3')}</div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Hero Image */}
                        <div className="hero-image-container relative">
                            <div className="hero-image-wrapper relative z-10">
                                <img 
                                    src="https://images.pexels.com/photos/17872110/pexels-photo-17872110.jpeg" 
                                    alt="Moroccan city street" 
                                    className="hero-main-image rounded-3xl shadow-2xl w-full h-[500px] lg:h-[600px] object-cover"
                                />
                                <div className="hero-image-overlay absolute inset-0 bg-gradient-to-t from-morocco-red/30 to-transparent rounded-3xl z-10"></div>
                            </div>
                            
                            {/* Floating Cards */}
                            <div className="hero-floating-card-ride absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 animate-float z-20">
                                <div className="flex items-center gap-4">
                                    <div className="hero-card-icon-ride w-12 h-12 bg-morocco-green/10 rounded-full flex items-center justify-center">
                                        <Car className="text-morocco-green" />
                                    </div>
                                    <div>
                                        <div className="hero-card-label text-sm text-gray-600">{t('hero.nextRide')}</div>
                                        <div className="hero-card-value font-bold text-morocco-green">{t('hero.nextRideTime')}</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="hero-floating-card-food absolute -top-6 -left-6 bg-white rounded-2xl shadow-xl p-6 animate-float-delayed z-20">
                                <div className="flex items-center gap-4">
                                    <div className="hero-card-icon-food w-12 h-12 bg-morocco-red/10 rounded-full flex items-center justify-center">
                                        <Utensils className="text-morocco-red" />
                                    </div>
                                    <div>
                                        <div className="hero-card-label text-sm text-gray-600">{t('hero.foodDelivery')}</div>
                                        <div className="hero-card-value font-bold text-morocco-red">{t('hero.foodDeliveryTime')}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="services-section py-24 bg-gradient-to-b from-white to-morocco-sand/20">
                <div className="services-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="services-header text-center mb-16">
                        <h2 className="services-title text-4xl md:text-5xl font-bold mb-4">
                            <span className="services-title-gradient bg-gradient-to-r from-morocco-red to-morocco-green bg-clip-text text-transparent">
                                {t('services.title')}
                            </span>
                        </h2>
                        <p className="services-subtitle text-xl text-gray-600">{t('services.subtitle')}</p>
                    </div>
                    
                    <div className="services-grid grid md:grid-cols-3 gap-8">
                        {/* Ride Service */}
                        <div className="service-card-ride group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                            <div className="service-card-decoration-ride absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-morocco-red/10 to-transparent rounded-full -mr-16 -mt-16"></div>
                            
                            <div className="service-card-content relative z-10 flex flex-col items-end">
                                <div className="service-icon-ride w-16 h-16 bg-gradient-to-br from-morocco-red to-morocco-red/70 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-morocco-red/30">
                                    <Car className="text-white w-8 h-8" />
                                </div>
                                
                                <h3 className="service-title-ride text-2xl font-bold mb-3 text-right">{t('services.ride.title')}</h3>
                                <p className="service-description-ride text-gray-600 mb-6 text-right leading-relaxed">
                                    {t('services.ride.description')}
                                </p>
                                
                                <div className="service-cta-container flex justify-end w-full">
                                    <button className="service-cta-button-ride text-morocco-red font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                                        <span>{t('services.ride.cta')}</span>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        {/* Food Delivery */}
                        <div className="service-card-food group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                            <div className="service-card-decoration-food absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-morocco-green/10 to-transparent rounded-full -mr-16 -mt-16"></div>
                            
                            <div className="service-card-content relative z-10 flex flex-col items-end">
                                <div className="service-icon-food w-16 h-16 bg-gradient-to-br from-morocco-green to-morocco-green/70 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-morocco-green/30">
                                    <Utensils className="text-white w-8 h-8" />
                                </div>
                                
                                <h3 className="service-title-food text-2xl font-bold mb-3 text-right">{t('services.food.title')}</h3>
                                <p className="service-description-food text-gray-600 mb-6 text-right leading-relaxed">
                                    {t('services.food.description')}
                                </p>
                                
                                <div className="flex justify-end w-full">
                                    <Link 
                                        to="/restaurant" 
                                        className="text-morocco-green font-semibold flex items-center gap-2 group-hover:gap-3 transition-all"
                                    >
                                        <span>{t('services.food.cta')}</span>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        
                        {/* Package Delivery */}
                        <div className="service-card-package group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                            <div className="service-card-decoration-package absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-morocco-gold/10 to-transparent rounded-full -mr-16 -mt-16"></div>
                            
                            <div className="service-card-content relative z-10 flex flex-col items-end">
                                <div className="service-icon-package w-16 h-16 bg-gradient-to-br from-morocco-gold to-morocco-gold/70 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-morocco-gold/30">
                                    <Package className="text-white w-8 h-8" />
                                </div>
                                
                                <h3 className="service-title-package text-2xl font-bold mb-3 text-right">{t('services.package.title')}</h3>
                                <p className="service-description-package text-gray-600 mb-6 text-right leading-relaxed">
                                    {t('services.package.description')}
                                </p>
                                
                                <div className="service-cta-container flex justify-end w-full">
                                    <button className="service-cta-button-package text-morocco-gold font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                                        <span>{t('services.package.cta')}</span>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="how-it-works-section py-24 bg-white">
                <div className="how-it-works-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="how-it-works-header text-center mb-16">
                        <h2 className="how-it-works-title text-4xl md:text-5xl font-bold mb-4">{t('howItWorks.title')}</h2>
                        <p className="how-it-works-subtitle text-xl text-gray-600">{t('howItWorks.subtitle')}</p>
                    </div>
                    
                    <div className="how-it-works-steps-grid grid md:grid-cols-3 gap-12 relative">
                        {/* Connection Lines */}
                        <div className="how-it-works-connection-line hidden md:block absolute top-1/4 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-morocco-red via-morocco-green to-morocco-gold"></div>
                        
                        {/* Step 1 */}
                        <div className="how-it-works-step-1 text-center relative">
                            <div className="how-it-works-step-icon-1 w-20 h-20 bg-gradient-to-br from-morocco-red to-morocco-red/70 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg text-white">
                                <span className="how-it-works-step-number text-3xl font-bold">1</span>
                            </div>
                            <h3 className="how-it-works-step-title-1 text-2xl font-bold mb-3">{t('howItWorks.step1.title')}</h3>
                            <p className="how-it-works-step-description-1 text-gray-600 leading-relaxed">
                                {t('howItWorks.step1.description')}
                            </p>
                        </div>
                        
                        {/* Step 2 */}
                        <div className="how-it-works-step-2 text-center relative">
                            <div className="how-it-works-step-icon-2 w-20 h-20 bg-gradient-to-br from-morocco-green to-morocco-green/70 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg text-white">
                                <span className="how-it-works-step-number text-3xl font-bold">2</span>
                            </div>
                            <h3 className="how-it-works-step-title-2 text-2xl font-bold mb-3">{t('howItWorks.step2.title')}</h3>
                            <p className="how-it-works-step-description-2 text-gray-600 leading-relaxed">
                                {t('howItWorks.step2.description')}
                            </p>
                        </div>
                        
                        {/* Step 3 */}
                        <div className="how-it-works-step-3 text-center relative">
                            <div className="how-it-works-step-icon-3 w-20 h-20 bg-gradient-to-br from-morocco-gold to-morocco-gold/70 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg text-white">
                                <span className="how-it-works-step-number text-3xl font-bold">3</span>
                            </div>
                            <h3 className="how-it-works-step-title-3 text-2xl font-bold mb-3">{t('howItWorks.step3.title')}</h3>
                            <p className="how-it-works-step-description-3 text-gray-600 leading-relaxed">
                                {t('howItWorks.step3.description')}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="safety" className="features-section py-24 bg-gradient-to-b from-morocco-sand/20 to-white">
                <div className="features-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="features-header text-center mb-16">
                        <h2 className="features-title text-4xl md:text-5xl font-bold mb-4">{t('features.title')}</h2>
                        <p className="features-subtitle text-xl text-gray-600">{t('features.subtitle')}</p>
                    </div>
                    
                    <div className="features-grid grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Safety */}
                        <div className="feature-card-safety bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-right">
                            <div className="feature-icon-safety w-14 h-14 bg-morocco-red/10 rounded-xl flex items-center justify-center mb-4 mr-auto">
                                <Shield className="text-morocco-red w-7 h-7" />
                            </div>
                            <h3 className="feature-title-safety text-xl font-bold mb-2">{t('features.safety.title')}</h3>
                            <p className="feature-description-safety text-gray-600">{t('features.safety.description')}</p>
                        </div>
                        
                        {/* Payment */}
                        <div className="feature-card-payment bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-right">
                            <div className="feature-icon-payment w-14 h-14 bg-morocco-green/10 rounded-xl flex items-center justify-center mb-4 mr-auto">
                                <Wallet className="text-morocco-green w-7 h-7" />
                            </div>
                            <h3 className="feature-title-payment text-xl font-bold mb-2">{t('features.payment.title')}</h3>
                            <p className="feature-description-payment text-gray-600">{t('features.payment.description')}</p>
                        </div>
                        
                        {/* Tracking */}
                        <div className="feature-card-tracking bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-right">
                            <div className="feature-icon-tracking w-14 h-14 bg-morocco-gold/10 rounded-xl flex items-center justify-center mb-4 mr-auto">
                                <Navigation className="text-morocco-gold w-7 h-7" />
                            </div>
                            <h3 className="feature-title-tracking text-xl font-bold mb-2">{t('features.tracking.title')}</h3>
                            <p className="feature-description-tracking text-gray-600">{t('features.tracking.description')}</p>
                        </div>
                        
                        {/* Fast */}
                        <div className="feature-card-fast bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-right">
                            <div className="feature-icon-fast w-14 h-14 bg-morocco-red/10 rounded-xl flex items-center justify-center mb-4 mr-auto">
                                <Clock className="text-morocco-red w-7 h-7" />
                            </div>
                            <h3 className="feature-title-fast text-xl font-bold mb-2">{t('features.fast.title')}</h3>
                            <p className="feature-description-fast text-gray-600">{t('features.fast.description')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Partner CTA Section */}
            <section id="partner" className="partner-cta-section py-24 bg-gradient-to-r from-morocco-red to-morocco-green relative overflow-hidden">
                <div className="partner-cta-background-pattern absolute inset-0 opacity-10">
                    <div className="moroccan-pattern-white"></div>
                </div>
                
                <div className="partner-cta-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="partner-cta-content-grid grid lg:grid-cols-2 gap-12 items-center">
                        <div className="partner-cta-text-content text-right text-white">
                            <h2 className="partner-cta-title text-4xl md:text-5xl font-bold mb-6">{t('partner.title')}</h2>
                            <p className="partner-cta-description text-xl mb-8 text-white/90 leading-relaxed">
                                {t('partner.description')}
                            </p>
                            
                            <div className="partner-cta-stats grid grid-cols-2 gap-6 mb-8">
                                <div className="partner-cta-stat-income">
                                    <div className="partner-cta-stat-value text-3xl font-bold mb-1">15,000 MAD+</div>
                                    <div className="partner-cta-stat-label text-white/80">{t('partner.income')}</div>
                                </div>
                                <div className="partner-cta-stat-support">
                                    <div className="partner-cta-stat-value text-3xl font-bold mb-1">24/7</div>
                                    <div className="partner-cta-stat-label text-white/80">{t('partner.support')}</div>
                                </div>
                            </div>
                            
                            <Link 
                                to="/partner"
                                className="partner-cta-button inline-block px-8 py-4 bg-white text-morocco-red font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all"
                            >
                                {t('partner.cta')}
                            </Link>
                        </div>
                        
                        <div className="partner-cta-image-container relative">
                            <img 
                                src="https://images.pexels.com/photos/5835588/pexels-photo-5835588.jpeg" 
                                alt="Happy driver" 
                                className="partner-cta-image rounded-3xl shadow-2xl w-full h-[500px] object-cover"
                            />
                            <div className="partner-cta-image-overlay absolute inset-0 bg-gradient-to-t from-morocco-green/30 to-transparent rounded-3xl"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer-main bg-gray-900 text-white py-16">
                <div className="footer-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="footer-content-grid grid md:grid-cols-4 gap-12 mb-12">
                        <div className="footer-brand text-right flex flex-col items-end">
                            <div className="footer-logo-container flex items-center gap-2 mb-4">
                                <span className="footer-logo-text text-2xl font-bold">Grab Morocco</span>
                                <div className="footer-logo-icon w-10 h-10 bg-gradient-to-br from-morocco-red to-morocco-green rounded-lg flex items-center justify-center">
                                    <span className="footer-logo-letter text-white font-bold text-xl">G</span>
                                </div>
                            </div>
                            <p className="footer-tagline text-gray-400">{t('footer.tagline')}</p>
                        </div>
                        
                        <div className="footer-column-company text-right">
                            <h3 className="footer-column-title font-bold mb-4">{t('footer.company')}</h3>
                            <ul className="footer-links-list space-y-2 text-gray-400">
                                <li><a href="#" className="footer-link-about hover:text-white transition-colors">{t('footer.company.about')}</a></li>
                                <li><a href="#" className="footer-link-careers hover:text-white transition-colors">{t('footer.company.careers')}</a></li>
                                <li><a href="#" className="footer-link-news hover:text-white transition-colors">{t('footer.company.news')}</a></li>
                            </ul>
                        </div>
                        
                        <div className="footer-column-services text-right">
                            <h3 className="footer-column-title font-bold mb-4">{t('footer.services')}</h3>
                            <ul className="footer-links-list space-y-2 text-gray-400">
                                <li><a href="#" className="footer-link-ride hover:text-white transition-colors">{t('footer.services.ride')}</a></li>
                                <li><a href="#" className="footer-link-food hover:text-white transition-colors">{t('footer.services.food')}</a></li>
                                <li><a href="#" className="footer-link-package hover:text-white transition-colors">{t('footer.services.package')}</a></li>
                            </ul>
                        </div>
                        
                        <div className="footer-column-support text-right">
                            <h3 className="footer-column-title font-bold mb-4">{t('footer.support')}</h3>
                            <ul className="footer-links-list space-y-2 text-gray-400">
                                <li><a href="#" className="footer-link-help hover:text-white transition-colors">{t('footer.support.help')}</a></li>
                                <li><a href="#" className="footer-link-safety hover:text-white transition-colors">{t('footer.support.safety')}</a></li>
                                <li><a href="#" className="footer-link-contact hover:text-white transition-colors">{t('footer.support.contact')}</a></li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="footer-bottom border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="footer-copyright text-gray-400 text-sm">
                            {t('footer.copyright')}
                        </div>
                        <div className="footer-social-links flex gap-6">
                            <a href="#" className="footer-social-link-facebook text-gray-400 hover:text-white transition-colors">
                                <span className="sr-only">Facebook</span>
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                            </a>
                            <a href="#" className="footer-social-link-twitter text-gray-400 hover:text-white transition-colors">
                                <span className="sr-only">Twitter</span>
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}