/**
 * RotaMoto - Üyelik, Sürücü Profili, Sürüş Süresi Kaydetme & Puanlama Sistemi (Gamification)
 */

// Varsayılan Demo Sürücüler
const DEMO_USERS = [
    {
        id: "u_can_rider",
        username: "Can 'Rider' Yılmaz",
        email: "can@rotamoto.com",
        password: "123",
        passwordHash: "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3",
        bikeModel: "Yamaha MT-07",
        bikeCategory: "touring-chopper",
        bikeCategoryName: "🛵 Naked / Streetfighter",
        avatar: "assets/naked_bike.jpg",
        points: 840,
        badges: ["⚡ En Hızlı Tur", "☕ Mola Üstadı", "🏁 5 Rota Tamamlandı"],
        joinedDate: "15 Ocak 2026"
    },
    {
        id: "u_kaan_apex",
        username: "Kaan 'Apex' Yılmaz",
        email: "kaan@rotamoto.com",
        password: "123",
        passwordHash: "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3",
        bikeModel: "Yamaha R1M",
        bikeCategory: "racing",
        bikeCategoryName: "🏎️ Racing / Supersport",
        avatar: "assets/racing_bike.jpg",
        points: 1350,
        badges: ["🏆 Pist Efsanesi", "⚡ Uçmakdere Rekortmeni", "🔥 10 Rota Tamamlandı"],
        joinedDate: "10 Şubat 2026"
    },
    {
        id: "u_selin_vlog",
        username: "Selin Motovlog",
        email: "selin@rotamoto.com",
        password: "123",
        passwordHash: "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3",
        bikeModel: "Kawasaki Z900",
        bikeCategory: "touring-chopper",
        bikeCategoryName: "🛵 Naked / Streetfighter",
        avatar: "assets/naked_bike.jpg",
        points: 620,
        badges: ["🎥 Motovlog Yıldızı", "☕ Mola Üstadı"],
        joinedDate: "01 Mart 2026"
    },
    {
        id: "u_tarkan_dirt",
        username: "Tarkan 'Dirt' Eren",
        email: "tarkan@rotamoto.com",
        password: "123",
        passwordHash: "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3",
        bikeModel: "KTM 300 EXC",
        bikeCategory: "cross-enduro",
        bikeCategoryName: "🏔️ Cross / Enduro",
        avatar: "assets/cross_bike.jpg",
        points: 980,
        badges: ["🏔️ Dağ Keşifi", "⚡ Off-Road Kralı"],
        joinedDate: "20 Şubat 2026"
    }
];

// Varsayılan Rota Sürüş Süre Kayıtları (Ride Logs & Leaderboard)
const MOCK_RIDE_LOGS = [
    {
        id: "log_1",
        routeId: "mudanya-tirilye-naked",
        userId: "u_can_rider",
        userName: "Can 'Rider' Yılmaz",
        bikeModel: "Yamaha MT-07",
        durationMinutes: 62, // 1 saat 2 dk
        durationFormatted: "1 saat 02 dk",
        date: "26 Eylül 2026",
        notes: "Mudanya virajlarında trafik rahattı, Tirilye'de çay molası harikaydı!",
        pointsEarned: 145
    },
    {
        id: "log_2",
        routeId: "mudanya-tirilye-naked",
        userId: "u_selin_vlog",
        userName: "Selin Motovlog",
        bikeModel: "Kawasaki Z900",
        durationMinutes: 68,
        durationFormatted: "1 saat 08 dk",
        date: "24 Eylül 2026",
        notes: "Kamera kaydı alarak tatlı bir tempoda sürdüm.",
        pointsEarned: 125
    },
    {
        id: "log_3",
        routeId: "ucmakdere-virajlari",
        userId: "u_kaan_apex",
        userName: "Kaan 'Apex' Yılmaz",
        bikeModel: "Yamaha R1M",
        durationMinutes: 58, // 58 dk
        durationFormatted: "0 saat 58 dk",
        date: "25 Eylül 2026",
        notes: "Uçmakdere virajlarında asfalt tutuşu 10 numaraydı!",
        pointsEarned: 240
    },
    {
        id: "log_4",
        routeId: "kazdaglari-offroad-zirve",
        userId: "u_tarkan_dirt",
        userName: "Tarkan 'Dirt' Eren",
        bikeModel: "KTM 300 EXC",
        durationMinutes: 145, // 2 saat 25 dk
        durationFormatted: "2 saat 25 dk",
        date: "22 Eylül 2026",
        notes: "Sarıkız zirvesine kadar dik kayalıklardan tırmandık.",
        pointsEarned: 280
    }
];

