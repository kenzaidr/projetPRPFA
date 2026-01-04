import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './driveCustumor.css';

// Traductions pour la page ride
const translations = {
  ar: {
    // Navigation
    'nav.services': 'الخدمات',
    'nav.howItWorks': 'كيف يعمل',
    'nav.safety': 'الأمان',
    'nav.partner': 'كن شريكاً',
    'nav.about': 'حول',
    'nav.help': 'مساعدة',
    'nav.login': 'تسجيل الدخول',
    'nav.signup': 'التسجيل',
    // Hero
    'hero.title': 'احجز رحلتك في ثوانٍ',
    'hero.subtitle': 'تنقل بسهولة في جميع أنحاء المغرب مع سائقين موثوقين وأسعار شفافة',
    'booking.tab.ride': 'رحلة',
    'booking.tab.delivery': 'توصيل',
    'form.where': 'إلى أين تذهب؟',
    'form.destination.placeholder': 'أدخل وجهتك',
    'form.pickup': 'نقطة الانطلاق',
    'form.pickup.placeholder': 'موقعك الحالي',
    'form.rideType': 'نوع الرحلة',
    'rideType.standard': 'عادي',
    'rideType.comfort': 'راحة',
    'rideType.xl': 'كبير',
    'rideType.price.from': 'من',
    'btn.book': 'Voir les prix',
    'btn.viewPrices': 'Voir les prix',
    'schedule.button': 'جدولة لاحقاً',
    'schedule.modal.title': 'اختر نوع الاستلام',
    'schedule.immediate': 'استلام فوري',
    'schedule.later': 'جدولة لاحقاً',
    'schedule.date': 'التاريخ',
    'schedule.time': 'الوقت',
    'schedule.cancel': 'إلغاء',
    'schedule.confirm': 'تأكيد',
    'location.allow': 'السماح بالوصول إلى الموقع',
    'location.allow.desc': 'يوفر عنوان الاستلام الخاص بك',
    'schedule.button': 'Planifier plus tard',
    'schedule.modal.title': 'Choisir le type de prise en charge',
    'schedule.immediate': 'Prise en charge immédiate',
    'schedule.later': 'Planifier plus tard',
    'schedule.date': 'Date',
    'schedule.time': 'Heure',
    'schedule.cancel': 'Annuler',
    'schedule.confirm': 'Confirmer',
    // Features
    'features.title': 'لماذا Grab Morocco؟',
    'features.safety.title': 'أمان مضمون',
    'features.safety.desc': 'جميع سائقينا موثوقون ومتدربون. تتبع رحلتك في الوقت الفعلي.',
    'features.pricing.title': 'أسعار شفافة',
    'features.pricing.desc': 'اعرف السعر قبل الحجز. لا مفاجآت، لا رسوم خفية.',
    'features.fast.title': 'وصول سريع',
    'features.fast.desc': 'متوسط وقت الانتظار 5 دقائق في المدن الكبرى في المغرب.',
    'features.payment.title': 'دفع مرن',
    'features.payment.desc': 'ادفع نقداً أو ببطاقة أو عبر محفظتك الإلكترونية.',
    'features.available.title': 'متاح في كل مكان',
    'features.available.desc': 'خدمة متاحة في جميع المدن الكبرى في المغرب، على مدار الساعة.',
    'features.drivers.title': 'سائقون ممتازون',
    'features.drivers.desc': 'أكثر من 50,000 سائق بمتوسط تقييم 4.8/5.',
    // Stats
    'stats.drivers': 'سائق نشط',
    'stats.rides': 'رحلة شهرياً',
    'stats.rating': 'متوسط التقييم',
    'stats.cities': 'مدينة مغطاة',
    // How it works
    'howItWorks.title': 'كيف يعمل؟',
    'howItWorks.step1.title': 'أدخل وجهتك',
    'howItWorks.step1.desc': 'حدد المكان الذي تريد الذهاب إليه واختر نوع رحلتك',
    'howItWorks.step2.title': 'يجدك سائق',
    'howItWorks.step2.desc': 'يوفر نظامنا لك السائق الأقرب',
    'howItWorks.step3.title': 'تتبع رحلتك',
    'howItWorks.step3.desc': 'تتبع وصول سائقك ومسارك في الوقت الفعلي',
    'howItWorks.step4.title': 'ادفع بسهولة',
    'howItWorks.step4.desc': 'ادفع نقداً أو ببطاقة. بسيط وآمن',
    // CTA
    'cta.title': 'جاهز للانطلاق؟',
    'cta.subtitle': 'قم بتنزيل تطبيق Grab Morocco واحجز رحلتك الأولى',
    'cta.appStore.line1': 'تنزيل من',
    'cta.appStore.line2': 'App Store',
    'cta.googlePlay.line1': 'تنزيل من',
    'cta.googlePlay.line2': 'Google Play',
    // Footer
    'footer.tagline': 'منصة النقل والتوصيل الأولى في المغرب',
    'footer.company': 'الشركة',
    'footer.company.about': 'حول',
    'footer.company.careers': 'الوظائف',
    'footer.company.blog': 'المدونة',
    'footer.company.press': 'الصحافة',
    'footer.services': 'الخدمات',
    'footer.services.rides': 'الرحلات',
    'footer.services.delivery': 'التوصيل',
    'footer.services.package': 'توصيل الطرود',
    'footer.services.driver': 'كن سائقاً',
    'footer.support': 'الدعم',
    'footer.support.help': 'مركز المساعدة',
    'footer.support.safety': 'الأمان',
    'footer.support.contact': 'اتصل بنا',
    'footer.support.faq': 'الأسئلة الشائعة',
    'footer.copyright': '© 2025 Grab Morocco. جميع الحقوق محفوظة.',
  },
  fr: {
    // Navigation
    'nav.services': 'Services',
    'nav.howItWorks': 'Comment ça marche',
    'nav.safety': 'Sécurité',
    'nav.partner': 'Devenir partenaire',
    'nav.about': 'À propos',
    'nav.help': 'Aide',
    'nav.login': 'Connexion',
    'nav.signup': 'S\'inscrire',
    // Hero
    'hero.title': 'Réservez votre course en quelques secondes',
    'hero.subtitle': 'Déplacez-vous facilement dans tout le Maroc avec des conducteurs vérifiés et des tarifs transparents',
    'booking.tab.ride': 'Course',
    'booking.tab.delivery': 'Livraison',
    'form.where': 'Où allez-vous ?',
    'form.destination.placeholder': 'Entrez votre destination',
    'form.pickup': 'Point de départ',
    'form.pickup.placeholder': 'Votre position actuelle',
    'form.rideType': 'Type de course',
    'rideType.standard': 'Standard',
    'rideType.comfort': 'Confort',
    'rideType.xl': 'XL',
    'rideType.price.from': 'À partir de',
    'btn.book': 'Voir les prix',
    'btn.viewPrices': 'Voir les prix',
    'schedule.button': 'Planifier plus tard',
    'location.allow': 'Autoriser l\'accès à la localisation',
    'location.allow.desc': 'Il fournit votre adresse de prise en charge',
    'schedule.modal.title': 'Choisir le type de prise en charge',
    'schedule.immediate': 'Prise en charge immédiate',
    'schedule.later': 'Planifier plus tard',
    'schedule.date': 'Date',
    'schedule.time': 'Heure',
    'schedule.cancel': 'Annuler',
    'schedule.confirm': 'Confirmer',
    // Features
    'features.title': 'Pourquoi choisir Grab Morocco ?',
    'features.safety.title': 'Sécurité garantie',
    'features.safety.desc': 'Tous nos conducteurs sont vérifiés et formés. Suivez votre course en temps réel.',
    'features.pricing.title': 'Tarifs transparents',
    'features.pricing.desc': 'Connaissez le prix avant de réserver. Pas de surprises, pas de frais cachés.',
    'features.fast.title': 'Arrivée rapide',
    'features.fast.desc': 'Temps d\'attente moyen de 5 minutes dans les grandes villes du Maroc.',
    'features.payment.title': 'Paiement flexible',
    'features.payment.desc': 'Payez en espèces, par carte ou via votre portefeuille électronique.',
    'features.available.title': 'Disponible partout',
    'features.available.desc': 'Service disponible dans toutes les grandes villes du Maroc, 24/7.',
    'features.drivers.title': 'Conducteurs étoiles',
    'features.drivers.desc': 'Plus de 50 000 conducteurs avec une note moyenne de 4.8/5.',
    // Stats
    'stats.drivers': 'Conducteurs actifs',
    'stats.rides': 'Courses par mois',
    'stats.rating': 'Note moyenne',
    'stats.cities': 'Villes couvertes',
    // How it works
    'howItWorks.title': 'Comment ça marche ?',
    'howItWorks.step1.title': 'Entrez votre destination',
    'howItWorks.step1.desc': 'Indiquez où vous voulez aller et choisissez votre type de course',
    'howItWorks.step2.title': 'Un conducteur vous trouve',
    'howItWorks.step2.desc': 'Notre système vous met en relation avec le conducteur le plus proche',
    'howItWorks.step3.title': 'Suivez votre course',
    'howItWorks.step3.desc': 'Suivez en temps réel l\'arrivée de votre conducteur et votre trajet',
    'howItWorks.step4.title': 'Payez facilement',
    'howItWorks.step4.desc': 'Payez en espèces ou par carte. Simple et sécurisé',
    // CTA
    'cta.title': 'Prêt à partir ?',
    'cta.subtitle': 'Téléchargez l\'application Grab Morocco et réservez votre première course',
    'cta.appStore.line1': 'Télécharger sur',
    'cta.appStore.line2': 'App Store',
    'cta.googlePlay.line1': 'Télécharger sur',
    'cta.googlePlay.line2': 'Google Play',
    // Footer
    'footer.tagline': 'La plateforme de transport et livraison #1 au Maroc',
    'footer.company': 'Entreprise',
    'footer.company.about': 'À propos',
    'footer.company.careers': 'Carrières',
    'footer.company.blog': 'Blog',
    'footer.company.press': 'Presse',
    'footer.services': 'Services',
    'footer.services.rides': 'Courses',
    'footer.services.delivery': 'Livraison',
    'footer.services.package': 'Livraison de colis',
    'footer.services.driver': 'Devenir conducteur',
    'footer.support': 'Support',
    'footer.support.help': 'Centre d\'aide',
    'footer.support.safety': 'Sécurité',
    'footer.support.contact': 'Nous contacter',
    'footer.support.faq': 'FAQ',
    'footer.copyright': '© 2025 Grab Morocco. Tous droits réservés.',
  },
  en: {
    // Navigation
    'nav.services': 'Services',
    'nav.howItWorks': 'How it works',
    'nav.safety': 'Safety',
    'nav.partner': 'Become a Partner',
    'nav.about': 'About',
    'nav.help': 'Help',
    'nav.login': 'Login',
    'nav.signup': 'Sign up',
    // Hero
    'hero.title': 'Book your ride in seconds',
    'hero.subtitle': 'Move easily throughout Morocco with verified drivers and transparent pricing',
    'booking.tab.ride': 'Ride',
    'booking.tab.delivery': 'Delivery',
    'form.where': 'Where are you going?',
    'form.destination.placeholder': 'Enter your destination',
    'form.pickup': 'Pickup point',
    'form.pickup.placeholder': 'Your current location',
    'form.rideType': 'Ride type',
    'rideType.standard': 'Standard',
    'rideType.comfort': 'Comfort',
    'rideType.xl': 'XL',
    'rideType.price.from': 'From',
    'btn.book': 'See prices',
    'btn.viewPrices': 'See prices',
    'schedule.button': 'Schedule later',
    'schedule.modal.title': 'Choose pickup type',
    'schedule.immediate': 'Immediate pickup',
    'schedule.later': 'Schedule later',
    'schedule.date': 'Date',
    'schedule.time': 'Time',
    'schedule.cancel': 'Cancel',
    'schedule.confirm': 'Confirm',
    'location.allow': 'Allow location access',
    'location.allow.desc': 'It provides your pickup address',
    // Features
    'features.title': 'Why choose Grab Morocco?',
    'features.safety.title': 'Guaranteed safety',
    'features.safety.desc': 'All our drivers are verified and trained. Track your ride in real-time.',
    'features.pricing.title': 'Transparent pricing',
    'features.pricing.desc': 'Know the price before booking. No surprises, no hidden fees.',
    'features.fast.title': 'Fast arrival',
    'features.fast.desc': 'Average waiting time of 5 minutes in major cities in Morocco.',
    'features.payment.title': 'Flexible payment',
    'features.payment.desc': 'Pay in cash, by card, or via your e-wallet.',
    'features.available.title': 'Available everywhere',
    'features.available.desc': 'Service available in all major cities in Morocco, 24/7.',
    'features.drivers.title': 'Star drivers',
    'features.drivers.desc': 'More than 50,000 drivers with an average rating of 4.8/5.',
    // Stats
    'stats.drivers': 'Active drivers',
    'stats.rides': 'Rides per month',
    'stats.rating': 'Average rating',
    'stats.cities': 'Cities covered',
    // How it works
    'howItWorks.title': 'How does it work?',
    'howItWorks.step1.title': 'Enter your destination',
    'howItWorks.step1.desc': 'Specify where you want to go and choose your ride type',
    'howItWorks.step2.title': 'A driver finds you',
    'howItWorks.step2.desc': 'Our system connects you with the nearest driver',
    'howItWorks.step3.title': 'Track your ride',
    'howItWorks.step3.desc': 'Track your driver\'s arrival and your journey in real-time',
    'howItWorks.step4.title': 'Pay easily',
    'howItWorks.step4.desc': 'Pay in cash or by card. Simple and secure',
    // CTA
    'cta.title': 'Ready to go?',
    'cta.subtitle': 'Download the Grab Morocco app and book your first ride',
    'cta.appStore.line1': 'Download on',
    'cta.appStore.line2': 'App Store',
    'cta.googlePlay.line1': 'Download on',
    'cta.googlePlay.line2': 'Google Play',
    // Footer
    'footer.tagline': 'Morocco\'s #1 transport and delivery platform',
    'footer.company': 'Company',
    'footer.company.about': 'About us',
    'footer.company.careers': 'Careers',
    'footer.company.blog': 'Blog',
    'footer.company.press': 'Press',
    'footer.services': 'Services',
    'footer.services.rides': 'Rides',
    'footer.services.delivery': 'Delivery',
    'footer.services.package': 'Package delivery',
    'footer.services.driver': 'Become a driver',
    'footer.support': 'Support',
    'footer.support.help': 'Help center',
    'footer.support.safety': 'Safety',
    'footer.support.contact': 'Contact us',
    'footer.support.faq': 'FAQ',
    'footer.copyright': '© 2025 Grab Morocco. All rights reserved.',
  },
};

