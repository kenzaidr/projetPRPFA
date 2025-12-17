import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  useEffect(() => {
    // Charger les scripts de traduction et main.js
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    // Charger Tailwind CSS
    if (!document.querySelector('script[src*="tailwindcss"]')) {
      const tailwindScript = document.createElement('script');
      tailwindScript.src = 'https://cdn.tailwindcss.com';
      document.body.appendChild(tailwindScript);
      
      tailwindScript.onload = () => {
        if (window.tailwind) {
          window.tailwind.config = {
            theme: {
              extend: {
                colors: {
                  'morocco-red': '#C1272D',
                  'morocco-green': '#006233',
                  'morocco-gold': '#D4AF37',
                  'morocco-sand': '#E8DCC4',
                },
                fontFamily: {
                  'inter': ['Inter', 'sans-serif'],
                  'poppins': ['Poppins', 'sans-serif'],
                }
              }
            }
          };
        }
      };
    }

    // Charger les scripts de traduction
    // Note: Les fichiers doivent être dans public/ pour être accessibles
    // loadScript('/js/translations.js')
    //   .then(() => loadScript('/js/main.js'))
    //   .catch(err => console.error('Error loading scripts:', err));

    // Appliquer les styles
    // Note: Les fichiers CSS doivent être dans public/ ou importés directement
    // const link = document.createElement('link');
    // link.rel = 'stylesheet';
    // link.href = '/css/styles.css';
    if (!document.querySelector(`link[href="${link.href}"]`)) {
      document.head.appendChild(link);
    }

    // Appliquer la langue au chargement
    const savedLang = localStorage.getItem('language') || 'ar';
    document.documentElement.setAttribute('lang', savedLang);
    document.documentElement.setAttribute('dir', savedLang === 'ar' ? 'rtl' : 'ltr');
    document.body.className = document.body.className.replace(/\b(rtl|ltr)\b/g, '');
    document.body.classList.add(savedLang === 'ar' ? 'rtl' : 'ltr');
  }, []);

  return (
    <div className="font-inter bg-white" dir="rtl" lang="ar">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/95 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-morocco-red to-morocco-green rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-morocco-red to-morocco-green bg-clip-text text-transparent">Grab Morocco</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-gray-700 hover:text-morocco-red transition-colors font-medium" data-i18n="nav.services">الخدمات</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-morocco-red transition-colors font-medium" data-i18n="nav.howItWorks">كيف يعمل</a>
              <a href="#safety" className="text-gray-700 hover:text-morocco-red transition-colors font-medium" data-i18n="nav.safety">الأمان</a>
              <a href="#partner" className="text-gray-700 hover:text-morocco-red transition-colors font-medium" data-i18n="nav.partner">كن شريكاً</a>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Language Switcher */}
              <div className="relative language-switcher">
                <button id="languageButton" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/>
                  </svg>
                  <span id="currentLang" className="font-medium text-gray-700">AR</span>
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
                <div id="languageDropdown" className="hidden absolute top-full mt-2 right-0 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[150px] z-50">
                  <button data-lang="ar" className="w-full px-4 py-2 text-right hover:bg-morocco-red/5 transition-colors flex items-center justify-between gap-3">
                    <span className="font-medium">العربية</span>
                    <span className="text-sm text-gray-500">AR</span>
                  </button>
                  <button data-lang="fr" className="w-full px-4 py-2 text-right hover:bg-morocco-red/5 transition-colors flex items-center justify-between gap-3">
                    <span className="font-medium">Français</span>
                    <span className="text-sm text-gray-500">FR</span>
                  </button>
                  <button data-lang="en" className="w-full px-4 py-2 text-right hover:bg-morocco-red/5 transition-colors flex items-center justify-between gap-3">
                    <span className="font-medium">English</span>
                    <span className="text-sm text-gray-500">EN</span>
                  </button>
                </div>
              </div>
              
              <button className="hidden md:block px-6 py-2.5 text-morocco-red font-semibold hover:bg-morocco-red/5 rounded-lg transition-all" data-i18n="nav.login">
                تسجيل الدخول
              </button>
              <button className="px-6 py-2.5 bg-gradient-to-r from-morocco-red to-morocco-green text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all" data-i18n="nav.downloadApp">
                حمل التطبيق
              </button>
              <button className="md:hidden p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-morocco-sand/30 via-white to-morocco-green/10"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-5">
          <div className="moroccan-pattern"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-right">
              <div className="inline-block mb-6 px-4 py-2 bg-morocco-gold/20 rounded-full">
                <span className="text-morocco-red font-semibold text-sm" data-i18n="hero.badge">🇲🇦 خدمة مغربية 100%</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-morocco-red via-morocco-green to-morocco-gold bg-clip-text text-transparent" data-i18n="hero.title1">
                  تنقل بسهولة
                </span>
                <br />
                <span className="text-gray-900" data-i18n="hero.title2">في جميع أنحاء المغرب</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed" data-i18n="hero.description">
                احجز سيارتك، اطلب طعامك، أو أرسل طردك بضغطة زر واحدة. خدمة سريعة وآمنة ومتاحة على مدار الساعة.
              </p>
              
              <div className="flex gap-4 justify-end mb-8">
                <Link to="/ride" className="group px-8 py-4 bg-gradient-to-r from-morocco-red to-morocco-green text-white font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <span className="flex items-center gap-2">
                    <span data-i18n="hero.bookNow">احجز الآن</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                  </span>
                </Link>
                <button className="px-8 py-4 bg-white border-2 border-morocco-red text-morocco-red font-bold rounded-xl hover:bg-morocco-red hover:text-white transition-all duration-300" data-i18n="hero.watchVideo">
                  شاهد الفيديو
                </button>
              </div>
              
              <div className="flex gap-8 justify-end">
                <div className="text-center">
                  <div className="text-3xl font-bold text-morocco-red">+50K</div>
                  <div className="text-sm text-gray-600" data-i18n="hero.stat1">سائق نشط</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-morocco-green">+1M</div>
                  <div className="text-sm text-gray-600" data-i18n="hero.stat2">رحلة يومية</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-morocco-gold">4.8★</div>
                  <div className="text-sm text-gray-600" data-i18n="hero.stat3">تقييم العملاء</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative z-10">
                <img src="https://images.pexels.com/photos/17872110/pexels-photo-17872110.jpeg" alt="Moroccan city street" className="rounded-3xl shadow-2xl w-full h-[600px] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-morocco-red/30 to-transparent rounded-3xl z-10"></div>
              </div>
              
              {/* Floating Cards */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 animate-float z-20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-morocco-green/10 rounded-full flex items-center justify-center">
                    {/* Note: Les images doivent être dans public/images/icons/ pour être accessibles */}
                    <div className="w-6 h-6 bg-morocco-green rounded"></div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600" data-i18n="hero.nextRide">رحلتك القادمة</div>
                    <div className="font-bold text-morocco-green" data-i18n="hero.nextRideTime">5 دقائق</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-6 -left-6 bg-white rounded-2xl shadow-xl p-6 animate-float-delayed z-20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-morocco-red/10 rounded-full flex items-center justify-center">
                    {/* Note: Les images doivent être dans public/images/icons/ pour être accessibles */}
                    <div className="w-6 h-6 bg-morocco-red rounded"></div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600" data-i18n="hero.foodDelivery">توصيل الطعام</div>
                    <div className="font-bold text-morocco-red" data-i18n="hero.foodDeliveryTime">30 دقيقة</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-gradient-to-b from-white to-morocco-sand/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-morocco-red to-morocco-green bg-clip-text text-transparent" data-i18n="services.title">خدماتنا</span>
            </h2>
            <p className="text-xl text-gray-600" data-i18n="services.subtitle">كل ما تحتاجه في تطبيق واحد</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Ride Service */}
            <div className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-morocco-red/10 to-transparent rounded-full -mr-16 -mt-16"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-morocco-red to-morocco-red/70 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {/* Note: Les images doivent être dans public/images/icons/ pour être accessibles */}
                  <div className="w-8 h-8 bg-white/20 rounded"></div>
                </div>
                
                <h3 className="text-2xl font-bold mb-3 text-right" data-i18n="services.ride.title">خدمة التوصيل</h3>
                <p className="text-gray-600 mb-6 text-right leading-relaxed" data-i18n="services.ride.description">
                  احجز سيارة خاصة أو مشتركة للوصول إلى وجهتك بأمان وراحة. أسعار تنافسية وسائقون محترفون.
                </p>
                
                <div className="flex justify-end">
                  <Link to="/ride" className="text-morocco-red font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                    <span data-i18n="services.ride.cta">احجز الآن</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Food Delivery */}
            <div className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-morocco-green/10 to-transparent rounded-full -mr-16 -mt-16"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-morocco-green to-morocco-green/70 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {/* Note: Les images doivent être dans public/images/icons/ pour être accessibles */}
                  <div className="w-8 h-8 bg-white/20 rounded"></div>
                </div>
                
                <h3 className="text-2xl font-bold mb-3 text-right" data-i18n="services.food.title">توصيل الطعام</h3>
                <p className="text-gray-600 mb-6 text-right leading-relaxed" data-i18n="services.food.description">
                  اطلب من مطاعمك المفضلة واستمتع بوجبتك في المنزل. توصيل سريع وطعام طازج دائماً.
                </p>
                
                <div className="flex justify-end">
                  <button className="text-morocco-green font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                    <span data-i18n="services.food.cta">اطلب الآن</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Package Delivery */}
            <div className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-morocco-gold/10 to-transparent rounded-full -mr-16 -mt-16"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-morocco-gold to-morocco-gold/70 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {/* Note: Les images doivent être dans public/images/icons/ pour être accessibles */}
                  <div className="w-8 h-8 bg-white/20 rounded"></div>
                </div>
                
                <h3 className="text-2xl font-bold mb-3 text-right" data-i18n="services.package.title">توصيل الطرود</h3>
                <p className="text-gray-600 mb-6 text-right leading-relaxed" data-i18n="services.package.description">
                  أرسل واستقبل طرودك بسرعة وأمان. خدمة توصيل موثوقة لجميع احتياجاتك.
                </p>
                
                <div className="flex justify-end">
                  <button className="text-morocco-gold font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                    <span data-i18n="services.package.cta">أرسل طرد</span>
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
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" data-i18n="howItWorks.title">كيف يعمل التطبيق؟</h2>
            <p className="text-xl text-gray-600" data-i18n="howItWorks.subtitle">ثلاث خطوات بسيطة فقط</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-1/4 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-morocco-red via-morocco-green to-morocco-gold"></div>
            
            {/* Step 1 */}
            <div className="text-center relative">
              <div className="w-20 h-20 bg-gradient-to-br from-morocco-red to-morocco-red/70 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-2xl font-bold mb-3" data-i18n="howItWorks.step1.title">اختر الخدمة</h3>
              <p className="text-gray-600 leading-relaxed" data-i18n="howItWorks.step1.description">
                حدد نوع الخدمة التي تحتاجها: توصيل، طعام، أو طرد
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="text-center relative">
              <div className="w-20 h-20 bg-gradient-to-br from-morocco-green to-morocco-green/70 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-bold mb-3" data-i18n="howItWorks.step2.title">احجز بسهولة</h3>
              <p className="text-gray-600 leading-relaxed" data-i18n="howItWorks.step2.description">
                أدخل تفاصيل طلبك واختر السائق أو المطعم المناسب
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="text-center relative">
              <div className="w-20 h-20 bg-gradient-to-br from-morocco-gold to-morocco-gold/70 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-bold mb-3" data-i18n="howItWorks.step3.title">تتبع وصول طلبك</h3>
              <p className="text-gray-600 leading-relaxed" data-i18n="howItWorks.step3.description">
                راقب موقع السائق في الوقت الفعلي حتى الوصول
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="safety" className="py-24 bg-gradient-to-b from-morocco-sand/20 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" data-i18n="features.title">لماذا Grab Morocco؟</h2>
            <p className="text-xl text-gray-600" data-i18n="features.subtitle">ميزات تجعلنا الخيار الأفضل</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Safety */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-right">
              <div className="w-14 h-14 bg-morocco-red/10 rounded-xl flex items-center justify-center mb-4 mr-auto">
                {/* Note: Les images doivent être dans public/images/icons/ pour être accessibles */}
                <div className="w-7 h-7 bg-morocco-red/20 rounded"></div>
              </div>
              <h3 className="text-xl font-bold mb-2" data-i18n="features.safety.title">أمان مضمون</h3>
              <p className="text-gray-600" data-i18n="features.safety.description">سائقون موثوقون ومراقبة على مدار الساعة</p>
            </div>
            
            {/* Payment */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-right">
              <div className="w-14 h-14 bg-morocco-green/10 rounded-xl flex items-center justify-center mb-4 mr-auto">
                {/* Note: Les images doivent être dans public/images/icons/ pour être accessibles */}
                <div className="w-7 h-7 bg-morocco-green/20 rounded"></div>
              </div>
              <h3 className="text-xl font-bold mb-2" data-i18n="features.payment.title">دفع مرن</h3>
              <p className="text-gray-600" data-i18n="features.payment.description">نقداً أو بطاقة أو محفظة إلكترونية</p>
            </div>
            
            {/* Tracking */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-right">
              <div className="w-14 h-14 bg-morocco-gold/10 rounded-xl flex items-center justify-center mb-4 mr-auto">
                {/* Note: Les images doivent être dans public/images/icons/ pour être accessibles */}
                <div className="w-7 h-7 bg-morocco-gold/20 rounded"></div>
              </div>
              <h3 className="text-xl font-bold mb-2" data-i18n="features.tracking.title">تتبع فوري</h3>
              <p className="text-gray-600" data-i18n="features.tracking.description">راقب موقع طلبك لحظة بلحظة</p>
            </div>
            
            {/* Fast */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-right">
              <div className="w-14 h-14 bg-morocco-red/10 rounded-xl flex items-center justify-center mb-4 mr-auto">
                {/* Note: Les images doivent être dans public/images/icons/ pour être accessibles */}
                <div className="w-7 h-7 bg-morocco-red/20 rounded"></div>
              </div>
              <h3 className="text-xl font-bold mb-2" data-i18n="features.fast.title">سرعة فائقة</h3>
              <p className="text-gray-600" data-i18n="features.fast.description">وصول سريع في أقل من 5 دقائق</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partner CTA Section */}
      <section id="partner" className="py-24 bg-gradient-to-r from-morocco-red to-morocco-green relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="moroccan-pattern-white"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-right text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-6" data-i18n="partner.title">انضم كسائق شريك</h2>
              <p className="text-xl mb-8 text-white/90 leading-relaxed" data-i18n="partner.description">
                احصل على دخل إضافي من خلال العمل معنا. جدول مرن، دعم متواصل، وعمولات تنافسية.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <div className="text-3xl font-bold mb-1">15,000 درهم+</div>
                  <div className="text-white/80" data-i18n="partner.income">متوسط الدخل الشهري</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-1">24/7</div>
                  <div className="text-white/80" data-i18n="partner.support">دعم فني</div>
                </div>
              </div>
              
              <button className="px-8 py-4 bg-white text-morocco-red font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all" data-i18n="partner.cta">
                سجل الآن كسائق
              </button>
            </div>
            
            <div className="relative">
              <img src="https://images.pexels.com/photos/5835588/pexels-photo-5835588.jpeg" alt="Happy driver" className="rounded-3xl shadow-2xl w-full h-[500px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-morocco-green/30 to-transparent rounded-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end mb-4">
                <span className="text-2xl font-bold">Grab Morocco</span>
                <div className="w-10 h-10 bg-gradient-to-br from-morocco-red to-morocco-green rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">G</span>
                </div>
              </div>
              <p className="text-gray-400" data-i18n="footer.tagline">خدمة التوصيل الأولى في المغرب</p>
            </div>
            
            <div className="text-right">
              <h3 className="font-bold mb-4" data-i18n="footer.company">الشركة</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors" data-i18n="footer.company.about">من نحن</a></li>
                <li><a href="#" className="hover:text-white transition-colors" data-i18n="footer.company.careers">الوظائف</a></li>
                <li><a href="#" className="hover:text-white transition-colors" data-i18n="footer.company.news">الأخبار</a></li>
              </ul>
            </div>
            
            <div className="text-right">
              <h3 className="font-bold mb-4" data-i18n="footer.services">الخدمات</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/ride" className="hover:text-white transition-colors" data-i18n="footer.services.ride">التوصيل</Link></li>
                <li><a href="#" className="hover:text-white transition-colors" data-i18n="footer.services.food">الطعام</a></li>
                <li><a href="#" className="hover:text-white transition-colors" data-i18n="footer.services.package">الطرود</a></li>
              </ul>
            </div>
            
            <div className="text-right">
              <h3 className="font-bold mb-4" data-i18n="footer.support">الدعم</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors" data-i18n="footer.support.help">مركز المساعدة</a></li>
                <li><a href="#" className="hover:text-white transition-colors" data-i18n="footer.support.safety">الأمان</a></li>
                <li><a href="#" className="hover:text-white transition-colors" data-i18n="footer.support.contact">اتصل بنا</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm" data-i18n="footer.copyright">
              © 2025 Grab Morocco. جميع الحقوق محفوظة.
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
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
};

export default Home;





