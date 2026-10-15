/**
 * RotaMoto - Küresel & Yerel Motosiklet Rotaları Veri Deposu (TR/EN Uyumlu)
 */
const MOCK_ROUTES = [
    // 🛵 NAKED / STREETFIGHTER ROTASI 1 (BURSA MUDANYA - TİRİLYE - GÖLYAZI)
    {
        id: "mudanya-tirilye-naked",
        title: "Bursa Mudanya - Tirilye - Gölyazı Virajları",
        titleEn: "Bursa Mudanya - Tirilye - Gölyazı Twisties",
        tagline: "Naked Motorcular İçin Çevik Virajlar ve Zeytin Kokulu Kıyı Yolu",
        taglineEn: "Agile curves and coastal roads for Naked motorcycle riders",
        region: "Türkiye 🇹🇷",
        country: "Türkiye 🇹🇷",
        countryEn: "Turkey 🇹🇷",
        bikeCategory: "touring-chopper",
        bikeCategoryName: "🛵 Naked / Streetfighter",
        category: "bol-viraj",
        difficulty: "Orta",
        difficultyEn: "Medium",
        socialTag: "🎥 YouTube Motovlog İkonik",
        curvatureRating: 8.8,
        turnCount: 112,
        terrainType: "%96 Temiz Pürüzsüz Asfalt",
        terrainTypeEn: "%96 Smooth Pavement Asphalt",
        asphaltQuality: "%96 Asfalt",
        distanceKm: 58.5,
        estimatedDuration: "1 saat 10 dk",
        elevationMin: 5,
        elevationMax: 240,
        elevationGain: 480,
        startPoint: "Mudanya Marina",
        endPoint: "Gölyazı Köyü",
        recommendedBikes: ["Naked", "Streetfighter", "Roadster"],
        image: "assets/naked_bike.jpg",
        gallery: ["assets/naked_bike.jpg", "assets/biker_pitstop.jpg"],
        cautionNote: "⚠️ Tirilye sokaklarında arnavut kaldırımı taşlara ve dar virajlara dikkat edin.",
        cautionNoteEn: "⚠️ Watch out for cobblestone sections and narrow corners in Tirilye.",
        weather: { temp: "24°C", condition: "Güneşli", wind: "12 km/h B" },
        coordinates: [
            [40.3754, 28.8823],
            [40.3912, 28.7954],
            [40.1712, 28.6745]
        ],
        pitstops: [
            {
                title: "Tirilye Motorcu Kahvesi & Çay Terası",
                titleEn: "Tirilye Biker Cafe & Tea Terrace",
                category: "cafe",
                icon: "☕",
                lat: 40.3912,
                lng: 28.7954,
                desc: "Motorcuların cuma-pazar buluşma noktası. Tarihi çınar altı çay ve deniz manzarası.",
                descEn: "Famous weekend rider pitstop. Enjoy tea under plane trees overlooking the sea.",
                image: "assets/biker_pitstop.jpg",
                reviews: [
                    {
                        id: "pr_m1",
                        userName: "Ahmet 'TR' Demir",
                        rating: 9.5,
                        date: "02 Eylül 2026",
                        comment: "Tarihi çınar altında çay içmek ve deniz manzarası harika. Motor park yeri geniş.",
                        commentEn: "Tea under plane trees with sea view is awesome. Great bike parking."
                    },
                    {
                        id: "pr_m2",
                        userName: "Selin Motovlog",
                        rating: 9.0,
                        date: "29 Ağustos 2026",
                        comment: "Motorcu dostu mekan, gözlemeler ve taze kahve mükemmel!",
                        commentEn: "Biker friendly cafe, delicious pancakes and coffee!"
                    }
                ]
            }
        ],
        waypoints: [
            { lat: 40.3754, lng: 28.8823, title: "Mudanya İskelesi", desc: "Başlangıç" },
            { lat: 40.3912, lng: 28.7954, title: "Tirilye Motorcu Kahvesi", desc: "Mola Durağı" },
            { lat: 40.1712, lng: 28.6745, title: "Gölyazı Köyü", desc: "Varış Noktası" }
        ],
        elevationProfile: [
            [0, 10], [58.5, 85]
        ],
        reviews: [
            {
                id: "r_n1",
                userName: "Uğur 'MT' Arslan",
                bike: "Yamaha MT-07",
                rating: 9.5,
                date: "04 Eylül 2026",
                comment: "Naked motorlar için tam bir terapi yolu. Rüzgar yormuyor, virajlar ritmik!",
                commentEn: "Therapeutic road for Naked bikes. Smooth twisties and great coffee!"
            }
        ]
    },

    // 🛵 NAKED MOTOR ROTASI 2 (İSTANBUL ŞİLE - AĞVA)
    {
        id: "sile-agva-naked",
        title: "İstanbul Şile - Ağva Kıyı Virajları",
        titleEn: "Istanbul Şile - Ağva Coastal Twisties",
        tagline: "Motovlogcuların ve Hafta Sonu Motor Gruplarının Favori Rotası",
        taglineEn: "Top choice for weekend motorcycle groups and motovloggers",
        region: "Türkiye 🇹🇷",
        country: "Türkiye 🇹🇷",
        countryEn: "Turkey 🇹🇷",
        bikeCategory: "touring-chopper",
        bikeCategoryName: "🛵 Naked / Streetfighter",
        category: "bol-viraj",
        difficulty: "Orta",
        difficultyEn: "Medium",
        socialTag: "🔥 Instagram Reels Trend Rota",
        curvatureRating: 9.0,
        turnCount: 132,
        terrainType: "%94 Pürüzsüz Asfalt",
        terrainTypeEn: "%94 Smooth Asphalt",
        asphaltQuality: "%94 Asfalt",
        distanceKm: 52.0,
        estimatedDuration: "1 saat 05 dk",
        elevationMin: 15,
        elevationMax: 210,
        elevationGain: 510,
        startPoint: "Şile Feneri",
        endPoint: "Ağva Nehir Kıyısı",
        recommendedBikes: ["Naked", "Streetfighter", "Cruiser"],
        image: "assets/naked_bike.jpg",
        gallery: ["assets/naked_bike.jpg", "assets/biker_pitstop.jpg"],
        cautionNote: "⚠️ Orman içi gölgeli virajlarda nem kalabilir.",
        cautionNoteEn: "⚠️ Shaded forest corners may retain morning moisture.",
        weather: { temp: "23°C", condition: "Açık", wind: "14 km/h" },
        coordinates: [
            [41.1754, 29.6123],
            [41.1543, 29.7234],
            [41.1391, 29.9891]
        ],
        pitstops: [
            {
                title: "Kabaköz Motorcuların Gözlemecisi",
                titleEn: "Kabaköz Biker Pancake House",
                category: "cafe",
                icon: "☕",
                lat: 41.1543,
                lng: 29.7234,
                desc: "Tüm motovlogcuların durup gözleme yediği meşhur mola yeri.",
                descEn: "Iconic pitstop stop for motovloggers serving hot Turkish flatbread.",
                image: "assets/biker_pitstop.jpg",
                reviews: [
                    {
                        id: "pr_s1",
                        userName: "Kaan Rider",
                        rating: 9.0,
                        date: "25 Ağustos 2026",
                        comment: "Sıcak gözleme ve demleme çay tam viraj arası molasına layık.",
                        commentEn: "Hot pancakes and brewed tea perfect for mid-ride rest."
                    }
                ]
            }
        ],
        waypoints: [
            { lat: 41.1754, lng: 29.6123, title: "Şile Çıkışı", desc: "Başlangıç" },
            { lat: 41.1543, lng: 29.7234, title: "Kabaköz Mola Yeri", desc: "Gözleme & Çay" },
            { lat: 41.1391, lng: 29.9891, title: "Ağva Nehir Kıyısı", desc: "Varış Noktası" }
        ],
        elevationProfile: [
            [0, 20], [52, 15]
        ],
        reviews: [
            {
                id: "r_n2",
                userName: "Volkan Motovlog",
                bike: "Kawasaki Z900",
                rating: 9.0,
                date: "28 Ağustos 2026",
                comment: "Şile yolunun viraj akışı Naked motor için mükemmel.",
                commentEn: "Flowing twisties along Şile road perfect for Naked bikes."
            }
        ]
    },

    // 🏎️ RACING / SUPERSPORT ROTASI 1 (TEKİRDAĞ UÇMAKDERE)
    {
        id: "ucmakdere-virajlari",
        title: "Tekirdağ Uçmakdere Viraj Rotası",
        titleEn: "Tekirdağ Uçmakdere Coastal Curves",
        tagline: "Deniz Manzaralı Pürüzsüz Sıcak Asfaltlı Viraj Fırtınası",
        taglineEn: "Iconic coastal curve series with high asphalt grip",
        region: "Türkiye 🇹🇷",
        country: "Türkiye 🇹🇷",
        countryEn: "Turkey 🇹🇷",
        bikeCategory: "racing",
        bikeCategoryName: "🏎️ Racing / Supersport",
        category: "bol-viraj",
        difficulty: "Usta",
        difficultyEn: "Master",
        socialTag: "🎥 YouTube Motovlog İkonik",
        curvatureRating: 9.6,
        turnCount: 148,
        terrainType: "%95 Sıcak Asfalt (Yüksek Yol Tutuşu)",
        terrainTypeEn: "%95 High-Grip Hot Asphalt",
        asphaltQuality: "%95 Asfalt",
        distanceKm: 46.5,
        estimatedDuration: "1 saat 15 dk",
        elevationMin: 5,
        elevationMax: 340,
        elevationGain: 680,
        startPoint: "Kumbağ",
        endPoint: "Şarköy",
        recommendedBikes: ["Racing / Supersport", "Naked", "Sport Touring"],
        image: "assets/racing_bike.jpg",
        gallery: ["assets/racing_bike.jpg", "assets/biker_pitstop.jpg"],
        cautionNote: "⚠️ Deniz nemine bağlı viraj içlerinde zemin kontrolüne dikkat edin.",
        cautionNoteEn: "⚠️ Check corner entry grip due to sea moisture.",
        weather: { temp: "25°C", condition: "Açık", wind: "18 km/h" },
        coordinates: [
            [40.8647, 27.4608],
            [40.7989, 27.3612],
            [40.6154, 27.1154]
        ],
        pitstops: [
            {
                title: "Uçmakdere Paraşütü Tepesi Motorcu Çay Bahçesi",
                titleEn: "Uçmakdere Paragliding Hill Biker Rest",
                category: "cafe",
                icon: "☕",
                lat: 40.7989,
                lng: 27.3612,
                desc: "Marmara'nın en meşhur motorcu mola yeri.",
                descEn: "Most famous rider pitstop in Marmara region.",
                image: "assets/biker_pitstop.jpg",
                reviews: [
                    {
                        id: "pr_u1",
                        userName: "Kaan 'Apex'",
                        rating: 10.0,
                        date: "24 Ağustos 2026",
                        comment: "Marmara'nın 1 numaralı motorcu mola tepesi! Manzara 10/10.",
                        commentEn: "Number 1 biker pitstop hill! View is 10/10."
                    }
                ]
            }
        ],
        waypoints: [
            { lat: 40.8647, lng: 27.4608, title: "Kumbağ Sahil", desc: "Başlangıç" },
            { lat: 40.7989, lng: 27.3612, title: "Uçmakdere Paraşüt Tepesi", desc: "Motorcu Mola Noktası" },
            { lat: 40.6154, lng: 27.1154, title: "Şarköy Limanı", desc: "Varış Noktası" }
        ],
        elevationProfile: [
            [0, 15], [46.5, 10]
        ],
        reviews: [
            {
                id: "r1",
                userName: "Kaan 'Apex' Yılmaz",
                bike: "Yamaha R1M",
                rating: 9.8,
                date: "24 Ağustos 2026",
                comment: "Viraj yatış açısı arayan racing motorcular için biçilmiş kaftan.",
                commentEn: "Perfect lean-angle corners for supersport riders."
            }
        ]
    },

    // 🏎️ RACING / SUPERSPORT ROTASI 2 (STELVIO PASS - İTALYA)
    {
        id: "stelvio-pass-italy",
        title: "Stelvio Pass (Passo dello Stelvio) - İtalya",
        titleEn: "Stelvio Pass (Passo dello Stelvio) - Italy",
        tagline: "48 Saç Tokası Virajlı Alplerin 2757m Zirve Rotası",
        taglineEn: "Legendary Alpine 2757m summit road with 48 hairpins",
        region: "İtalya 🇮🇹",
        country: "İtalya 🇮🇹",
        countryEn: "Italy 🇮🇹",
        bikeCategory: "racing",
        bikeCategoryName: "🏎️ Racing / Supersport",
        category: "bol-viraj",
        difficulty: "Efsane",
        difficultyEn: "Legendary",
        socialTag: "🔥 Instagram Reels Trend Rota",
        curvatureRating: 10.0,
        turnCount: 48,
        terrainType: "%100 Pürüzsüz İtalyan Dağ Asfaltı",
        terrainTypeEn: "%100 Smooth Italian Mountain Asphalt",
        asphaltQuality: "%100 Asfalt",
        distanceKm: 47.0,
        estimatedDuration: "1 saat 10 dk",
        elevationMin: 950,
        elevationMax: 2757,
        elevationGain: 1807,
        startPoint: "Bormio",
        endPoint: "Prato allo Stelvio",
        recommendedBikes: ["Racing / Supersport", "Supermoto", "Naked"],
        image: "assets/racing_bike.jpg",
        gallery: ["assets/racing_bike.jpg", "assets/biker_pitstop.jpg"],
        cautionNote: "⚠️ 48 keskin saç tokası virajı zihinsel ve fiziksel odaklanma gerektirir.",
        cautionNoteEn: "⚠️ 48 tight hairpin bends require constant clutch and brake control.",
        weather: { temp: "12°C", condition: "Alp Havası", wind: "15 km/h" },
        coordinates: [
            [46.4689, 10.3712],
            [46.5289, 10.4567],
            [46.6189, 10.5912]
        ],
        pitstops: [
            {
                title: "Passo dello Stelvio Biker Hut (2757m)",
                titleEn: "Passo dello Stelvio Biker Hut (2757m)",
                category: "cafe",
                icon: "☕",
                lat: 46.5289,
                lng: 10.4567,
                desc: "Alplerin zirvesinde espresso ve sosisli mola durağı.",
                descEn: "High alpine summit coffee and bratwurst stop.",
                image: "assets/biker_pitstop.jpg",
                reviews: [
                    {
                        id: "pr_st1",
                        userName: "Marco R.",
                        rating: 10.0,
                        date: "01 Eylül 2026",
                        comment: "High altitude espresso at 2757m after 48 hairpins is unbeatable!",
                        commentEn: "High altitude espresso at 2757m after 48 hairpins is unbeatable!"
                    }
                ]
            }
        ],
        waypoints: [
            { lat: 46.4689, lng: 10.3712, title: "Bormio", desc: "Başlangıç" },
            { lat: 46.5289, lng: 10.4567, title: "Stelvio Zirvesi (2757m)", desc: "Mola Yeri" },
            { lat: 46.6189, lng: 10.5912, title: "Prato allo Stelvio", desc: "Varış Noktası" }
        ],
        elevationProfile: [
            [0, 950], [47, 910]
        ],
        reviews: [
            {
                id: "gr1",
                userName: "Marco R.",
                bike: "Ducati Panigale V4",
                rating: 10.0,
                date: "01 Eylül 2026",
                comment: "Her supersport sürücüsünün hayali!",
                commentEn: "A holy grail ride for every supersport rider!"
            }
        ]
    },

    // 🏔️ CROSS / ENDURO ROTASI (KAZDAĞLARI OFF-ROAD)
    {
        id: "kazdaglari-offroad-zirve",
        title: "Kazdağları Zirve & Sarıkız Off-Road Patikası",
        titleEn: "Kaz Mountains Summit & Sarıkız Off-Road Trail",
        tagline: "Toprak, Mıcır, Kayalık ve Derin Dağ Orman İçi Parkur",
        taglineEn: "Dirt, gravel, rocky trails, and deep forest off-road path",
        region: "Türkiye 🇹🇷",
        country: "Türkiye 🇹🇷",
        countryEn: "Turkey 🇹🇷",
        bikeCategory: "cross-enduro",
        bikeCategoryName: "🏔️ Cross / Enduro / Off-Road",
        category: "dag-gecidi",
        difficulty: "Efsane",
        difficultyEn: "Legendary",
        socialTag: "⭐ Motor Topluluğu Onaylı",
        curvatureRating: 9.9,
        turnCount: 210,
        terrainType: "%85 Toprak / Mıcır / Dik Kayalık Patika",
        terrainTypeEn: "%85 Dirt / Gravel / Steep Rocky Trail",
        asphaltQuality: "%15 Aşınmış Yol - %85 Arazi",
        distanceKm: 54.0,
        estimatedDuration: "2 saat 40 dk",
        elevationMin: 120,
        elevationMax: 1740,
        elevationGain: 1620,
        startPoint: "Zeytinli",
        endPoint: "Sarıkız Zirvesi (1740m)",
        recommendedBikes: ["Cross / Hard Enduro", "Soft Enduro"],
        image: "assets/cross_bike.jpg",
        gallery: ["assets/cross_bike.jpg", "assets/biker_pitstop.jpg"],
        cautionNote: "⚠️ Yol asfalt değildir! Dişli arazi lastiği şarttır.",
        cautionNoteEn: "⚠️ Road is not paved! Knobby off-road tires required.",
        weather: { temp: "16°C", condition: "Rüzgarlı", wind: "24 km/h" },
        coordinates: [
            [39.6012, 26.9245],
            [39.7012, 26.9834],
            [39.7154, 26.8654]
        ],
        pitstops: [
            {
                title: "Hanlar Mevkii Enduro Mola Kampı",
                titleEn: "Hanlar Spot Enduro Pitstop Camp",
                category: "cafe",
                icon: "☕",
                lat: 39.7012,
                lng: 26.9834,
                desc: "Çamur geçişi öncesi dağ çayı.",
                descEn: "Mountain tea and rest stop before deep mud sections.",
                image: "assets/biker_pitstop.jpg",
                reviews: [
                    {
                        id: "pr_k1",
                        userName: "Tarkan 'Dirt'",
                        rating: 9.5,
                        date: "12 Ağustos 2026",
                        comment: "Endurocular için harika mola tesisi. Sıcak çay ve soba ortamı.",
                        commentEn: "Great pitstop camp for Enduro riders. Hot tea and cozy fireplace."
                    }
                ]
            }
        ],
        waypoints: [
            { lat: 39.6012, lng: 26.9245, title: "Zeytinli Çıkışı", desc: "Başlangıç" },
            { lat: 39.7012, lng: 26.9834, title: "Hanlar Mola Kampı", desc: "Enduro Pitstop" },
            { lat: 39.7154, lng: 26.8654, title: "Sarıkız Zirvesi (1740m)", desc: "Varış Noktası" }
        ],
        elevationProfile: [
            [0, 120], [54, 1740]
        ],
        reviews: [
            {
                id: "r3",
                userName: "Tarkan 'Dirt' Eren",
                bike: "KTM 300 EXC",
                rating: 9.6,
                date: "12 Ağustos 2026",
                comment: "Cross ve Endurocular için cennet!",
                commentEn: "Paradise for Cross & Enduro riders!"
            }
        ]
    },

    // 🧳 ADVENTURE / TOURING ROTASI (TOROS DAĞLARI)
    {
        id: "toroslar-adventure-rotasi",
        title: "Antalya Toros Dağları & Köprülü Kanyon Rotası",
        titleEn: "Antalya Taurus Mountains & Köprülü Canyon Tour",
        tagline: "Uzun Yol, Kanyon Geçitleri, Kamp Alanları & Virajlı Dağ Yolu",
        taglineEn: "Long-distance tour, canyon passes, camping & mountain twisties",
        region: "Türkiye 🇹🇷",
        country: "Türkiye 🇹🇷",
        countryEn: "Turkey 🇹🇷",
        bikeCategory: "adventure",
        bikeCategoryName: "🧳 Adventure / Touring",
        category: "dag-gecidi",
        difficulty: "Orta",
        difficultyEn: "Medium",
        socialTag: "⭐ Motor Topluluğu Onaylı",
        curvatureRating: 9.2,
        turnCount: 154,
        terrainType: "%80 Asfalt - %20 Stabilize Dağ Yolu",
        terrainTypeEn: "%80 Paved - %20 Unpaved Mountain Road",
        asphaltQuality: "%80 Asfalt",
        distanceKm: 185.0,
        estimatedDuration: "3 saat 30 dk",
        elevationMin: 40,
        elevationMax: 1450,
        elevationGain: 1410,
        startPoint: "Manavgat",
        endPoint: "Eğirdir Gölü",
        recommendedBikes: ["Adventure Touring", "Dual-Sport"],
        image: "assets/adventure_bike.jpg",
        gallery: ["assets/adventure_bike.jpg", "assets/biker_pitstop.jpg"],
        cautionNote: "⚠️ Yan çantalarınız sağlam kilitli olmalı.",
        cautionNoteEn: "⚠️ Secure your luggage panniers tight.",
        weather: { temp: "27°C", condition: "Güneşli", wind: "10 km/h" },
        coordinates: [
            [36.7854, 31.4412],
            [37.0543, 31.2456],
            [37.8712, 30.8543]
        ],
        pitstops: [
            {
                title: "Köprülü Kanyon Biker Camp & Restoran",
                titleEn: "Köprülü Canyon Biker Camp & Dining",
                category: "cafe",
                icon: "☕",
                lat: 37.0543,
                lng: 31.2456,
                desc: "Kanyon kenarında taze alabalık ve çay.",
                descEn: "Fresh trout and tea right by the canyon stream.",
                image: "assets/biker_pitstop.jpg",
                reviews: [
                    {
                        id: "pr_a1",
                        userName: "Erhan 'GS'",
                        rating: 9.5,
                        date: "02 Eylül 2026",
                        comment: "Nehir kenarında taze alabalık ve dinlenme harika.",
                        commentEn: "Fresh trout by the river and great relaxation."
                    }
                ]
            }
        ],
        waypoints: [
            { lat: 36.7854, lng: 31.4412, title: "Manavgat Çıkışı", desc: "Başlangıç" },
            { lat: 37.0543, lng: 31.2456, title: "Köprülü Kanyon Pitstop", desc: "Alabalık & Çay" },
            { lat: 37.8712, lng: 30.8543, title: "Eğirdir Gölü Sahili", desc: "Varış Noktası" }
        ],
        elevationProfile: [
            [0, 40], [185, 920]
        ],
        reviews: [
            {
                id: "r_adv1",
                userName: "Erhan 'GS' Yılmaz",
                bike: "BMW R1250GS",
                rating: 9.5,
                date: "02 Eylül 2026",
                comment: "2 gün kafa dinlemek için harika bir Adventure rotası.",
                commentEn: "Great 2-day Adventure tour to relax and enjoy mountain views."
            }
        ]
    }
];

