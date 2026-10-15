/**
 * RotaMoto - Türkçe & İngilizce Uluslararasılaştırma (i18n) Modülü
 */
let currentLang = localStorage.getItem("rotamoto_lang") || "tr";

const TRANSLATIONS = {
    tr: {
        siteTitle: "RotaMoto | Motor Türüne Özel Rotalar & Mola Noktaları",
        navMotorTypes: "<i class=\"fa-solid fa-gauge-high\"></i> Motor Türleri",
        navMapLink: "<i class=\"fa-solid fa-earth-americas\"></i> Dünya Haritası",
        navRoutesLink: "<i class=\"fa-solid fa-compass\"></i> Rotalar & Mola Mekanları",
        navBuilderLink: "<i class=\"fa-solid fa-route\"></i> Rota Çiz",
        navRideScores: "<i class=\"fa-solid fa-trophy\"></i> Sürüş Puanları",
        createRouteBtn: "Rota Oluştur",
        
        heroBadge: "Motovlog & Instagram Favorisi Rotalar",
        heroTitleText: "Sürüş Tarzına Özel",
        heroTitleSpan: "Rotalar & Mola Durakları.",
        heroDesc: "<strong>Naked & Streetfighter</strong> motorcular için çevik Mudanya & Şile virajları, <strong>Cross / Enduro</strong> için dağ patikaları, <strong>Racing</strong> için pist tadında sıcak asfalt! Rota üzerindeki <strong>motorcu kahveleri ve pitstop mola yerleri</strong> ile sürüşün keyfini çıkarın.",
        heroBtnSelectBike: "Motor Türünü Seç",
        heroBtnMap: "Mola Mekanları Haritası",
        
        featuredRouteTitle: "Mudanya - Tirilye Virajları",
        featuredRouteDesc: "🛵 Naked Motor Özel Rotası • ☕ Tirilye Motorcu Kahvesi Mola Duraklı",
        featuredRouteBtn: "İncele",
        
        bikeTypeHeaderTitle: "Hangi Motosikleti Sürüyorsunuz?",
        bikeTypeHeaderDesc: "Sürüş tarzınıza ve motosiklet tipinize uygun özel zemin, viraj ve mola mekanlı rotaları süzün.",
        
        tabAllTitle: "Tüm Rotalar",
        tabAllDesc: "Tüm küresel & yerel rotalar",
        tabNakedTitle: "Naked / Streetfighter",
        tabNakedDesc: "Çevik virajlar, rüzgar korumasız orta mesafeler & motorcu kahveleri",
        tabRacingTitle: "Racing / Supersport",
        tabRacingDesc: "Pürüzsüz sıcak asfalt & keskin viraj serileri",
        tabCrossTitle: "Cross / Enduro",
        tabCrossDesc: "Dağlık arazi, toprak, mıcır & çamur patikaları",
        tabAdventureTitle: "Adventure / Touring",
        tabAdventureDesc: "Uzun yol, dağ geçitleri & kamp durakları",
        
        searchPlaceholder: "Naked, Cross, Racing, Şile, Mudanya, Stelvio veya mola yeri ara...",
        filterAllCountries: "Tüm Ülkeler",
        filterTurkey: "Türkiye 🇹🇷",
        filterItaly: "İtalya 🇮🇹",
        filterRomania: "Romanya 🇷🇴",
        filterUSA: "ABD 🇺🇸",
        filterMorocco: "Fas 🇲🇦",
        filterNorway: "Norveç 🇳🇴",
        filterAustria: "Avusturya 🇦🇹",
        
        filterAllDifficulties: "Tüm Zorluk Seviyeleri",
        filterBeginner: "Başlangıç Seviye",
        filterMedium: "Orta Seviye",
        filterMaster: "Usta Seviye",
        filterLegendary: "Efsane Seviye",
        
        mapSectionTitle: "Harita & Motorcu Mola Noktaları",
        mapSectionDesc: "Haritadaki ☕ (Çay/Kahve Molası), ⛽ (İkmal) ve 📸 (Seyir Noktası) pinlerine tıklayarak motorcu buluşma yerlerini görün.",
        
        routesSectionTitle: "Motor Türüne Özel Rotalar",
        activeRouteCountPrefix: "Motosiklet Rotası",
        
        builderSectionTitle: "Kendi Motosiklet Rotanı Çiz",
        builderSectionDesc: "Noktaları haritada işaretleyin, gerçek karayolu rotanız otomatik çizilsin ve GPX olarak indirin!",
        builderPanelTitle: "Rota Detayları",
        builderInputTitle: "Rota Başlığı",
        builderInputBikeType: "Motor Türü",
        builderInputRegion: "Ülke / Bölge",
        builderInputDifficulty: "Zorluk",
        builderPointTypeLabel: "İşaretlenecek Nokta Türü",
        pointTypeNormal: "📍 Normal Yol Durağı",
        pointTypeRest: "🛋️ Dinlenme & Mola Alanı",
        pointTypeCafe: "☕ Motorcu Kahvesi & Çay Molası",
        pointTypeGas: "⛽ Benzinlik & İkmal Noktası",
        pointTypeViewpoint: "📸 Manzara & Seyir Noktası",
        pointTypeCamp: "⛺ Kamp & Konaklama Yeri",
        builderDistLabel: "Tahmini Mesafe",
        builderStopsLabel: "Durak Sayısı",
        builderWaypointsHeader: "Eklenen Duraklar & Mola Yeri",
        builderRemoveLastBtn: "Son Noktayı Sil",
        builderNoStops: "Haritada tıklayarak durak ve mola alanları ekleyin.",
        builderResetBtn: "Sıfırla",
        builderSaveBtn: "Kaydet",
        builderCtaTitle: "Kendi Motosiklet Rotanı Çizmek İster misin?",
        builderCtaDesc: "Haritada harici tam ekran rota çiziciyi açın, duraklarınızı belirleyin, gerçek karayolu navigasyonuyla rotanızı oluşturup GPX olarak indirin!",
        builderCtaBtn: "Rota Çiziciyi Aç",
        
        footerDesc: "Naked, Cross, Racing ve Adventure motor sürücüleri için rota ve mola mekanı buluşma platformu.",
        footerQuickLinks: "Hızlı Bağlantılar",
        footerSafetyTitle: "Güvenli Sürüş",
        footerSafetyDesc: "Mola yerlerinde sohbet ederken kask ve eldivenlerinizi güvenli yere bırakın, sürüşte ekipmanlarınızı tam giyin.",
        footerRights: "© 2026 RotaMoto - Motor Türüne Özel Rota Platformu. Tüm hakları saklıdır.",
        
        modalDistance: "Toplam Mesafe",
        modalTurnCount: "Viraj Sayısı",
        modalTerrain: "Zemin Yapısı",
        modalPitstops: "Mola Mekanı",
        modalPitstopTitle: "☕ Motorcu Buluşma & Mola Noktaları (Pitstops)",
        modalElevationTitle: "Yükseklik & Rakım Değişim Profili",
        modalRecommendedBikes: "Önerilen Motor Tipleri:",
        modalFocusMapBtn: "Haritada Odaklan",
        modalDownloadGpxBtn: "GPX İndir",
        modalReviewsTitle: "Sürücü Rota Yorumları & 10 Yıldız Puanları",
        modalNoReviews: "Henüz yorum yapılmadı. İlk 10 yıldızlı sürüş tecrübeni sen paylaş!",
        rateRouteBtn: "⭐ Rotayı Değerlendir",
        ratePitstopBtn: "💬 Mekanı Değerlendir",
        addRouteReviewTitle: "✍️ Rotaya Yorum ve Yıldız Puanı Ekle",
        addPitstopReviewTitle: "✍️ Mola Mekanına Yorum ve Yıldız Puanı Ekle",
        userNameLabel: "Adınız / Sürücü Lakabınız",
        userNamePlaceholder: "Örn: Can 'Rider' Yılmaz",
        bikeModelLabel: "Motosikletiniz",
        bikeModelPlaceholder: "Örn: Yamaha MT-07, BMW R1250GS",
        starRatingLabel: "10 Yıldız Üzerinden Puanınız (Yarım Yıldız Verme İmkanı)",
        yourReviewLabel: "Sürüş veya Mekan Tecrübeniz",
        yourReviewPlaceholder: "Virajlar, asfalt tutuşu, manzara, çay/kahve kalitesi veya önerilerinizi yazın...",
        submitReviewBtn: "🚀 Yorum ve Puanı Gönder",
        reviewsCountText: "Değerlendirme",
        noPitstopReviews: "Bu mola yeri için henüz yorum yapılmadı. İlk 10 yıldızlı değerlendirmeyi sen yaz!",
        ratingSavedSuccess: "🎉 Yıldız puanınız ve yorumunuz başarıyla kaydedildi!",
        halfStarTip: "⭐ Yıldızların sol/sağ yarısına tıklayarak veya kaydırarak 0.5 (yarım yıldız) hassasiyetiyle puan verebilirsiniz."
    },
    en: {
        siteTitle: "RotaMoto | Motorcycle Routes & Biker Pitstops",
        navMotorTypes: "<i class=\"fa-solid fa-gauge-high\"></i> Bike Categories",
        navMapLink: "<i class=\"fa-solid fa-earth-americas\"></i> World Map",
        navRoutesLink: "<i class=\"fa-solid fa-compass\"></i> Routes & Pitstops",
        navBuilderLink: "<i class=\"fa-solid fa-route\"></i> Draw Route",
        navRideScores: "<i class=\"fa-solid fa-trophy\"></i> Ride Scores",
        createRouteBtn: "Create Route",
        
        heroBadge: "Motovlog & Instagram Trending Routes",
        heroTitleText: "Tailored to Your",
        heroTitleSpan: "Riding Style & Pitstops.",
        heroDesc: "Agile curves for <strong>Naked & Streetfighter</strong> riders; mountain trails for <strong>Cross / Enduro</strong>; smooth hot asphalt for <strong>Racing</strong>! Explore scenic routes with <strong>biker cafes and pitstop rest points</strong> along the way.",
        heroBtnSelectBike: "Select Bike Type",
        heroBtnMap: "Biker Pitstops Map",
        
        featuredRouteTitle: "Mudanya - Tirilye Twisties",
        featuredRouteDesc: "🛵 Dedicated Naked Route • ☕ Stops at Tirilye Biker Cafe",
        featuredRouteBtn: "View Details",
        
        bikeTypeHeaderTitle: "What Motorcycle Do You Ride?",
        bikeTypeHeaderDesc: "Filter routes featuring specific pavement types, twistiness rating, and biker pitstops tailored to your motorcycle category.",
        
        tabAllTitle: "All Routes",
        tabAllDesc: "All global & local motorcycle routes",
        tabNakedTitle: "Naked / Streetfighter",
        tabNakedDesc: "Agile twisties, wind-exposed medium distances & biker cafes",
        tabRacingTitle: "Racing / Supersport",
        tabRacingDesc: "Smooth hot asphalt & rapid cornering series",
        tabCrossTitle: "Cross / Enduro",
        tabCrossDesc: "Mountain terrain, dirt tracks, gravel & mud trails",
        tabAdventureTitle: "Adventure / Touring",
        tabAdventureDesc: "Long-distance tours, mountain passes & campsite stops",
        
        searchPlaceholder: "Search Naked, Cross, Racing, Stelvio, Turkey, or pitstop name...",
        filterAllCountries: "All Countries",
        filterTurkey: "Turkey 🇹🇷",
        filterItaly: "Italy 🇮🇹",
        filterRomania: "Romania 🇷🇴",
        filterUSA: "USA 🇺🇸",
        filterMorocco: "Morocco 🇲🇦",
        filterNorway: "Norway 🇳🇴",
        filterAustria: "Austria 🇦🇹",
        
        filterAllDifficulties: "All Difficulty Levels",
        filterBeginner: "Beginner Level",
        filterMedium: "Medium Level",
        filterMaster: "Master Rider",
        filterLegendary: "Legendary Level",
        
        mapSectionTitle: "Interactive Map & Biker Pitstops",
        mapSectionDesc: "Click on ☕ (Coffee/Tea Stop), ⛽ (Refuel) and 📸 (Scenic Viewpoint) markers on the map to explore biker meeting spots.",
        
        routesSectionTitle: "Routes Tailored for Your Bike",
        activeRouteCountPrefix: "Motorcycle Routes",
        
        builderSectionTitle: "Draw Your Custom Motorcycle Route",
        builderSectionDesc: "Click waypoints on the map, real road navigation will calculate your route along actual roads, export as GPX!",
        builderPanelTitle: "Route Parameters",
        builderInputTitle: "Route Name",
        builderInputBikeType: "Bike Category",
        builderInputRegion: "Country / Region",
        builderInputDifficulty: "Difficulty",
        builderPointTypeLabel: "Point & Pitstop Type",
        pointTypeNormal: "📍 Normal Road Stop",
        pointTypeRest: "🛋️ Rest & Relax Area",
        pointTypeCafe: "☕ Biker Cafe & Tea Stop",
        pointTypeGas: "⛽ Gas & Refuel Station",
        pointTypeViewpoint: "📸 Scenic Viewpoint",
        pointTypeCamp: "⛺ Campsite & Stay",
        builderDistLabel: "Est. Distance",
        builderStopsLabel: "Waypoints",
        builderWaypointsHeader: "Added Stops & Pitstops",
        builderRemoveLastBtn: "Remove Last Stop",
        builderNoStops: "Click on map to add waypoints & rest areas.",
        builderResetBtn: "Reset",
        builderSaveBtn: "Save Route",
        builderCtaTitle: "Want to Draw Your Own Motorcycle Route?",
        builderCtaDesc: "Open the dedicated full-screen route builder, place waypoints on the map, generate your route with real road navigation, and export as GPX!",
        builderCtaBtn: "Open Route Builder",
        
        footerDesc: "The ultimate community platform for Naked, Cross, Racing, and Adventure motorcycle riders to discover scenic routes and pitstops.",
        footerQuickLinks: "Quick Links",
        footerSafetyTitle: "Ride Safe",
        footerSafetyDesc: "Keep your gear secure when taking coffee breaks and always wear full protective gear while riding.",
        footerRights: "© 2026 RotaMoto - Motorcycle Route Platform. All rights reserved.",
        
        modalDistance: "Total Distance",
        modalTurnCount: "Turn Count",
        modalTerrain: "Terrain Type",
        modalPitstops: "Biker Pitstops",
        modalPitstopTitle: "☕ Biker Hotspots & Pitstops",
        modalElevationTitle: "Elevation & Altitude Profile",
        modalRecommendedBikes: "Recommended Bike Types:",
        modalFocusMapBtn: "Focus on Map",
        modalDownloadGpxBtn: "Download GPX",
        modalReviewsTitle: "Rider Route Reviews & 10-Star Ratings",
        modalNoReviews: "No reviews yet. Share your first experience with a 10-star rating!",
        rateRouteBtn: "⭐ Rate Route",
        ratePitstopBtn: "💬 Rate Pitstop",
        addRouteReviewTitle: "✍️ Add Route Review & Star Rating",
        addPitstopReviewTitle: "✍️ Add Pitstop Review & Star Rating",
        userNameLabel: "Your Name / Rider Handle",
        userNamePlaceholder: "e.g., John 'Rider' Doe",
        bikeModelLabel: "Your Bike",
        bikeModelPlaceholder: "e.g., Yamaha MT-07, BMW R1250GS",
        starRatingLabel: "Rating out of 10 Stars (Half-Star Precision)",
        yourReviewLabel: "Your Ride or Pitstop Experience",
        yourReviewPlaceholder: "Write about twisties, road grip, scenery, coffee quality, or recommendations...",
        submitReviewBtn: "🚀 Submit Review & Rating",
        reviewsCountText: "Reviews",
        noPitstopReviews: "No reviews for this pitstop yet. Be the first to give a 10-star rating!",
        ratingSavedSuccess: "🎉 Your review and star rating were added successfully!",
        halfStarTip: "⭐ Click or slide on stars with 0.5 (half-star) precision."
    }
};