// Mevcut Giriş Yapmış Kullanıcıyı Getir
function getCurrentUser() {
    const storedUser = localStorage.getItem("rotamoto_current_user");
    if (storedUser) {
        try {
            return JSON.parse(storedUser);
        } catch (e) {
            console.error("User parse error:", e);
        }
    }
    // İlk girişte varsayılan demo kullanıcıyı aktif yap
    const defaultUser = DEMO_USERS[0];
    localStorage.setItem("rotamoto_current_user", JSON.stringify(defaultUser));
    return defaultUser;
}

// Tüm Kayıtlı Kullanıcıları Getir
function getAllUsers() {
    const stored = localStorage.getItem("rotamoto_registered_users");
    let users = stored ? JSON.parse(stored) : [];
    
    // DEMO kullanıcıları ile birleştir (tekrarsız)
    const userMap = new Map();
    DEMO_USERS.forEach(u => userMap.set(u.id, u));
    users.forEach(u => userMap.set(u.id, u));
    
    return Array.from(userMap.values());
}

// ============================================
// ŞİFRE HASHLEME (SHA-256 Kriptografik Hash Yasası)
// ============================================
async function hashPassword(plainText) {
    if (!plainText) return "";
    try {
        const cryptoObj = (typeof window !== "undefined" && window.crypto) 
            ? window.crypto 
            : (typeof globalThis !== "undefined" && globalThis.crypto ? globalThis.crypto : null);
        if (cryptoObj && cryptoObj.subtle) {
            const encoder = new TextEncoder();
            const data = encoder.encode(plainText);
            const hashBuffer = await cryptoObj.subtle.digest("SHA-256", data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
        }
    } catch (err) {
        console.warn("Web Crypto Subtle fallback:", err);
    }
    return jsSha256Fallback(plainText);
}

// Standart JS SHA-256 Algoritması (SubtleCrypto desteklenmeyen ortamlar için)
function jsSha256Fallback(ascii) {
    function rightRotate(value, amount) {
        return (value >>> amount) | (value << (32 - amount));
    }
    const mathPow = Math.pow;
    const maxWord = mathPow(2, 32);
    const lengthProperty = 'length';
    let i, j;
    const words = [];
    const asciiBitLength = ascii[lengthProperty] * 8;
    let hash = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    const k = [
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0x0bef9a3f, 0xc67178f2
    ];
    for (i = 0; i < ascii[lengthProperty]; i++) {
        words[i >> 2] |= (ascii.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
    }
    words[asciiBitLength >> 5] |= 0x80 << (24 - (asciiBitLength % 32));
    words[(((asciiBitLength + 64) >> 9) << 4) + 15] = asciiBitLength;
    for (i = 0; i < words[lengthProperty]; i += 16) {
        const w = words.slice(i, i + 16);
        const oldHash = hash.slice(0);
        for (j = 0; j < 64; j++) {
            if (j >= 16) {
                const s0 = rightRotate(w[j - 15], 7) ^ rightRotate(w[j - 15], 18) ^ (w[j - 15] >>> 3);
                const s1 = rightRotate(w[j - 2], 17) ^ rightRotate(w[j - 2], 19) ^ (w[j - 2] >>> 10);
                w[j] = (w[j - 16] + s0 + w[j - 7] + s1) | 0;
            }
            const s1 = rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25);
            const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
            const temp1 = (hash[7] + s1 + ch + k[j] + w[j]) | 0;
            const s0 = rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22);
            const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
            const temp2 = (s0 + maj) | 0;
            hash = [(temp1 + temp2) | 0, hash[0], hash[1], hash[2], (hash[3] + temp1) | 0, hash[4], hash[5], hash[6]];
        }
        for (j = 0; j < 8; j++) {
            hash[j] = (hash[j] + oldHash[j]) | 0;
        }
    }
    let hex = '';
    for (i = 0; i < 8; i++) {
        for (j = 3; j >= 0; j--) {
            const b = (hash[i] >> (j * 8)) & 255;
            hex += (b < 16 ? '0' : '') + b.toString(16);
        }
    }
    return hex;
}