// Yıldız ve Değerlendirme Yardımcı Fonksiyonları
function getRouteAverageRating(route) {
    if (!route || !route.reviews || route.reviews.length === 0) {
        return route && route.curvatureRating ? route.curvatureRating : 9.0;
    }
    const sum = route.reviews.reduce((acc, rev) => acc + (parseFloat(rev.rating) || 0), 0);
    return Math.round((sum / route.reviews.length) * 10) / 10;
}

function getPitstopAverageRating(pitstop) {
    if (!pitstop || !pitstop.reviews || pitstop.reviews.length === 0) {
        return 9.5;
    }
    const sum = pitstop.reviews.reduce((acc, rev) => acc + (parseFloat(rev.rating) || 0), 0);
    return Math.round((sum / pitstop.reviews.length) * 10) / 10;
}

function getStarRatingHtml(rating, maxStars = 10) {
    const score = Math.max(0, Math.min(maxStars, parseFloat(rating) || 0));
    let html = `<div class="star-rating-display" title="${score.toFixed(1)} / ${maxStars}">`;
    
    for (let i = 1; i <= maxStars; i++) {
        if (score >= i) {
            html += '<i class="fa-solid fa-star text-gold"></i>';
        } else if (score >= i - 0.5) {
            html += '<i class="fa-solid fa-star-half-stroke text-gold"></i>';
        } else {
            html += '<i class="fa-regular fa-star text-dim"></i>';
        }
    }
    
    html += ` <span class="rating-num-badge"><strong>${score.toFixed(1)}</strong>/${maxStars}</span></div>`;
    return html;
}

