import type { Language, TranslationConfig } from '../types';

export const languageConfig: Record<Language, TranslationConfig> = {
    ar: { lang: 'ar', dir: 'rtl' },
    fr: { lang: 'fr', dir: 'ltr' },
    en: { lang: 'en', dir: 'ltr' }
};

const translationsDict: Record<string, Record<Language, string>> = {
    'nav.services': { ar: 'خدماتنا', fr: 'Services', en: 'Services' },
    'nav.howItWorks': { ar: 'كيف يعمل', fr: 'Comment ça marche', en: 'How it works' },
    'nav.safety': { ar: 'الأمان', fr: 'Sécurité', en: 'Safety' },
    'nav.partner': { ar: 'كن شريكاً', fr: 'Devenir partenaire', en: 'Become a Partner' },
    'nav.login': { ar: 'تسجيل الدخول', fr: 'Connexion', en: 'Login' },
    'nav.downloadApp': { ar: 'حمل التطبيق', fr: 'Télécharger', en: 'Download App' },
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

let currentLanguage: Language = 'en';

export function getTranslation(key: string, lang: Language = currentLanguage): string {
    return translationsDict[key]?.[lang] || key;
}

export function setLanguage(lang: Language) {
    currentLanguage = lang;
}

export function getCurrentLanguage(): Language {
    return currentLanguage;
}

export type { Language };