// Şifre Doğrulama (Hash eşleşmesi kontrolü)
async function verifyPassword(plainPassword, user) {
    if (!user) return false;
    const inputHash = await hashPassword(plainPassword);
    if (user.passwordHash && user.passwordHash === inputHash) return true;
    if (user.password && user.password === inputHash) return true;
    if (user.password && user.password === plainPassword) return true;
    return false;
}

// Şifre Gizleme / Gösterme
function togglePasswordVisibility(inputId, btnEl) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const isPassword = input.type === "password";
    input.type = isPassword ? "text" : "password";

    const icon = btnEl ? btnEl.querySelector("i") : null;
    if (icon) {
        if (isPassword) {
            icon.className = "fa-solid fa-eye-slash";
            btnEl.title = currentLang === 'en' ? "Hide Password" : "Şifreyi Gizle";
        } else {
            icon.className = "fa-solid fa-eye";
            btnEl.title = currentLang === 'en' ? "Show Password" : "Şifreyi Göster";
        }
    }
}

// Giriş Yap Fonksiyonu (İsim veya E-posta + Şifre)
async function loginUser(identifier, password) {
    const cleanId = (identifier || "").trim().toLowerCase();
    const cleanPass = password || "";

    if (!cleanId || !cleanPass) {
        return {
            success: false,
            message: currentLang === 'en' ? 'Please enter your username and password!' : 'Lütfen sürücü adı ve şifrenizi giriniz!'
        };
    }

    const users = getAllUsers();
    // İsim (kullanıcı adı) veya e-posta ile giriş desteği
    const found = users.find(u => 
        (u.username && u.username.toLowerCase() === cleanId) || 
        (u.email && u.email.toLowerCase() === cleanId)
    );
    
    if (found) {
        const isMatch = await verifyPassword(cleanPass, found);
        if (isMatch) {
            localStorage.setItem("rotamoto_current_user", JSON.stringify(found));
            updateAuthUI();
            return { success: true, user: found };
        }
    }

    return {
        success: false,
        message: currentLang === 'en' ? 'Invalid rider name or password!' : 'Geçersiz sürücü adı veya şifre!'
    };
}