function saveRouteReview(routeId, reviewObj) {
    const stored = localStorage.getItem("rotamoto_route_reviews");
    let map = stored ? JSON.parse(stored) : {};
    if (!map[routeId]) {
        map[routeId] = [];
    }
    map[routeId].unshift(reviewObj);
    localStorage.setItem("rotamoto_route_reviews", JSON.stringify(map));
}

function savePitstopReview(routeId, pitstopIndex, reviewObj) {
    const stored = localStorage.getItem("rotamoto_pitstop_reviews");
    let map = stored ? JSON.parse(stored) : {};
    const key = `${routeId}_pit_${pitstopIndex}`;
    if (!map[key]) {
        map[key] = [];
    }
    map[key].unshift(reviewObj);
    localStorage.setItem("rotamoto_pitstop_reviews", JSON.stringify(map));
}

function deleteRouteReview(routeId, reviewId) {
    const isEn = (typeof currentLang !== "undefined" && currentLang === "en");
    const confirmMsg = isEn 
        ? "Are you sure you want to delete this review?" 
        : "Bu yorumu ve değerlendirmeyi silmek istediğinizden emin misiniz?";

    if (!confirm(confirmMsg)) return;

    // 1. Silinen yorum ID'lerine ekle
    const deletedStored = localStorage.getItem("rotamoto_deleted_review_ids");
    let deletedIds = deletedStored ? JSON.parse(deletedStored) : [];
    if (!deletedIds.includes(reviewId)) {
        deletedIds.push(reviewId);
        localStorage.setItem("rotamoto_deleted_review_ids", JSON.stringify(deletedIds));
    }

    // 2. rotamoto_route_reviews içinden temizle
    const routeReviewsStored = localStorage.getItem("rotamoto_route_reviews");
    if (routeReviewsStored) {
        try {
            let map = JSON.parse(routeReviewsStored);
            if (map[routeId]) {
                map[routeId] = map[routeId].filter(r => r.id !== reviewId);
                localStorage.setItem("rotamoto_route_reviews", JSON.stringify(map));
            }
        } catch (e) {
            console.error("Error deleting route review from storage:", e);
        }
    }

    // 3. UI yenile — her zaman detay modalını aç
    if (typeof openRouteModal === "function") {
        openRouteModal(routeId);
    }
    if (typeof refreshAppRoutes === "function") {
        refreshAppRoutes();
    }
}

