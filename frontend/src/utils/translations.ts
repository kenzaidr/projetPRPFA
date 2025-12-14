import type { Language, TranslationConfig } from '../types';

export const languageConfig: Record<Language, TranslationConfig> = {
    ar: { lang: 'ar', dir: 'rtl', label: 'العربية' },
    fr: { lang: 'fr', dir: 'ltr', label: 'Français' },
    en: { lang: 'en', dir: 'ltr', label: 'English' }
};

const translationsDict: Record<string, Record<Language, string>> = {
    'nav.services': { ar: 'خدماتنا', fr: 'Services', en: 'Services' },
    'nav.howItWorks': { ar: 'كيف يعمل', fr: 'Comment ça marche', en: 'How it works' },
    'nav.safety': { ar: 'الأمان', fr: 'Sécurité', en: 'Safety' },
    'nav.partner': { ar: 'كن شريكاً', fr: 'Devenir partenaire', en: 'Become a Partner' },
    'nav.login': { ar: 'تسجيل الدخول', fr: 'Connexion', en: 'Login' },
    'nav.downloadApp': { ar: 'حمل التطبيق', fr: 'Télécharger', en: 'Download App' },
    'nav.backToHome': { ar: 'العودة إلى الصفحة الرئيسية', fr: 'Retour à l\'accueil', en: 'Back to Home' },
    
    // Auth General (Partner)
    'auth.login.title': { ar: 'تسجيل دخول الشركاء', fr: 'Connexion Partenaire', en: 'Partner Login' },
    'auth.login.subtitle': { ar: 'إدارة أعمالك أو رحلاتك', fr: 'Gérez votre activité ou vos courses', en: 'Manage your business or drives' },
    'auth.login.email': { ar: 'البريد الإلكتروني أو الهاتف', fr: 'Email ou Téléphone', en: 'Email or Phone' },
    'auth.login.emailPlaceholder': { ar: 'name@example.com', fr: 'nom@exemple.com', en: 'name@example.com' },
    'auth.login.password': { ar: 'كلمة المرور', fr: 'Mot de passe', en: 'Password' },
    'auth.login.passwordPlaceholder': { ar: 'أدخل كلمة المرور', fr: 'Entrez votre mot de passe', en: 'Enter your password' },
    'auth.login.forgotPassword': { ar: 'نسيت كلمة المرور؟', fr: 'Mot de passe oublié ?', en: 'Forgot Password?' },
    'auth.login.submit': { ar: 'دخول كشريك', fr: 'Se connecter', en: 'Login as Partner' },
    'auth.login.noAccount': { ar: 'ليس لديك حساب؟', fr: 'Pas de compte ?', en: 'Don\'t have an account?' },
    'auth.login.signupLink': { ar: 'انضم كشريك', fr: 'Devenir Partenaire', en: 'Join as Partner' },
    'auth.error.invalidCredentials': { ar: 'البريد الإلكتروني أو كلمة المرور غير صحيحة', fr: 'Email ou mot de passe incorrect', en: 'Invalid email or password' },

    // Signup General
    'auth.signup.title': { ar: 'انضم كشريك', fr: 'Devenir Partenaire', en: 'Join as a Partner' },
    'auth.signup.subtitle': { ar: 'نمِّ أعمالك مع غراب المغرب', fr: 'Développez votre activité avec Grab Morocco', en: 'Grow your business with Grab Morocco' },
    
    // Partner Type Selection
    'auth.signup.selectType': { ar: 'أريد التسجيل كـ...', fr: 'Je veux m\'inscrire en tant que...', en: 'I want to register as a...' },
    'auth.signup.type.driver': { ar: 'سائق', fr: 'Chauffeur', en: 'Driver' },
    'auth.signup.type.driverDesc': { ar: 'اربح من خلال توصيل الركاب أو الطلبات', fr: 'Gagnez en conduisant ou en livrant', en: 'Earn by driving passengers or deliveries' },
    'auth.signup.type.restaurant': { ar: 'مطعم', fr: 'Restaurant', en: 'Restaurant' },
    'auth.signup.type.restaurantDesc': { ar: 'نمِّ مطعمك معنا', fr: 'Développez votre restaurant avec nous', en: 'Grow your food business with us' },
    
    'auth.signup.section.personal': { ar: 'المعلومات الشخصية', fr: 'Informations Personnelles', en: 'Personal Information' },
    'auth.signup.section.business': { ar: 'معلومات العمل', fr: 'Informations Commerciales', en: 'Business Information' },
    'auth.signup.section.vehicle': { ar: 'معلومات المركبة', fr: 'Informations du Véhicule', en: 'Vehicle Information' },
    
    // Signup Fields
    'auth.signup.fullName': { ar: 'الاسم الكامل', fr: 'Nom Complet', en: 'Full Name' },
    'auth.signup.fullNamePlaceholder': { ar: 'الاسم الكامل', fr: 'Jean Dupont', en: 'John Doe' },
    'auth.signup.phone': { ar: 'رقم الهاتف', fr: 'Numéro de téléphone', en: 'Phone Number' },
    'auth.signup.phonePlaceholder': { ar: '+212 6XX-XXXXXX', fr: '+212 6XX-XXXXXX', en: '+212 6XX-XXXXXX' },
    'auth.signup.confirmPassword': { ar: 'تأكيد كلمة المرور', fr: 'Confirmer le mot de passe', en: 'Confirm Password' },
    
    // Vehicle Fields
    'auth.signup.vehicleModel': { ar: 'موديل المركبة', fr: 'Modèle du véhicule', en: 'Vehicle Model' },
    'auth.signup.licensePlate': { ar: 'لوحة الترخيص', fr: 'Immatriculation', en: 'License Plate' },
    'auth.signup.vehicleType': { ar: 'نوع المركبة', fr: 'Type de véhicule', en: 'Vehicle Type' },
    'auth.signup.type.car': { ar: 'سيارة', fr: 'Voiture', en: 'Car' },
    'auth.signup.type.motorcycle': { ar: 'دراجة نارية', fr: 'Moto', en: 'Motorcycle' },
    
    // Restaurant Fields
    'auth.signup.restaurantName': { ar: 'اسم المطعم', fr: 'Nom du Restaurant', en: 'Restaurant Name' },
    'auth.signup.restaurantAddress': { ar: 'العنوان', fr: 'Adresse', en: 'Address' },
    'auth.signup.cuisineType': { ar: 'نوع المطبخ', fr: 'Type de Cuisine', en: 'Cuisine Type' },

    'auth.signup.terms': { ar: 'أوافق على الشروط والأحكام', fr: 'J\'accepte les conditions générales', en: 'I agree to the Terms & Conditions' },
    'auth.signup.submit': { ar: 'إنشاء حساب شريك', fr: 'Créer un compte partenaire', en: 'Create Partner Account' },
    'auth.signup.hasAccount': { ar: 'هل أنت شريك بالفعل؟', fr: 'Déjà partenaire ?', en: 'Already a partner?' },
    'auth.signup.loginLink': { ar: 'سجل الدخول هنا', fr: 'Connexion', en: 'Login Here' },

    // Errors & Strength
    'auth.password.strength.weak': { ar: 'ضعيف', fr: 'Faible', en: 'Weak' },
    'auth.password.strength.medium': { ar: 'متوسط', fr: 'Moyen', en: 'Medium' },
    'auth.password.strength.strong': { ar: 'قوي', fr: 'Fort', en: 'Strong' },
    'auth.error.required': { ar: 'هذا الحقل مطلوب', fr: 'Ce champ est requis', en: 'This field is required' },
    'auth.error.email': { ar: 'بريد إلكتروني غير صالح', fr: 'Adresse email invalide', en: 'Invalid email address' },
    'auth.error.match': { ar: 'كلمات المرور غير متطابقة', fr: 'Les mots de passe ne correspondent pas', en: 'Passwords do not match' },
    'auth.error.terms': { ar: 'يجب أن توافق على الشروط', fr: 'Vous devez accepter les conditions', en: 'You must agree to the terms' },
    'hero.badge': { ar: 'التطبيق رقم #1 في المغرب', fr: 'Application #1 au Maroc', en: '#1 App in Morocco' },
    'hero.title1': { ar: 'تحرك بحرية', fr: 'Déplacez-vous librement', en: 'Move Freely' },
    'hero.title2': { ar: 'في كل أنحاء المغرب', fr: 'partout au Maroc', en: 'Across Morocco' },
    'hero.description': { ar: 'أفضل تطبيق لحجز السيارات وتوصيل الطلبات في المغرب. سريع، آمن، وموثوق.', fr: 'La meilleure application de transport et de livraison au Maroc. Rapide, sûr et fiable.', en: 'The best ride-hailing and delivery app in Morocco. Fast, safe, and reliable.' },
    'hero.bookNow': { ar: 'احجز الآن', fr: 'Réserver', en: 'Book Now' },
    'hero.watchVideo': { ar: 'شاهد الفيديو', fr: 'Voir la vidéo', en: 'Watch Video' },
    'hero.stat1': { ar: 'سائق شريك', fr: 'Chauffeurs', en: 'Partner Drivers' },
    'hero.stat2': { ar: 'مستخدم سعيد', fr: 'Utilisateurs', en: 'Happy Users' },
    'hero.stat3': { ar: 'تقييم التطبيق', fr: 'Note', en: 'App Rating' },
    'hero.nextRide': { ar: 'الرحلة القادمة', fr: 'Prochain trajet', en: 'Next Ride' },
    'hero.nextRideTime': { ar: 'في دقيقتين', fr: 'Dans 2 min', en: 'In 2 min' },
    'hero.foodDelivery': { ar: 'توصيل طعام', fr: 'Livraison repas', en: 'Food Delivery' },
    'hero.foodDeliveryTime': { ar: '15-20 دقيقة', fr: '15-20 min', en: '15-20 min' },
    'services.title': { ar: 'خدماتنا', fr: 'Nos Services', en: 'Our Services' },
    'services.subtitle': { ar: 'كل ما تحتاجه في تطبيق واحد', fr: 'Tout ce dont vous avez besoin', en: 'Everything you need in one app' },
    'services.ride.title': { ar: 'توصيل الركاب', fr: 'Transport', en: 'Ride Hailing' },
    'services.ride.description': { ar: 'رحلات آمنة ومريحة بأسعار تنافسية في جميع المدن المغربية.', fr: 'Trajets sûrs et confortables à des prix compétitifs dans toutes les villes.', en: 'Safe and comfortable rides at competitive prices across Moroccan cities.' },
    'services.ride.cta': { ar: 'اطلب سيارة', fr: 'Commander', en: 'Request Ride' },
    'services.food.title': { ar: 'توصيل الطعام', fr: 'Livraison Repas', en: 'Food Delivery' },
    'services.food.description': { ar: 'أشهى الأطباق من أفضل المطاعم تصلك ساخنة إلى باب منزلك.', fr: 'Vos plats préférés des meilleurs restaurants livrés chauds chez vous.', en: 'Delicious meals from top restaurants delivered hot to your doorstep.' },
    'services.food.cta': { ar: 'اطلب طعام', fr: 'Commander', en: 'Order Food' },
    'services.package.title': { ar: 'توصيل الطرود', fr: 'Livraison Colis', en: 'Package Delivery' },
    'services.package.description': { ar: 'نقل البضائع والطرود بسرعة وأمان داخل وخارج المدينة.', fr: 'Transport de marchandises rapide et sécurisé.', en: 'Fast and secure package and goods transport.' },
    'services.package.cta': { ar: 'أرسل طرد', fr: 'Envoyer', en: 'Send Package' },
    'howItWorks.title': { ar: 'كيف يعمل التطبيق', fr: 'Comment ça marche', en: 'How It Works' },
    'howItWorks.subtitle': { ar: 'ثلاث خطوات بسيطة لبدء رحلتك', fr: 'Trois étapes simples', en: 'Three simple steps' },
    'howItWorks.step1.title': { ar: 'حدد وجهتك', fr: 'Choisissez destination', en: 'Set Destination' },
    'howItWorks.step1.description': { ar: 'افتح التطبيق وحدد المكان الذي تريد الذهاب إليه.', fr: 'Ouvrez l\'application et indiquez où vous voulez aller.', en: 'Open the app and set where you want to go.' },
    'howItWorks.step2.title': { ar: 'اختر نوع السيارة', fr: 'Choisissez véhicule', en: 'Choose Vehicle' },
    'howItWorks.step2.description': { ar: 'اختر السيارة التي تناسب احتياجاتك وميزانيتك.', fr: 'Sélectionnez le véhicule adapté à vos besoins.', en: 'Select the vehicle that fits your needs.' },
    'howItWorks.step3.title': { ar: 'استمتع بالرحلة', fr: 'Profitez du trajet', en: 'Enjoy the Ride' },
    'howItWorks.step3.description': { ar: 'سائقنا المحترف سيصل إليك في دقائق.', fr: 'Notre chauffeur arrivera en quelques minutes.', en: 'Our professional driver will arrive in minutes.' },
    'features.title': { ar: 'لماذا نحن؟', fr: 'Pourquoi nous?', en: 'Why Us?' },
    'features.subtitle': { ar: 'مميزات تجعلنا الخيار الأفضل', fr: 'Ce qui nous rend uniques', en: 'Features that make us the best' },
    'features.safety.title': { ar: 'أمان تام', fr: 'Sécurité Totale', en: 'Total Safety' },
    'features.safety.description': { ar: 'نظام تتبع مباشر وتحقق من هوية السائقين.', fr: 'Suivi en direct et vérification des chauffeurs.', en: 'Live tracking and driver verification.' },
    'features.payment.title': { ar: 'دفع سهل', fr: 'Paiement Facile', en: 'Easy Payment' },
    'features.payment.description': { ar: 'ادفع نقداً أو بالبطاقة أو عبر المحفظة الإلكترونية.', fr: 'Espèces, carte ou portefeuille électronique.', en: 'Cash, card, or e-wallet.' },
    'features.tracking.title': { ar: 'تتبع مباشر', fr: 'Suivi en Direct', en: 'Live Tracking' },
    'features.tracking.description': { ar: 'تتبع رحلتك لحظة بلحظة وشاركها مع عائلتك.', fr: 'Suivez votre trajet et partagez-le.', en: 'Track your ride and share with family.' },
    'features.fast.title': { ar: 'سرعة في الوصول', fr: 'Rapidité', en: 'Fast Arrival' },
    'features.fast.description': { ar: 'شبكة واسعة من السائقين لضمان وصول سريع.', fr: 'Grand réseau de chauffeurs pour une arrivée rapide.', en: 'Wide network of drivers for fast arrival.' },
    'partner.title': { ar: 'كن شريكاً معنا', fr: 'Devenez Partenaire', en: 'Become a Partner' },
    'partner.description': { ar: 'انضم إلى آلاف السائقين الذين يحققون دخلاً إضافياً مع Grab Morocco. حرية في العمل ودخل ممتاز.', fr: 'Rejoignez des milliers de chauffeurs. Liberté de travail et excellents revenus.', en: 'Join thousands of drivers earning extra income. Freedom to work and great earnings.' },
    'partner.income': { ar: 'دخل شهري', fr: 'Revenu mensuel', en: 'Monthly Income' },
    'partner.support': { ar: 'دعم فني', fr: 'Support', en: 'Support' },
    'partner.cta': { ar: 'سجل كسائق', fr: 'S\'inscrire Chauffeur', en: 'Join as Driver' },
    'footer.tagline': { ar: 'رفيقك في كل رحلة', fr: 'Votre compagnon de route', en: 'Your travel companion' },
    'footer.company': { ar: 'الشركة', fr: 'Entreprise', en: 'Company' },
    'footer.company.about': { ar: 'من نحن', fr: 'À propos', en: 'About Us' },
    'footer.company.careers': { ar: 'وظائف', fr: 'Carrières', en: 'Careers' },
    'footer.company.news': { ar: 'أخبار', fr: 'Actualités', en: 'News' },
    'footer.services': { ar: 'الخدمات', fr: 'Services', en: 'Services' },
    'footer.services.ride': { ar: 'نقل الركاب', fr: 'Transport', en: 'Ride' },
    'footer.services.food': { ar: 'توصيل الطعام', fr: 'Repas', en: 'Food' },
    'footer.services.package': { ar: 'الطرود', fr: 'Colis', en: 'Packages' },
    'footer.support': { ar: 'المساعدة', fr: 'Aide', en: 'Support' },
    'footer.support.help': { ar: 'مركز المساعدة', fr: 'Centre d\'aide', en: 'Help Center' },
    'footer.support.safety': { ar: 'الأمان', fr: 'Sécurité', en: 'Safety' },
    'footer.support.contact': { ar: 'اتصل بنا', fr: 'Contact', en: 'Contact Us' },
    'footer.copyright': { ar: '© 2024 Grab Morocco. جميع الحقوق محفوظة.', fr: '© 2024 Grab Morocco. Tous droits réservés.', en: '© 2024 Grab Morocco. All rights reserved.' },
};

const STORAGE_KEY = 'grab_morocco_lang';

export function getCurrentLanguage(): Language {
    try {
        if (typeof window !== 'undefined' && window.localStorage) {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored && (stored === 'en' || stored === 'fr' || stored === 'ar')) {
                return stored as Language;
            }
        }
    } catch (e) {
        console.warn('Error accessing localStorage:', e);
    }
    return 'en';
}

export function setLanguage(lang: Language) {
    try {
        if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem(STORAGE_KEY, lang);
            window.dispatchEvent(new Event('language-change'));
        }
    } catch (e) {
        console.warn('Error setting language in localStorage:', e);
    }
}

export function getTranslation(key: string, lang?: Language): string {
    const currentLang = lang || getCurrentLanguage();
    return translationsDict[key]?.[currentLang] || key;
}

export type { Language };