// Kayıt Ol Fonksiyonu (Mail + İsim + Şifre)
async function registerUser(userData) {
    const email = (userData.email || "").trim().toLowerCase();
    const username = (userData.username || "").trim();
    const password = userData.password || "";

    if (!email || !username || !password) {
        return {
            success: false,
            message: currentLang === 'en' ? 'Please provide email, name, and password!' : 'Lütfen e-posta, isim ve şifre alanlarını eksiksiz doldurunuz!'
        };
    }

    if (password.length < 3) {
        return {
            success: false,
            message: currentLang === 'en' ? 'Password must be at least 3 characters!' : 'Şifreniz en az 3 karakter olmalıdır!'
        };
    }

    const users = getAllUsers();
    const emailExists = users.some(u => u.email && u.email.toLowerCase() === email);
    if (emailExists) {
        return {
            success: false,
            message: currentLang === 'en' ? 'An account with this email already exists!' : 'Bu e-posta adresiyle zaten bir hesap mevcut!'
        };
    }

    const nameExists = users.some(u => u.username && u.username.toLowerCase() === username.toLowerCase());
    if (nameExists) {
        return {
            success: false,
            message: currentLang === 'en' ? 'This rider name is already taken! Please choose another.' : 'Bu sürücü adı zaten kullanılıyor! Lütfen başka bir isim seçiniz.'
        };
    }

    // Şifreyi SHA-256 hash yasasına göre güvenle hashle
    const passwordHash = await hashPassword(password);

    const newUser = {
        id: "u_rider_" + Date.now(),
        username: username,
        email: email,
        passwordHash: passwordHash, // Düz metin şifre saklanmaz
        bikeModel: userData.bikeModel || "Motosiklet Sürücüsü",
        bikeCategory: "touring-chopper",
        bikeCategoryName: "🛵 Naked / Streetfighter",
        avatar: "assets/naked_bike.jpg",
        points: 100, // Hoşgeldin bonusu
        badges: ["🏁 Yeni Sürücü"],
        joinedDate: new Date().toLocaleDateString(currentLang === 'en' ? 'en-US' : 'tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
    };

    const stored = localStorage.getItem("rotamoto_registered_users");
    let regUsers = stored ? JSON.parse(stored) : [];
    regUsers.push(newUser);
    localStorage.setItem("rotamoto_registered_users", JSON.stringify(regUsers));
    
    // Oturum aç ve UI güncelle
    localStorage.setItem("rotamoto_current_user", JSON.stringify(newUser));
    updateAuthUI();

    return { success: true, user: newUser };
}

// Form Submit Handlerları
async function handleAuthLogin(e, form) {
    e.preventDefault();
    const identifier = form.identifier ? form.identifier.value : (form.username ? form.username.value : form.email.value);
    const password = form.password.value;
    
    const submitBtn = form.querySelector("button[type='submit']");
    const originalBtn = submitBtn ? submitBtn.innerHTML : "";
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${currentLang === 'en' ? 'Signing in...' : 'Giriş yapılıyor...'}`;
    }

    try {
        const res = await loginUser(identifier, password);
        if (!res.success) {
            alert(res.message);
        } else {
            closeAuthModal();
            form.reset();
        }
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtn;
        }
    }
}

async function handleAuthRegister(e, form) {
    e.preventDefault();
    const email = form.email.value;
    const username = form.username.value;
    const password = form.password.value;

    const submitBtn = form.querySelector("button[type='submit']");
    const originalBtn = submitBtn ? submitBtn.innerHTML : "";
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${currentLang === 'en' ? 'Registering...' : 'Kaydediliyor...'}`;
    }

    try {
        const res = await registerUser({ email, username, password });
        if (!res.success) {
            alert(res.message);
        } else {
            alert(currentLang === 'en'
                ? `🎉 Welcome ${res.user.username}! Your account has been registered and password securely hashed with SHA-256.`
                : `🎉 Hoş geldiniz ${res.user.username}! Üyeliğiniz oluşturuldu ve şifreniz SHA-256 hash yasasına göre güvenle kaydedildi.`);
            closeAuthModal();
            form.reset();
        }
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtn;
        }
    }
}

// Çıkış Yap Fonksiyonu
function logoutUser() {
    localStorage.removeItem("rotamoto_current_user");
    updateAuthUI();
    const isEn = (currentLang === "en");
    alert(isEn ? "You have logged out." : "Başarıyla çıkış yapıldı.");
}

// Sürücü Seviyesi ve Unvanı Hesapla
function getRiderRankInfo(points) {
    const pts = parseFloat(points) || 0;
    const isEn = (currentLang === "en");

    if (pts >= 1200) {
        return {
            title: isEn ? "🏆 Legendary Apex Master" : "🏆 Pist & Dağ Efsanesi",
            level: 4,
            badgeColor: "#ff2a00",
            nextThreshold: 2000,
            icon: "fa-trophy"
        };
    } else if (pts >= 650) {
        return {
            title: isEn ? "🏎️ Apex Master" : "🏎️ Apex Ustası",
            level: 3,
            badgeColor: "#ff6b00",
            nextThreshold: 1200,
            icon: "fa-gauge-high"
        };
    } else if (pts >= 250) {
        return {
            title: isEn ? "🛵 Curve Hunter" : "🛵 Viraj Avcısı",
            level: 2,
            badgeColor: "#00b0ff",
            nextThreshold: 650,
            icon: "fa-compass"
        };
    } else {
        return {
            title: isEn ? "🔰 Rookie Rider" : "🔰 Çaylak Sürücü",
            level: 1,
            badgeColor: "#00e676",
            nextThreshold: 250,
            icon: "fa-motorcycle"
        };
    }
}

// Tüm Sürüş Loglarını Getir
function getAllRideLogs() {
    const stored = localStorage.getItem("rotamoto_ride_logs");
    let customLogs = stored ? JSON.parse(stored) : [];
    return [...customLogs, ...MOCK_RIDE_LOGS];
}