function deletePitstopReview(routeId, pitstopIndex, reviewId) {
    const isEn = (typeof currentLang !== "undefined" && currentLang === "en");
    const confirmMsg = isEn 
        ? "Are you sure you want to delete this pitstop review?" 
        : "Bu mola yeri yorumunu ve değerlendirmesini silmek istediğinizden emin misiniz?";

    if (!confirm(confirmMsg)) return;

    // 1. Silinen yorum ID'lerine ekle
    const deletedStored = localStorage.getItem("rotamoto_deleted_review_ids");
    let deletedIds = deletedStored ? JSON.parse(deletedStored) : [];
    if (!deletedIds.includes(reviewId)) {
        deletedIds.push(reviewId);
        localStorage.setItem("rotamoto_deleted_review_ids", JSON.stringify(deletedIds));
    }

    // 2. rotamoto_pitstop_reviews içinden temizle
    const pitReviewsStored = localStorage.getItem("rotamoto_pitstop_reviews");
    if (pitReviewsStored) {
        try {
            let map = JSON.parse(pitReviewsStored);
            const pitKey = `${routeId}_pit_${pitstopIndex}`;
            if (map[pitKey]) {
                map[pitKey] = map[pitKey].filter(r => r.id !== reviewId);
                localStorage.setItem("rotamoto_pitstop_reviews", JSON.stringify(map));
            }
        } catch (e) {
            console.error("Error deleting pitstop review from storage:", e);
        }
    }

    // 3. UI yenile
    if (typeof openRouteModal === "function") {
        openRouteModal(routeId);
    }
    if (typeof refreshAppRoutes === "function") {
        refreshAppRoutes();
    }
}