const Ride: React.FC = () => {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [rideType, setRideType] = useState('standard');
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'fr';
  });
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleType, setScheduleType] = useState('immediate'); // 'immediate' or 'later'
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState([
    { address: 'Calle Pedro Barba 4', city: '35500 Arrecife, ES' },
    { address: 'Calle Pedro Barba 6', city: '35500 Arrecife, ES' },
  ]);

  // Fonction de traduction
  const t = (key) => {
    return translations[language]?.[key] || key;
  };

  const handleBookRide = () => {
    console.log('handleBookRide called');
    // Rediriger vers la page de réservation avec les données du formulaire
    navigate('/ride/booking', {
      state: {
        pickup,
        destination,
        scheduleType,
        scheduledDate: scheduleType === 'later' ? scheduledDate : null,
        scheduledTime: scheduleType === 'later' ? scheduledTime : null,
        rideType
      }
    });
  };

  const handleScheduleConfirm = () => {
    setShowScheduleModal(false);
  };

  const handleScheduleCancel = () => {
    setShowScheduleModal(false);
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Ici, vous pouvez utiliser une API de géocodage inverse pour obtenir l'adresse
          // Pour l'instant, on utilise juste les coordonnées
          setPickup(`${latitude}, ${longitude}`);
          setShowPickupSuggestions(false);
        },
        (error) => {
          console.error('Erreur de géolocalisation:', error);
          alert('Impossible d\'accéder à votre localisation');
        }
      );
    } else {
      alert('La géolocalisation n\'est pas supportée par votre navigateur');
    }
  };

  const handleSelectSuggestion = (address) => {
    setPickup(address);
    setShowPickupSuggestions(false);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    setShowLanguageDropdown(false);
    // Mettre à jour la direction du document pour RTL/LTR
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.body.className = document.body.className.replace(/\b(rtl|ltr)\b/g, '');
    document.body.classList.add(lang === 'ar' ? 'rtl' : 'ltr');
  };

  useEffect(() => {
    // Appliquer la langue au chargement
    const savedLang = localStorage.getItem('language') || 'fr';
    document.documentElement.setAttribute('lang', savedLang);
    document.documentElement.setAttribute('dir', savedLang === 'ar' ? 'rtl' : 'ltr');
    document.body.className = document.body.className.replace(/\b(rtl|ltr)\b/g, '');
    document.body.classList.add(savedLang === 'ar' ? 'rtl' : 'ltr');
  }, []);

  // Fermer le dropdown quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showLanguageDropdown && !event.target.closest('.language-switcher')) {
        setShowLanguageDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showLanguageDropdown]);

  // Fermer le modal avec la touche Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && showScheduleModal) {
        setShowScheduleModal(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showScheduleModal]);

  // Fermer les suggestions quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showPickupSuggestions && !event.target.closest('.pickup-group')) {
        setShowPickupSuggestions(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showPickupSuggestions]);

  return (
    <div className="ride-landing">
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
                                onClick={(e) => {
                                    e.preventDefault();
                                    const element = document.getElementById('services');
                                    if (element) {
                                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }
                                }}
                                className="nav-link-services text-gray-700 hover:text-morocco-red transition-colors font-medium"
                            >
                                {t('nav.services')}
                            </a>
                            <a 
                                href="#how-it-works" 
                                onClick={(e) => {
                                    e.preventDefault();
                                    const element = document.getElementById('how-it-works');
                                    if (element) {
                                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }
                                }}
                                className="nav-link-how-it-works text-gray-700 hover:text-morocco-red transition-colors font-medium"
                            >
                                {t('nav.howItWorks')}
                            </a>
                            <a 
                                href="#safety" 
                                onClick={(e) => {
                                    e.preventDefault();
                                    const element = document.getElementById('safety');
                                    if (element) {
                                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }
                                }}
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
                                    onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                                    className="language-switcher-button flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all"
                                >
                                    <span className="language-code-badge w-5 h-5 flex items-center justify-center text-gray-700 font-bold text-xs border border-gray-300 rounded-sm">
                                        {language.toUpperCase()}
                                    </span>
                                    <span className="language-code-text font-medium text-gray-700 hidden sm:inline">{language.toUpperCase()}</span>
                                    <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                                    </svg>
                                </button>
                                <div 
                                    className={`language-dropdown-menu ${showLanguageDropdown ? '' : 'hidden'} absolute top-full mt-2 right-0 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[150px] z-50`}
                                >
                                    <button 
                                        onClick={() => handleLanguageChange('ar')}
                                        className={`language-option-arabic w-full px-4 py-2 text-right hover:bg-morocco-red/5 transition-colors flex items-center justify-between gap-3 ${language === 'ar' ? 'bg-morocco-red/10 text-morocco-red font-semibold' : ''}`}
                                    >
                                        <span className="language-label font-medium">العربية</span>
                                        <span className="language-code text-sm text-gray-500">AR</span>
                                    </button>
                                    <button 
                                        onClick={() => handleLanguageChange('fr')}
                                        className={`language-option-french w-full px-4 py-2 text-right hover:bg-morocco-red/5 transition-colors flex items-center justify-between gap-3 ${language === 'fr' ? 'bg-morocco-red/10 text-morocco-red font-semibold' : ''}`}
                                    >
                                        <span className="language-label font-medium">Français</span>
                                        <span className="language-code text-sm text-gray-500">FR</span>
                                    </button>
                                    <button 
                                        onClick={() => handleLanguageChange('en')}
                                        className={`language-option-english w-full px-4 py-2 text-right hover:bg-morocco-red/5 transition-colors flex items-center justify-between gap-3 ${language === 'en' ? 'bg-morocco-red/10 text-morocco-red font-semibold' : ''}`}
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
                        </div>
                    </div>
                </div>
            </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              {t('hero.title')}
            </h1>
            <p className="hero-subtitle">
              {t('hero.subtitle')}
            </p>
          </div>

          {/* Booking Form */}
          <div className="booking-card">
            <div className="booking-tabs">
              <button className="tab active">{t('booking.tab.ride')}</button>
              <button className="tab">{t('booking.tab.delivery')}</button>
            </div>

            <form className="booking-form">
              {/* Schedule Button */}
              <button
                type="button"
                className="schedule-button"
                onClick={() => setShowScheduleModal(true)}
              >
                <svg className="schedule-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {scheduleType === 'immediate' ? t('schedule.immediate') : t('schedule.button')}
                <svg className="schedule-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className="form-group">
                <label className="form-label">
                  <svg className="form-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {t('form.where')}
                </label>
                <input
                  type="text"
                  placeholder={t('form.destination.placeholder')}
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group pickup-group">
                <label className="form-label">
                  <svg className="form-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {t('form.pickup')}
                </label>
                <div className="pickup-input-wrapper">
                  <input
                    type="text"
                    placeholder={t('form.pickup.placeholder')}
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    onFocus={() => setShowPickupSuggestions(true)}
                    className="form-input pickup-input"
                  />
                  <button
                    type="button"
                    className="pickup-locate-btn"
                    onClick={() => setShowPickupSuggestions(!showPickupSuggestions)}
                    aria-label="Locate"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
                {showPickupSuggestions && (
                  <div className="pickup-suggestions">
                    <button
                      type="button"
                      className="suggestion-item location-access"
                      onClick={handleUseCurrentLocation}
                    >
                      <svg className="suggestion-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div className="suggestion-content">
                        <div className="suggestion-title">{t('location.allow')}</div>
                        <div className="suggestion-subtitle">{t('location.allow.desc')}</div>
                      </div>
                    </button>
                    {locationSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        className="suggestion-item"
                        onClick={() => handleSelectSuggestion(suggestion.address)}
                      >
                        <svg className="suggestion-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div className="suggestion-content">
                          <div className="suggestion-title">{suggestion.address}</div>
                          <div className="suggestion-subtitle">{suggestion.city}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button type="button" className="btn-book" onClick={handleBookRide}>
                {t('btn.book')}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="modal-overlay" onClick={handleScheduleCancel}>
          <div className="schedule-modal" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close"
              onClick={handleScheduleCancel}
              aria-label="Close"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h3 className="modal-title">{t('schedule.modal.title')}</h3>
            
            <div className="schedule-options">
              <label className="schedule-option">
                <input
                  type="radio"
                  name="scheduleType"
                  value="immediate"
                  checked={scheduleType === 'immediate'}
                  onChange={(e) => setScheduleType(e.target.value)}
                />
                <span className="radio-custom"></span>
                <span className="option-label">{t('schedule.immediate')}</span>
              </label>
              
              <label className="schedule-option">
                <input
                  type="radio"
                  name="scheduleType"
                  value="later"
                  checked={scheduleType === 'later'}
                  onChange={(e) => setScheduleType(e.target.value)}
                />
                <span className="radio-custom"></span>
                <span className="option-label">{t('schedule.later')}</span>
              </label>
            </div>

            {scheduleType === 'later' && (
              <div className="schedule-datetime">
                <div className="form-group">
                  <label className="form-label">{t('schedule.date')}</label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="form-input"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('schedule.time')}</label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
              </div>
            )}

            <div className="modal-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={handleScheduleCancel}
              >
                {t('schedule.cancel')}
              </button>
              <button
                type="button"
                className="btn-confirm"
                onClick={handleScheduleConfirm}
                disabled={scheduleType === 'later' && (!scheduledDate || !scheduledTime)}
              >
                {t('schedule.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <section id="services" className="features-section">
        <div className="container">
          <h2 className="section-title">{t('features.title')}</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-container">
                <div className="feature-icon">🛡️</div>
              </div>
              <div className="feature-content">
                <h3 className="feature-title">{t('features.safety.title')}</h3>
                <p className="feature-description">
                  {t('features.safety.desc')}
                </p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon-container">
                <div className="feature-icon">💰</div>
              </div>
              <div className="feature-content">
                <h3 className="feature-title">{t('features.pricing.title')}</h3>
                <p className="feature-description">
                  {t('features.pricing.desc')}
                </p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon-container">
                <div className="feature-icon">⚡</div>
              </div>
              <div className="feature-content">
                <h3 className="feature-title">{t('features.fast.title')}</h3>
                <p className="feature-description">
                  {t('features.fast.desc')}
                </p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon-container">
                <div className="feature-icon">📱</div>
              </div>
              <div className="feature-content">
                <h3 className="feature-title">{t('features.payment.title')}</h3>
                <p className="feature-description">
                  {t('features.payment.desc')}
                </p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon-container">
                <div className="feature-icon">🌍</div>
              </div>
              <div className="feature-content">
                <h3 className="feature-title">{t('features.available.title')}</h3>
                <p className="feature-description">
                  {t('features.available.desc')}
                </p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon-container">
                <div className="feature-icon">⭐</div>
              </div>
              <div className="feature-content">
                <h3 className="feature-title">{t('features.drivers.title')}</h3>
                <p className="feature-description">
                  {t('features.drivers.desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">50K+</div>
              <div className="stat-label">{t('stats.drivers')}</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">1M+</div>
              <div className="stat-label">{t('stats.rides')}</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">4.8★</div>
              <div className="stat-label">{t('stats.rating')}</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">15+</div>
              <div className="stat-label">{t('stats.cities')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="about" className="how-it-works">
        <div className="container">
          <h2 className="section-title">{t('howItWorks.title')}</h2>
          
          <div className="steps-grid">
            <div className="step-item">
              <div className="step-number">1</div>
              <h3 className="step-title">{t('howItWorks.step1.title')}</h3>
              <p className="step-description">
                {t('howItWorks.step1.desc')}
              </p>
            </div>

            <div className="step-item">
              <div className="step-number">2</div>
              <h3 className="step-title">{t('howItWorks.step2.title')}</h3>
              <p className="step-description">
                {t('howItWorks.step2.desc')}
              </p>
            </div>

            <div className="step-item">
              <div className="step-number">3</div>
              <h3 className="step-title">{t('howItWorks.step3.title')}</h3>
              <p className="step-description">
                {t('howItWorks.step3.desc')}
              </p>
            </div>

            <div className="step-item">
              <div className="step-number">4</div>
              <h3 className="step-title">{t('howItWorks.step4.title')}</h3>
              <p className="step-description">
                {t('howItWorks.step4.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">{t('cta.title')}</h2>
            <p className="cta-subtitle">
              {t('cta.subtitle')}
            </p>
            <div className="cta-buttons">
              <button className="btn-app-store">
                <svg className="app-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C1.79 15.25 2.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <div>
                  {t('cta.appStore.line1')}<br />
                  {t('cta.appStore.line2')}
                </div>
              </button>
              <button className="btn-google-play">
                <svg className="app-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                <div>
                  {t('cta.googlePlay.line1')}<br />
                  {t('cta.googlePlay.line2')}
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="ride-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-column">
              <div className="footer-logo">
                <div className="logo-icon">G</div>
                <span className="logo-text">Grab Morocco</span>
              </div>
              <p className="footer-tagline">
                {t('footer.tagline')}
              </p>
            </div>

            <div className="footer-column">
              <h4 className="footer-title">{t('footer.company')}</h4>
              <ul className="footer-links">
                <li><a href="#">{t('footer.company.about')}</a></li>
                <li><a href="#">{t('footer.company.careers')}</a></li>
                <li><a href="#">{t('footer.company.blog')}</a></li>
                <li><a href="#">{t('footer.company.press')}</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-title">{t('footer.services')}</h4>
              <ul className="footer-links">
                <li><a href="#">{t('footer.services.rides')}</a></li>
                <li><a href="#">{t('footer.services.delivery')}</a></li>
                <li><a href="#">{t('footer.services.package')}</a></li>
                <li><a href="#">{t('footer.services.driver')}</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-title">{t('footer.support')}</h4>
              <ul className="footer-links">
                <li><a href="#">{t('footer.support.help')}</a></li>
                <li><a href="#">{t('footer.support.safety')}</a></li>
                <li><a href="#">{t('footer.support.contact')}</a></li>
                <li><a href="#">{t('footer.support.faq')}</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-copyright">
              {t('footer.copyright')}
            </div>
            <div className="footer-social">
              <a href="#" className="social-link">Facebook</a>
              <a href="#" className="social-link">Twitter</a>
              <a href="#" className="social-link">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Ride;