// Bir Rotanın En Hızlı Sürücülerini & Sürüş Loglarını Getir
function getRouteLeaderboard(routeId) {
    const logs = getAllRideLogs().filter(log => log.routeId === routeId);
    // En kısa süreden (en hızlı) en uzuna doğru sırala
    logs.sort((a, b) => a.durationMinutes - b.durationMinutes);
    return logs;
}

// Sürüş Süresi Kaydet (Ride Log & Puanlama)
function saveRideLog(routeId, durationHours, durationMins, notes) {
    const user = getCurrentUser();
    if (!user) {
        alert(currentLang === 'en' ? "Please log in to submit your ride time!" : "Sürüş sürenizi kaydetmek için lütfen giriş yapın!");
        openAuthModal();
        return;
    }

    const totalMinutes = (parseInt(durationHours) || 0) * 60 + (parseInt(durationMins) || 0);

    if (totalMinutes <= 0) {
        alert(currentLang === 'en' ? "Please enter a valid ride duration." : "Lütfen geçerli bir sürüş süresi giriniz.");
        return;
    }

    const allRoutes = getStoredRoutes();
    const route = allRoutes.find(r => r.id === routeId);
    const distKm = route ? (route.distanceKm || 50) : 50;
    const diff = route ? route.difficulty : "Orta";

    // Puanlama Algoritması
    let diffMultiplier = 1.3;
    if (diff === "Başlangıç") diffMultiplier = 1.0;
    if (diff === "Usta") diffMultiplier = 1.7;
    if (diff === "Efsane") diffMultiplier = 2.2;

    const basePoints = Math.round(distKm * diffMultiplier);
    const timeBonus = totalMinutes < 90 ? 50 : 25;
    const notesBonus = notes && notes.length > 5 ? 30 : 0;
    const totalPointsEarned = basePoints + timeBonus + notesBonus;

    const isEn = (currentLang === "en");
    const dateStr = new Date().toLocaleDateString(isEn ? 'en-US' : 'tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });
    
    const formattedDuration = (parseInt(durationHours) || 0) > 0 
        ? `${durationHours} ${isEn ? 'hr' : 'saat'} ${durationMins} ${isEn ? 'min' : 'dk'}`
        : `${durationMins} ${isEn ? 'min' : 'dk'}`;

    const newLog = {
        id: "log_" + Date.now(),
        routeId: routeId,
        userId: user.id,
        userName: user.username,
        bikeModel: user.bikeModel,
        durationMinutes: totalMinutes,
        durationFormatted: formattedDuration,
        date: dateStr,
        notes: notes || (isEn ? "Ride logged by rider" : "Sürücü tarafından loglanan sürüş"),
        pointsEarned: totalPointsEarned
    };

    // 1. Sürüş logunu kaydet
    const storedLogs = localStorage.getItem("rotamoto_ride_logs");
    let logs = storedLogs ? JSON.parse(storedLogs) : [];
    logs.unshift(newLog);
    localStorage.setItem("rotamoto_ride_logs", JSON.stringify(logs));

    // 2. Kullanıcının puanını güncelle
    user.points = (user.points || 0) + totalPointsEarned;
    
    // Rozet Kontrolü
    if (user.points >= 500 && !user.badges.includes("🏆 Viraj Ustası")) {
        user.badges.push("🏆 Viraj Ustası");
    }
    if (user.points >= 1000 && !user.badges.includes("⚡ Apex Rekortmeni")) {
        user.badges.push("⚡ Apex Rekortmeni");
    }

    localStorage.setItem("rotamoto_current_user", JSON.stringify(user));

    // Genel kullanıcı listesini de güncelle
    const registeredStored = localStorage.getItem("rotamoto_registered_users");
    if (registeredStored) {
        let regUsers = JSON.parse(registeredStored);
        const idx = regUsers.findIndex(u => u.id === user.id);
        if (idx !== -1) {
            regUsers[idx] = user;
            localStorage.setItem("rotamoto_registered_users", JSON.stringify(regUsers));
        }
    }

    updateAuthUI();

    const rankInfo = getRiderRankInfo(user.points);

    alert(isEn 
        ? `🎉 Awesome ride! You completed the route in ${formattedDuration} and earned +${totalPointsEarned} XP Points!\nYour Rank: ${rankInfo.title}` 
        : `🎉 Harika sürüş! Rotayı ${formattedDuration} sürede tamamladınız ve +${totalPointsEarned} Puan kazandınız!\nYeni Unvanınız: ${rankInfo.title}`);

    // Modal açıksa yenile
    if (typeof openRouteModal === "function") {
        openRouteModal(routeId);
    }
    closeLogRideModal();
}

// Header ve Auth UI Güncelleyici
function updateAuthUI() {
    const user = getCurrentUser();
    const authActionsContainer = document.getElementById("headerAuthActions");
    if (!authActionsContainer) return;

    const isEn = (currentLang === "en");

    if (user) {
        const rankInfo = getRiderRankInfo(user.points);
        authActionsContainer.innerHTML = `
            <div class="user-profile-menu-wrapper" id="userProfileWrapper">
                <button class="user-profile-btn" onclick="toggleProfileDropdown(event)" title="${user.username}" style="gap:0; padding: 4px;">
                    <img src="${user.avatar}" class="user-avatar-mini" alt="${user.username}" style="width:36px; height:36px; border-radius:50%; border:2px solid ${rankInfo.badgeColor}; object-fit:cover;" />
                    <i class="fa-solid fa-chevron-down" style="font-size: 0.65rem; color: var(--text-muted); margin-left:4px;"></i>
                </button>

                <div class="user-dropdown-menu" id="userDropdownMenu">
                    <div class="user-dropdown-header">
                        <strong style="color:var(--text-main); font-size:0.95rem; display:block;">${user.username}</strong>
                        <span style="font-size:0.8rem; color:var(--text-muted);">${user.bikeModel}</span>
                        <div class="rank-progress-bar-container" style="margin-top:6px;">
                            <div class="rank-progress-bar" style="width: ${Math.min(100, (user.points / rankInfo.nextThreshold) * 100)}%;"></div>
                        </div>
                        <span style="font-size:0.72rem; color:var(--text-dim); display:block; margin-top:2px;">${user.points} / ${rankInfo.nextThreshold} XP (${isEn ? 'Next Level' : 'Sonraki Seviye'})</span>
                    </div>

                    <div class="user-dropdown-item" onclick="openProfileModal()">
                        <i class="fa-solid fa-user-gear" style="color:var(--primary);"></i>
                        <span>${isEn ? 'Rider Profile & Badges' : 'Sürücü Profilim & Rozetler'}</span>
                    </div>
                    <div class="user-dropdown-item" onclick="openTopRidersModal()">
                        <i class="fa-solid fa-trophy" style="color:var(--accent-gold);"></i>
                        <span>${isEn ? 'Top Riders Leaderboard' : 'Şampiyon Sürücüler Tablosu'}</span>
                    </div>
                    <div class="user-dropdown-item" onclick="logoutUser()">
                        <i class="fa-solid fa-right-from-bracket" style="color:#ff3344;"></i>
                        <span>${isEn ? 'Log Out' : 'Çıkış Yap'}</span>
                    </div>
                </div>
            </div>
        `;
    } else {
        authActionsContainer.innerHTML = `
            <button class="btn btn-secondary" style="padding:0.55rem 1rem; font-size:0.85rem;" onclick="openAuthModal()">
                <i class="fa-solid fa-user-plus" style="color:var(--primary);"></i> ${isEn ? 'Sign In / Register' : 'Giriş / Kayıt Ol'}
            </button>
        `;
    }
}

function toggleProfileDropdown(event) {
    if (event) event.stopPropagation();
    const wrapper = document.getElementById("userProfileWrapper");
    if (wrapper) {
        wrapper.classList.toggle("open");
    }
}

document.addEventListener("click", (e) => {
    const wrapper = document.getElementById("userProfileWrapper");
    if (wrapper && !wrapper.contains(e.target)) {
        wrapper.classList.remove("open");
    }
});

/* Modal Opener & Helper Functions */
function openAuthModal() {
    const modal = document.getElementById("authModalBackdrop");
    if (modal) {
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
    }
}

function closeAuthModal() {
    const modal = document.getElementById("authModalBackdrop");
    if (modal) modal.classList.remove("active");
    document.body.style.overflow = "";
}

function switchAuthTab(tab) {
    const loginForm = document.getElementById("authLoginForm");
    const regForm = document.getElementById("authRegisterForm");
    const tabLoginBtn = document.getElementById("tabLoginBtn");
    const tabRegBtn = document.getElementById("tabRegisterBtn");

    if (tab === 'login') {
        if (loginForm) loginForm.style.display = "block";
        if (regForm) regForm.style.display = "none";
        if (tabLoginBtn) tabLoginBtn.classList.add("active");
        if (tabRegBtn) tabRegBtn.classList.remove("active");
    } else {
        if (loginForm) loginForm.style.display = "none";
        if (regForm) regForm.style.display = "block";
        if (tabLoginBtn) tabLoginBtn.classList.remove("active");
        if (tabRegBtn) tabRegBtn.classList.add("active");
    }
}

function quickDemoLogin(userId) {
    const users = getAllUsers();
    const target = users.find(u => u.id === userId) || DEMO_USERS[0];
    localStorage.setItem("rotamoto_current_user", JSON.stringify(target));
    updateAuthUI();
    closeAuthModal();
    const isEn = (currentLang === "en");
    alert(isEn ? `Logged in as ${target.username}!` : `${target.username} olarak hızlı giriş yapıldı!`);
}

function openLogRideModal(routeId) {
    const user = getCurrentUser();
    if (!user) {
        alert(currentLang === 'en' ? 'Please log in to submit your ride time!' : 'Sürüş sürenizi kaydetmek için lütfen önce giriş yapın!');
        openAuthModal();
        return;
    }

    const modal = document.getElementById("logRideModalBackdrop");
    const routeIdInput = document.getElementById("logRideRouteId");
    const titleEl = document.getElementById("logRideRouteTitle");

    const allRoutes = getStoredRoutes();
    const route = allRoutes.find(r => r.id === routeId);

    if (routeIdInput) routeIdInput.value = routeId;
    if (titleEl && route) {
        const isEn = (currentLang === "en");
        titleEl.textContent = isEn ? (route.titleEn || route.title) : route.title;
    }

    if (modal) {
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
    }
}

function closeLogRideModal() {
    const modal = document.getElementById("logRideModalBackdrop");
    if (modal) modal.classList.remove("active");
    document.body.style.overflow = "";
}

function submitLogRideForm() {
    const routeId = document.getElementById("logRideRouteId")?.value;
    const hours = document.getElementById("logRideHours")?.value || 0;
    const mins = document.getElementById("logRideMins")?.value || 0;
    const notes = document.getElementById("logRideNotes")?.value || "";

    if (!routeId) return;
    saveRideLog(routeId, hours, mins, notes);
}

function openProfileModal() {
    const user = getCurrentUser();
    if (!user) return;

    const modal = document.getElementById("profileModalBackdrop");
    const container = document.getElementById("profileModalContent");
    if (!modal || !container) return;

    const isEn = (currentLang === "en");
    const rankInfo = getRiderRankInfo(user.points);
    const userLogs = getAllRideLogs().filter(log => log.userId === user.id);

    const badgesHtml = (user.badges || []).map(b => `
        <span class="rider-badge-pill">${b}</span>
    `).join('');

    const logsHtml = userLogs.length > 0 ? userLogs.map(log => {
        const route = getStoredRoutes().find(r => r.id === log.routeId);
        const rTitle = route ? (isEn ? (route.titleEn || route.title) : route.title) : log.routeId;
        return `
            <div class="user-ride-log-card">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                    <strong style="color:var(--text-main); font-size:0.95rem;">${rTitle}</strong>
                    <span style="color:var(--primary); font-family:var(--font-heading); font-weight:800; font-size:0.9rem;">⏱️ ${log.durationFormatted}</span>
                </div>
                <p style="font-size:0.82rem; color:var(--text-muted); margin-bottom:4px;">${log.notes}</p>
                <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-dim);">
                    <span><i class="fa-regular fa-calendar"></i> ${log.date}</span>
                    <span style="color:var(--accent-gold); font-weight:700;">+${log.pointsEarned} XP</span>
                </div>
            </div>
        `;
    }).join('') : `<p style="color:var(--text-muted); font-size:0.85rem;">${isEn ? 'No recorded rides yet. Ride a route and log your time!' : 'Henüz kaydedilmiş sürüşünüz yok. Bir rotayı sürüp sürenizi loglayın!'}</p>`;

    container.innerHTML = `
        <div class="profile-header-card">
            <img src="${user.avatar}" class="profile-avatar-large" alt="${user.username}" />
            <div>
                <h3 style="font-family:var(--font-heading); font-size:1.6rem; font-weight:800; color:var(--text-main);">${user.username}</h3>
                <p style="color:var(--text-muted); font-size:0.9rem;"><i class="fa-solid fa-motorcycle" style="color:var(--primary);"></i> ${user.bikeModel} • ${user.bikeCategoryName}</p>
                
                <div style="display:flex; align-items:center; gap:0.6rem; margin-top:0.5rem; flex-wrap:wrap;">
                    <span class="badge" style="background:${rankInfo.badgeColor}; color:#fff; font-size:0.85rem;">${rankInfo.title}</span>
                    <span style="font-family:var(--font-heading); font-weight:800; color:var(--accent-gold); font-size:1.1rem;">${user.points} XP Puan</span>
                </div>
            </div>
        </div>

        <div style="margin-bottom:1.5rem;">
            <h4 style="font-family:var(--font-heading); font-size:1.05rem; color:var(--text-main); margin-bottom:0.6rem;"><i class="fa-solid fa-medal" style="color:var(--accent-gold);"></i> ${isEn ? 'Earned Badges & Achievements' : 'Kazanılan Rozetler & Başarılar'}</h4>
            <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
                ${badgesHtml}
            </div>
        </div>

        <div>
            <h4 style="font-family:var(--font-heading); font-size:1.05rem; color:var(--text-main); margin-bottom:0.8rem;"><i class="fa-solid fa-clock-rotate-left" style="color:var(--primary);"></i> ${isEn ? 'Ride History & Completed Times' : 'Sürüş Geçmişim & Sürelerim'} (${userLogs.length})</h4>
            <div style="display:flex; flex-direction:column; gap:0.6rem; max-height:260px; overflow-y:auto;">
                ${logsHtml}
            </div>
        </div>
    `;

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeProfileModal() {
    const modal = document.getElementById("profileModalBackdrop");
    if (modal) modal.classList.remove("active");
    document.body.style.overflow = "";
}

function openTopRidersModal() {
    const modal = document.getElementById("topRidersModalBackdrop");
    const container = document.getElementById("topRidersListContainer");
    if (!modal || !container) return;

    const isEn = (currentLang === "en");
    const users = getAllUsers();
    users.sort((a, b) => b.points - a.points);

    const rowsHtml = users.map((u, idx) => {
        const rankInfo = getRiderRankInfo(u.points);
        let medalIcon = `#${idx + 1}`;
        if (idx === 0) medalIcon = '🥇';
        if (idx === 1) medalIcon = '🥈';
        if (idx === 2) medalIcon = '🥉';

        return `
            <div class="top-rider-row ${idx === 0 ? 'rank-1' : ''}">
                <div style="font-family:var(--font-heading); font-size:1.3rem; font-weight:900; width:36px; text-align:center;">${medalIcon}</div>
                <img src="${u.avatar}" style="width:40px; height:40px; border-radius:50%; object-fit:cover; border:1px solid var(--border-glass);" />
                <div style="flex:1;">
                    <strong style="color:var(--text-main); font-size:0.95rem; display:block;">${u.username}</strong>
                    <small style="color:var(--text-muted); font-size:0.78rem;">${u.bikeModel}</small>
                </div>
                <div style="text-align:right;">
                    <span style="font-family:var(--font-heading); font-weight:800; color:var(--accent-gold); font-size:1.05rem;">${u.points} XP</span>
                    <span class="badge" style="background:${rankInfo.badgeColor}; color:#fff; font-size:0.7rem; display:block; margin-top:2px;">${rankInfo.title}</span>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = rowsHtml;
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeTopRidersModal() {
    const modal = document.getElementById("topRidersModalBackdrop");
    if (modal) modal.classList.remove("active");
    document.body.style.overflow = "";
}