function getStoredRoutes() {
    const deletedStored = localStorage.getItem("rotamoto_deleted_route_ids");
    let deletedIds = [];
    if (deletedStored) {
        try {
            deletedIds = JSON.parse(deletedStored);
        } catch (e) {
            console.error("Deleted routes list read error:", e);
        }
    }

    const deletedReviewStored = localStorage.getItem("rotamoto_deleted_review_ids");
    let deletedReviewIds = deletedReviewStored ? JSON.parse(deletedReviewStored) : [];

    let allRoutes = [];
    const stored = localStorage.getItem("rotamoto_custom_routes");
    if (stored) {
        try {
            const customRoutes = JSON.parse(stored);
            allRoutes = [...customRoutes, ...MOCK_ROUTES];
        } catch (e) {
            console.error("Local routes read error:", e);
            allRoutes = [...MOCK_ROUTES];
        }
    } else {
        allRoutes = [...MOCK_ROUTES];
    }

    // LocalStorage'daki kullanıcı rota ve mola yeri yorumlarını birleştir
    const routeReviewsStored = localStorage.getItem("rotamoto_route_reviews");
    let routeReviewsMap = routeReviewsStored ? JSON.parse(routeReviewsStored) : {};

    const pitstopReviewsStored = localStorage.getItem("rotamoto_pitstop_reviews");
    let pitstopReviewsMap = pitstopReviewsStored ? JSON.parse(pitstopReviewsStored) : {};

    // Rotaları derin kopyalayarak varsayılan nesneleri bozmadan birleştir
    const mergedRoutes = allRoutes.map(r => JSON.parse(JSON.stringify(r)));

    mergedRoutes.forEach(route => {
        if (routeReviewsMap[route.id]) {
            route.reviews = [...routeReviewsMap[route.id], ...(route.reviews || [])];
        }
        // Silinen rota yorumlarını süz
        if (route.reviews) {
            route.reviews = route.reviews.filter(rev => !deletedReviewIds.includes(rev.id));
        }

        if (route.pitstops && route.pitstops.length > 0) {
            route.pitstops.forEach((pit, pIdx) => {
                const pitKey = `${route.id}_pit_${pIdx}`;
                if (pitstopReviewsMap[pitKey]) {
                    pit.reviews = [...pitstopReviewsMap[pitKey], ...(pit.reviews || [])];
                }
                // Silinen mola yeri yorumlarını süz
                if (pit.reviews) {
                    pit.reviews = pit.reviews.filter(rev => !deletedReviewIds.includes(rev.id));
                }
            });
        }
    });

    return mergedRoutes.filter(r => !deletedIds.includes(r.id));
}