let currentLangCode = localStorage.getItem("rotamoto_lang_code") || (currentLang === "tr" ? "TR" : "EN");

function t(key) {
    const dict = TRANSLATIONS[currentLang] || TRANSLATIONS['en'] || TRANSLATIONS['tr'];
    return dict[key] || TRANSLATIONS['tr'][key] || key;
}

function toggleLangDropdown(event) {
    if (event) event.stopPropagation();
    const wrapper = document.getElementById("langDropdownWrapper");
    if (wrapper) {
        wrapper.classList.toggle("open");
    }
}

function selectLanguageOption(langKey, langCode, label) {
    currentLang = langKey;
    currentLangCode = langCode;
    localStorage.setItem("rotamoto_lang", currentLang);
    localStorage.setItem("rotamoto_lang_code", currentLangCode);

    const wrapper = document.getElementById("langDropdownWrapper");
    if (wrapper) wrapper.classList.remove("open");

    updateLanguageUI();

    if (typeof refreshAppRoutes === "function") {
        refreshAppRoutes();
    }
}

document.addEventListener("click", function (e) {
    const wrapper = document.getElementById("langDropdownWrapper");
    if (wrapper && !wrapper.contains(e.target)) {
        wrapper.classList.remove("open");
    }
});

function setLanguage(lang) {
    selectLanguageOption(lang, lang.toUpperCase(), lang === 'tr' ? 'Türkçe' : 'English');
}

function updateLanguageUI() {
    const currentEl = document.getElementById("langDropdownCurrent");
    if (currentEl) {
        currentEl.textContent = currentLangCode || (currentLang === 'tr' ? 'TR' : 'EN');
    }

    document.querySelectorAll(".lang-dropdown-item").forEach(item => {
        const itemLang = item.getAttribute("data-lang");
        if (itemLang === currentLang) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });

    const activeDict = TRANSLATIONS[currentLang] || TRANSLATIONS['en'] || TRANSLATIONS['tr'];

    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (key && activeDict[key]) {
            el.innerHTML = activeDict[key];
        }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const key = el.getAttribute("data-i18n-placeholder");
        if (key && activeDict[key]) {
            el.placeholder = activeDict[key];
        }
    });

    document.title = t("siteTitle");
}

document.addEventListener("DOMContentLoaded", function () {
    updateLanguageUI();
});