function saveCustomRoute(newRoute) {
    const stored = localStorage.getItem("rotamoto_custom_routes");
    let routes = stored ? JSON.parse(stored) : [];
    routes.unshift(newRoute);
    localStorage.setItem("rotamoto_custom_routes", JSON.stringify(routes));
}

function deleteRoute(routeId, event) {
    if (event) {
        event.stopPropagation();
    }

    const isEn = (typeof currentLang !== "undefined" && currentLang === "en");
    const confirmMsg = isEn 
        ? "Are you sure you want to delete this route?" 
        : "Bu rotayı silmek istediğinizden emin misiniz?";

    if (!confirm(confirmMsg)) {
        return;
    }

    // 1. Kullanıcı tarafından oluşturulmuş özel rotalardan sil
    const customStored = localStorage.getItem("rotamoto_custom_routes");
    if (customStored) {
        try {
            let customRoutes = JSON.parse(customStored);
            customRoutes = customRoutes.filter(r => r.id !== routeId);
            localStorage.setItem("rotamoto_custom_routes", JSON.stringify(customRoutes));
        } catch (e) {
            console.error("Error deleting custom route:", e);
        }
    }

    // 2. Silinen rota ID'lerine ekle
    const deletedStored = localStorage.getItem("rotamoto_deleted_route_ids");
    let deletedIds = deletedStored ? JSON.parse(deletedStored) : [];
    if (!deletedIds.includes(routeId)) {
        deletedIds.push(routeId);
        localStorage.setItem("rotamoto_deleted_route_ids", JSON.stringify(deletedIds));
    }

    // 3. Modal açıksa kapat
    if (typeof closeRouteModal === "function") {
        closeRouteModal();
    }

    // 4. Uygulama rotalarını ve haritayı yenile
    if (typeof refreshAppRoutes === "function") {
        refreshAppRoutes();
    }
}


