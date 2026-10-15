/**
 * RotaMoto - Ana Mantık & i18n Dil Entegrasyonu
 */
let currentBikeCategory = "all";
let currentTheme = localStorage.getItem("rotamoto_theme") || "dark";

document.addEventListener("DOMContentLoaded", () => {
    applyTheme(currentTheme);
    updateLanguageUI();
    initMainMap();
    initRouteBuilderMap();
    refreshAppRoutes();
    if (typeof updateAuthUI === "function") updateAuthUI();
    setupEventListeners();
    renderMemberReviews("all");
});

function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    currentTheme = (current === "dark") ? "light" : "dark";
    localStorage.setItem("rotamoto_theme", currentTheme);
    applyTheme(currentTheme);
}

// Geriye dönük uyumluluk için cycleTheme fonksiyonu
function cycleTheme() {
    toggleTheme();
}

function applyTheme(theme) {
    let targetTheme = theme;

    if (theme === "system") {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        targetTheme = prefersDark ? "dark" : "light";
    }

    document.documentElement.setAttribute("data-theme", targetTheme);

    const btn = document.getElementById("themeToggleBtn");
    if (btn) {
        const isDark = (targetTheme === "dark");
        btn.setAttribute("title", isDark ? "Açık Temaya Geç" : "Koyu Temaya Geç");
        btn.setAttribute("aria-label", isDark ? "Açık Temaya Geç" : "Koyu Temaya Geç");
    }
}

function refreshAppRoutes() {
    filterAndRenderRoutes();
}

function setBikeCategoryFilter(cat) {
    currentBikeCategory = cat;

    document.querySelectorAll(".bike-tab-btn").forEach(btn => {
        if (btn.dataset.category === cat) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });

    filterAndRenderRoutes();
}

function filterAndRenderRoutes() {
    const searchVal = (document.getElementById("searchInput")?.value || "").toLowerCase();
    const regionVal = document.getElementById("filterRegion")?.value || "all";
    const diffVal = document.getElementById("filterDifficulty")?.value || "all";

    const allRoutes = getStoredRoutes();
    const isEn = (currentLang === "en");

    const filtered = allRoutes.filter(route => {
        const matchesBikeCat = (currentBikeCategory === "all") || (route.bikeCategory === currentBikeCategory);

        const routeTitle = isEn ? (route.titleEn || route.title) : route.title;
        const routeTagline = isEn ? (route.taglineEn || route.tagline) : route.tagline;

        const matchesSearch = routeTitle.toLowerCase().includes(searchVal) ||
            routeTagline.toLowerCase().includes(searchVal) ||
            (route.country || "").toLowerCase().includes(searchVal) ||
            (route.terrainType || "").toLowerCase().includes(searchVal) ||
            route.startPoint.toLowerCase().includes(searchVal) ||
            route.endPoint.toLowerCase().includes(searchVal);

        const matchesRegion = (regionVal === "all") || (route.region.toLowerCase().includes(regionVal.toLowerCase()) || route.country.toLowerCase().includes(regionVal.toLowerCase()));
        const matchesDiff = (diffVal === "all") || (route.difficulty === diffVal);

        return matchesBikeCat && matchesSearch && matchesRegion && matchesDiff;
    });

    renderRouteCards(filtered);

    if (typeof renderRoutesOnMap === "function") {
        renderRoutesOnMap(filtered);
    }
}

function renderRouteCards(routes) {
    const grid = document.getElementById("routesGrid");
    const countEl = document.getElementById("activeRouteCount");
    const isEn = (currentLang === "en");

    if (countEl) {
        let catText = isEn ? "All Global & Local Routes" : "Tüm Küresel & Yerel Rotalar";
        if (currentBikeCategory === "racing") catText = isEn ? "🏎️ Racing / Supersport Twisties" : "🏎️ Racing / Supersport Viraj Rotaları";
        if (currentBikeCategory === "cross-enduro") catText = isEn ? "🏔️ Cross / Enduro Mountain & Dirt Trails" : "🏔️ Cross / Enduro Dağ & Arazi Rotaları";
        if (currentBikeCategory === "touring-chopper") catText = isEn ? "🛵 Naked / Streetfighter Curves" : "🛵 Naked / Streetfighter Viraj Rotaları";

        const prefix = isEn ? "Motorcycle Routes" : "Motosiklet Rotası";
        countEl.innerHTML = `<strong>${routes.length} ${prefix}</strong> (${catText})`;
    }

    if (!grid) return;

    if (routes.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align:center; padding: 4rem 1rem; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-glass);">
                <i class="fa-solid fa-motorcycle" style="font-size: 3rem; margin-bottom: 1rem; color: var(--primary);"></i>
                <h3 style="font-family: var(--font-heading); color: var(--text-main); font-size: 1.4rem; margin-bottom: 0.5rem;">${isEn ? 'No Routes Found for Selected Filters' : 'Seçilen Kriterlere Uygun Rota Bulunamadı'}</h3>
                <p>${isEn ? 'Please try clearing your search query or filters.' : 'Filtreleri değiştirerek tekrar deneyin.'}</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = routes.map(route => {
        const bikesHtml = (route.recommendedBikes || []).slice(0, 3).map(b => `<span class="bike-tag">${b}</span>`).join('');

        let catBadgeBg = "var(--primary)";
        if (route.bikeCategory === "cross-enduro") catBadgeBg = "#2e7d32";
        if (route.bikeCategory === "racing") catBadgeBg = "#d50000";

        const title = isEn ? (route.titleEn || route.title) : route.title;
        const tagline = isEn ? (route.taglineEn || route.tagline) : route.tagline;
        const country = isEn ? (route.countryEn || route.country) : route.country;
        const terrain = isEn ? (route.terrainTypeEn || route.terrainType) : route.terrainType;
        const btnText = isEn ? "Pitstops & Details" : "Mola & Detay";
        const pitstopBadge = isEn ? "Biker Pitstops" : "Mola Mekanı";

        const avgScore = getRouteAverageRating(route);
        const reviewCount = route.reviews ? route.reviews.length : 0;

        return `
            <article class="route-card" data-id="${route.id}">
                <div class="route-card-image">
                    <img src="${route.image}" alt="${title}" class="route-card-img" loading="lazy" />
                    
                    <button class="btn-card-delete-topright" onclick="deleteRoute('${route.id}', event)" title="${isEn ? 'Delete Route' : 'Rotayı Sil'}">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>

                    <div class="route-badge-container">
                        ${route.socialTag ? `<span class="badge" style="background:linear-gradient(135deg, #e1306c, #f77737); color:#fff;">${route.socialTag}</span>` : ''}
                        <span class="badge" style="background:${catBadgeBg}; color:#fff;">${route.bikeCategoryName || 'Motosiklet'}</span>
                        <span class="badge badge-region">${country}</span>
                    </div>

                    <div class="route-card-curvature">
                        <i class="fa-solid fa-star" style="color:var(--accent-gold);"></i> <strong>${avgScore.toFixed(1)}</strong>/10
                    </div>
                </div>

                <div class="route-card-body">
                    <h3 class="route-card-title">${title}</h3>
                    <p class="route-card-tagline">${tagline}</p>

                    <div style="display:flex; justify-content:space-between; align-items:center; background: var(--bg-dark); padding: 0.5rem 0.8rem; border-radius: var(--radius-sm); font-size: 0.82rem; margin-bottom: 0.8rem; color: var(--text-muted); border: 1px solid var(--border-glass);">
                        <div><i class="fa-solid fa-layer-group" style="color: var(--primary);"></i> <strong>${isEn ? 'Pavement:' : 'Zemin:'}</strong> ${terrain || route.asphaltQuality}</div>
                        <div style="font-size:0.75rem; color:var(--accent-gold); font-weight:700;">${avgScore.toFixed(1)} ⭐ (${reviewCount})</div>
                    </div>

                    ${route.pitstops && route.pitstops.length > 0 ? `
                        <div style="background: rgba(255,183,0,0.08); border:1px solid rgba(255,183,0,0.25); color:var(--accent-gold); padding:0.4rem 0.7rem; border-radius:var(--radius-sm); font-size:0.8rem; font-weight:600; margin-bottom:1.1rem; display:flex; align-items:center; justify-content:space-between; gap:0.4rem;">
                            <span>☕ <strong>${route.pitstops.length} ${pitstopBadge}:</strong> ${isEn ? (route.pitstops[0].titleEn || route.pitstops[0].title) : route.pitstops[0].title}</span>
                            <span style="font-size:0.75rem;">⭐ ${getPitstopAverageRating(route.pitstops[0]).toFixed(1)}</span>
                        </div>
                    ` : ''}

                    <div class="route-card-metrics">
                        <div class="metric-item">
                            <span class="metric-value">${route.distanceKm} km</span>
                            <span class="metric-label">${isEn ? 'Distance' : 'Mesafe'}</span>
                        </div>
                        <div class="metric-item">
                            <span class="metric-value">${route.turnCount}</span>
                            <span class="metric-label">${isEn ? 'Corners' : 'Viraj'}</span>
                        </div>
                        <div class="metric-item">
                            <span class="metric-value">${route.estimatedDuration}</span>
                            <span class="metric-label">${isEn ? 'Est. Time' : 'Süre'}</span>
                        </div>
                    </div>

                    <div class="route-card-footer">
                        <div class="route-bikes-list" style="flex-wrap:wrap; max-width:55%;">
                            ${bikesHtml}
                        </div>
                        <button class="btn btn-outline" style="padding:0.38rem 0.8rem; font-size:0.83rem; white-space:nowrap; flex-shrink:0;" onclick="openRouteModal('${route.id}')">
                            ${btnText} <i class="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </article>
        `;
    }).join('');
}

function setupEventListeners() {
    document.getElementById("searchInput")?.addEventListener("input", filterAndRenderRoutes);
    document.getElementById("filterRegion")?.addEventListener("change", filterAndRenderRoutes);
    document.getElementById("filterDifficulty")?.addEventListener("change", filterAndRenderRoutes);

    document.getElementById("modalBackdrop")?.addEventListener("click", (e) => {
        if (e.target.id === "modalBackdrop") {
            closeRouteModal();
        }
    });

    document.getElementById("builderModalBackdrop")?.addEventListener("click", (e) => {
        if (e.target.id === "builderModalBackdrop") {
            closeRouteBuilderModal();
        }
    });

    document.getElementById("authModalBackdrop")?.addEventListener("click", (e) => {
        if (e.target.id === "authModalBackdrop") closeAuthModal();
    });

    document.getElementById("logRideModalBackdrop")?.addEventListener("click", (e) => {
        if (e.target.id === "logRideModalBackdrop") closeLogRideModal();
    });

    document.getElementById("profileModalBackdrop")?.addEventListener("click", (e) => {
        if (e.target.id === "profileModalBackdrop") closeProfileModal();
    });

    document.getElementById("topRidersModalBackdrop")?.addEventListener("click", (e) => {
        if (e.target.id === "topRidersModalBackdrop") closeTopRidersModal();
    });

    document.getElementById("routeReviewModalBackdrop")?.addEventListener("click", (e) => {
        if (e.target.id === "routeReviewModalBackdrop") closeRouteReviewModal();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeRouteModal();
            closeRouteBuilderModal();
            closeAuthModal();
            closeLogRideModal();
            closeProfileModal();
            closeTopRidersModal();
            closeRouteReviewModal();
        }
    });
}

function openRouteReviewModal(routeId) {
    // Önce varsa açık olan detay modalını kapat
    const detailModal = document.getElementById("modalBackdrop");
    if (detailModal && detailModal.classList.contains("active")) {
        detailModal.classList.remove("active");
    }

    const routes = typeof getStoredRoutes === "function" ? getStoredRoutes() : [];
    const route = routes.find(r => String(r.id) === String(routeId));
    if (!route) {
        console.error("Route not found for review modal:", routeId);
        return;
    }

    const modal = document.getElementById("routeReviewModalBackdrop");
    const container = document.getElementById("routeReviewModalContainer");
    if (!modal || !container) {
        console.error("Route review modal elements missing!");
        return;
    }

    const isEn = (currentLang === "en");
    const activeUser = (typeof getCurrentUser === "function") ? getCurrentUser() : null;
    const defaultUserName = activeUser ? (activeUser.username || "") : "";
    const defaultBikeModel = activeUser ? (activeUser.bikeModel || "") : "";

    const title = isEn ? (route.titleEn || route.title) : route.title;
    const overallRouteRating = getRouteAverageRating(route);
    const totalReviewsCount = route.reviews ? route.reviews.length : 0;

    const routeReviewsHtml = (route.reviews || []).map(rev => `
        <div class="route-review-card" style="margin-bottom:0.8rem; background:var(--bg-dark); padding:0.9rem; border-radius:var(--radius-sm); border:1px solid var(--border-glass);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
                <div>
                    <strong style="color:var(--text-main); font-family:var(--font-heading); font-size:0.98rem;">${rev.userName}</strong>
                    <span style="font-size:0.8rem; color:var(--primary); margin-left:6px;">(${rev.bike})</span>
                </div>
                <div style="display:flex; align-items:center; gap:0.6rem;">
                    ${getStarRatingHtml(rev.rating, 10)}
                    <button class="btn-review-delete" onclick="deleteRouteReview('${route.id}', '${rev.id}')" title="${isEn ? 'Delete Review' : 'Değerlendirmeyi Sil'}">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </div>
            <p style="font-size:0.88rem; color:var(--text-muted); line-height:1.5;">${isEn ? (rev.commentEn || rev.comment) : rev.comment}</p>
            <span style="font-size:0.75rem; color:var(--text-dim); display:block; margin-top:0.4rem;"><i class="fa-regular fa-clock"></i> ${rev.date}</span>
        </div>
    `).join('');

    const routePickerId = `route_picker_${route.id}`;

    container.innerHTML = `
        <button class="modal-close-btn" onclick="closeRouteReviewModal()"><i class="fa-solid fa-xmark"></i></button>

        <div style="display:flex; align-items:center; gap:0.8rem; margin-bottom:1.2rem; border-bottom:1px solid var(--border-glass); padding-bottom:0.8rem;">
            <div class="logo-icon" style="width:40px; height:40px; font-size:1.15rem; background:linear-gradient(135deg, #ffb700, #ff6b00); flex-shrink:0;">
                <i class="fa-solid fa-star"></i>
            </div>
            <div>
                <h3 style="font-family:var(--font-heading); font-size:1.25rem; font-weight:800; color:var(--text-main); margin-bottom:2px;">${title}</h3>
                <div style="display:flex; align-items:center; gap:0.6rem;">
                    <span style="font-size:0.9rem; font-weight:800; color:var(--accent-gold);">${overallRouteRating.toFixed(1)} / 10 ⭐</span>
                    <span style="font-size:0.8rem; color:var(--text-muted);">(${totalReviewsCount} ${t('reviewsCountText')})</span>
                </div>
            </div>
        </div>

        <div style="max-height: 65vh; overflow-y: auto; padding-right: 4px;">
            <h4 style="font-family:var(--font-heading); font-size:1.02rem; color:var(--text-main); margin-bottom:0.8rem;">
                <i class="fa-solid fa-comments" style="color:var(--primary);"></i> ${t('modalReviewsTitle')} (${totalReviewsCount})
            </h4>

            <div style="display:flex; flex-direction:column; margin-bottom:1.5rem;">
                ${routeReviewsHtml || `<p style="color:var(--text-muted); font-size:0.88rem; font-style:italic;">${t('modalNoReviews')}</p>`}
            </div>

            <!-- Add Route Review Form Card -->
            <div class="review-form-card" style="background:rgba(255,183,0,0.04); border:1px solid rgba(255,183,0,0.25); padding:1.1rem; border-radius:var(--radius-md);">
                <h4 style="font-family:var(--font-heading); color:var(--text-main); font-size:1.02rem; margin-bottom:0.8rem; display:flex; align-items:center; gap:0.5rem;">
                    <i class="fa-solid fa-pen-to-square" style="color:var(--primary);"></i> ${t('addRouteReviewTitle')}
                </h4>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.8rem; margin-bottom:0.8rem;">
                    <div class="form-group">
                        <label class="form-label">${t('userNameLabel')}</label>
                        <input type="text" id="routeReviewName" class="form-input" value="${defaultUserName}" placeholder="${t('userNamePlaceholder')}" />
                    </div>
                    <div class="form-group">
                        <label class="form-label">${t('bikeModelLabel')}</label>
                        <input type="text" id="routeReviewBike" class="form-input" value="${defaultBikeModel}" placeholder="${t('bikeModelPlaceholder')}" />
                    </div>
                </div>

                ${createStarPickerHTML(routePickerId, 9.5)}

                <div class="form-group" style="margin-top:0.8rem; margin-bottom:1rem;">
                    <label class="form-label">${t('yourReviewLabel')}</label>
                    <textarea id="routeReviewComment" class="form-textarea" rows="3" placeholder="${t('yourReviewPlaceholder')}"></textarea>
                </div>

                <button class="btn btn-primary" style="width:100%; justify-content:center; padding:0.7rem;" onclick="submitRouteReviewForm('${route.id}')">
                    <i class="fa-solid fa-paper-plane"></i> ${t('submitReviewBtn')}
                </button>
            </div>
        </div>
    `;

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeRouteReviewModal() {
    const modal = document.getElementById("routeReviewModalBackdrop");
    if (modal) modal.classList.remove("active");
    document.body.style.overflow = "";
}

function openRouteBuilderModal() {
    const modal = document.getElementById("builderModalBackdrop");
    if (!modal) return;
    modal.classList.add("active");
    document.body.style.overflow = "hidden";

    setTimeout(() => {
        if (typeof builderMap !== "undefined" && builderMap) {
            builderMap.invalidateSize();
        }
    }, 150);

    setTimeout(() => {
        if (typeof builderMap !== "undefined" && builderMap) {
            builderMap.invalidateSize();
        }
    }, 400);
}

function closeRouteBuilderModal() {
    const modal = document.getElementById("builderModalBackdrop");
    if (modal) {
        modal.classList.remove("active");
    }
    document.body.style.overflow = "";
}

function openRouteModal(routeId) {
    const routes = getStoredRoutes();
    const route = routes.find(r => r.id === routeId);
    if (!route) return;

    const modal = document.getElementById("modalBackdrop");
    const container = document.getElementById("modalContainer");

    if (!modal || !container) return;

    const isEn = (currentLang === "en");
    const title = isEn ? (route.titleEn || route.title) : route.title;
    const tagline = isEn ? (route.taglineEn || route.tagline) : route.tagline;
    const country = isEn ? (route.countryEn || route.country) : route.country;
    const caution = isEn ? (route.cautionNoteEn || route.cautionNote) : route.cautionNote;

    const overallRouteRating = getRouteAverageRating(route);
    const overallRouteStarsHtml = getStarRatingHtml(overallRouteRating, 10);
    const totalRouteReviewsCount = route.reviews ? route.reviews.length : 0;

    // Pitstops rendering with 10-star ratings & individual pitstop review forms
    const pitstopsHtml = (route.pitstops || []).map((pit, pIdx) => {
        const pitTitle = isEn ? (pit.titleEn || pit.title) : pit.title;
        const pitDesc = isEn ? (pit.descEn || pit.desc) : pit.desc;
        const pitAvg = getPitstopAverageRating(pit);
        const pitStarsHtml = getStarRatingHtml(pitAvg, 10);
        const pitReviews = pit.reviews || [];
        const pitPickerId = `pit_picker_${route.id}_${pIdx}`;

        const pitReviewsListHtml = pitReviews.map(pr => `
            <div class="pitstop-review-item">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
                    <strong style="color:var(--text-main); font-size:0.88rem;">${pr.userName}</strong>
                    <div style="display:flex; align-items:center; gap:0.4rem;">
                        ${getStarRatingHtml(pr.rating, 10)}
                        <button class="btn-review-delete" onclick="deletePitstopReview('${route.id}', ${pIdx}, '${pr.id}')" title="${isEn ? 'Delete Review' : 'Değerlendirmeyi Sil'}">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>
                <p style="font-size:0.82rem; color:var(--text-muted); margin:2px 0;">${isEn ? (pr.commentEn || pr.comment) : pr.comment}</p>
                <span style="font-size:0.7rem; color:var(--text-dim);">${pr.date}</span>
            </div>
        `).join('');

        return `
            <div class="pitstop-card-item">
                <div style="display:flex; gap:1rem; align-items:flex-start;">
                    <div style="width:48px; height:48px; background:rgba(255,183,0,0.15); border:1px solid #ffb700; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:1.5rem; flex-shrink:0;">
                        ${pit.icon || '☕'}
                    </div>
                    <div style="flex:1;">
                        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:0.4rem;">
                            <strong style="color:var(--text-main); font-family:var(--font-heading); font-size:1.05rem;">${pitTitle}</strong>
                            <div style="display:flex; align-items:center; gap:0.4rem;">
                                ${pitStarsHtml}
                            </div>
                        </div>
                        <p style="font-size:0.85rem; color:var(--text-muted); margin-top:4px;">${pitDesc}</p>
                        
                        <div style="margin-top:0.6rem; display:flex; justify-content:space-between; align-items:center;">
                            <span style="font-size:0.78rem; color:var(--accent-gold); font-weight:600;">
                                <i class="fa-solid fa-comments"></i> ${pitReviews.length} ${t('reviewsCountText')}
                            </span>
                            <button class="btn btn-secondary" style="padding:0.35rem 0.8rem; font-size:0.78rem;" onclick="togglePitstopReviewForm('${route.id}', ${pIdx})">
                                <i class="fa-solid fa-star" style="color:var(--accent-gold);"></i> ${t('ratePitstopBtn')}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Collapsible Pitstop Review & Rating Box -->
                <div class="pitstop-review-box" id="pitstopReviewBox_${route.id}_${pIdx}">
                    <div style="border-top:1px dashed var(--border-glass); margin-top:0.8rem; padding-top:0.8rem;">
                        <h5 style="font-family:var(--font-heading); color:var(--accent-gold); font-size:0.95rem; margin-bottom:0.6rem;">
                            <i class="fa-solid fa-mug-hot"></i> ${pitTitle} - ${t('addPitstopReviewTitle')}
                        </h5>
                        
                        ${pitReviews.length > 0 ? `
                            <div style="margin-bottom:1rem; display:flex; flex-direction:column; gap:0.5rem;">
                                ${pitReviewsListHtml}
                            </div>
                        ` : `<p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:0.8rem;">${t('noPitstopReviews')}</p>`}

                        <!-- Pitstop Review Form -->
                        <div class="review-form-card">
                            <div class="form-group" style="margin-bottom:0.6rem;">
                                <label class="form-label">${t('userNameLabel')}</label>
                                <input type="text" id="pitUserName_${route.id}_${pIdx}" class="form-input" placeholder="${t('userNamePlaceholder')}" />
                            </div>

                            ${createStarPickerHTML(pitPickerId, 9.5)}

                            <div class="form-group" style="margin-top:0.6rem; margin-bottom:0.6rem;">
                                <label class="form-label">${t('yourReviewLabel')}</label>
                                <textarea id="pitComment_${route.id}_${pIdx}" class="form-textarea" rows="2" placeholder="${t('yourReviewPlaceholder')}"></textarea>
                            </div>

                            <button class="btn btn-primary" style="padding:0.45rem 1.1rem; font-size:0.85rem; width:100%; justify-content:center;" onclick="submitPitstopReviewForm('${route.id}', ${pIdx})">
                                ${t('submitReviewBtn')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Route Reviews HTML
    const routeReviewsHtml = (route.reviews || []).map(rev => `
        <div class="route-review-card">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
                <div>
                    <strong style="color:var(--text-main); font-family:var(--font-heading); font-size:1rem;">${rev.userName}</strong>
                    <span style="font-size:0.8rem; color:var(--primary); margin-left:6px;">(${rev.bike})</span>
                </div>
                <div style="display:flex; align-items:center; gap:0.6rem;">
                    ${getStarRatingHtml(rev.rating, 10)}
                    <button class="btn-review-delete" onclick="deleteRouteReview('${route.id}', '${rev.id}')" title="${isEn ? 'Delete Review' : 'Değerlendirmeyi Sil'}">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </div>
            <p style="font-size:0.9rem; color:var(--text-muted); line-height:1.5;">${isEn ? (rev.commentEn || rev.comment) : rev.comment}</p>
            <span style="font-size:0.75rem; color:var(--text-dim); display:block; margin-top:0.5rem;"><i class="fa-regular fa-clock"></i> ${rev.date}</span>
        </div>
    `).join('');

    const galleryHtml = (route.gallery || [route.image]).map((img, idx) => `
        <img src="${img}" class="gallery-thumb ${idx === 0 ? 'active' : ''}" onclick="switchModalMainImage('${img}', this)" alt="Gallery ${idx + 1}" />
    `).join('');

    const svgChart = renderElevationSVG(route.elevationProfile);
    const routePickerId = `route_picker_${route.id}`;

    container.innerHTML = `
        <div class="modal-header">
            <img src="${route.image}" class="modal-header-img" id="modalMainImg" alt="${title}" />
            <button class="modal-close-btn" onclick="closeRouteModal()"><i class="fa-solid fa-xmark"></i></button>
            <div class="modal-header-overlay">
                <div style="display:flex; gap:0.5rem; margin-bottom:0.5rem; flex-wrap:wrap;">
                    ${route.socialTag ? `<span class="badge" style="background:linear-gradient(135deg, #e1306c, #f77737); color:#fff;">${route.socialTag}</span>` : ''}
                    <span class="badge" style="background:var(--primary); color:#fff;">${country}</span>
                    <span class="badge badge-difficulty-${route.difficulty}">${isEn ? (route.difficultyEn || route.difficulty) : route.difficulty}</span>
                </div>
                <h2 style="font-family:var(--font-heading); font-size:2rem; font-weight:800; color:#fff;">${title}</h2>
                <p style="color:var(--text-muted); font-size:0.95rem;">${tagline}</p>
            </div>
        </div>

        <div class="modal-content">
            ${route.gallery && route.gallery.length > 1 ? `
                <div style="display:flex; gap:0.6rem; margin: 1.2rem 0; overflow-x:auto; padding-bottom:4px;">
                    ${galleryHtml}
                </div>
            ` : ''}

            ${caution ? `<div class="caution-box">${caution}</div>` : ''}

            <!-- Overall Route Score Header Card -->
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; background:linear-gradient(135deg, rgba(255,183,0,0.1), rgba(255,107,0,0.05)); border:1px solid rgba(255,183,0,0.3); padding:1rem 1.4rem; border-radius:var(--radius-md); margin-bottom:1.5rem;">
                <div>
                    <span style="font-size:0.8rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; font-weight:700;">Rotanın 10 Yıldız Genel Puanı</span>
                    <div style="display:flex; align-items:center; gap:0.8rem; margin-top:4px;">
                        ${overallRouteStarsHtml}
                    </div>
                </div>
                <div style="text-align:right;">
                    <span style="font-size:1.4rem; font-weight:900; color:var(--accent-gold); font-family:var(--font-heading);">${overallRouteRating.toFixed(1)} / 10 ⭐</span>
                    <span style="display:block; font-size:0.8rem; color:var(--text-muted);">${totalRouteReviewsCount} ${t('reviewsCountText')}</span>
                </div>
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:1rem; margin-bottom:2rem; background:var(--bg-dark); padding:1.2rem; border-radius:var(--radius-md); border:1px solid var(--border-glass);">
                <div>
                    <span style="font-size:0.78rem; color:var(--text-dim);">${t('modalDistance')}</span>
                    <div style="font-family:var(--font-heading); font-weight:800; font-size:1.2rem; color:var(--text-main);">${route.distanceKm} km</div>
                </div>
                <div>
                    <span style="font-size:0.78rem; color:var(--text-dim);">${t('modalTurnCount')}</span>
                    <div style="font-family:var(--font-heading); font-weight:800; font-size:1.2rem; color:var(--primary);">${route.turnCount} ${isEn ? 'Corners' : 'Viraj'}</div>
                </div>
                <div>
                    <span style="font-size:0.78rem; color:var(--text-dim);">${t('modalTerrain')}</span>
                    <div style="font-family:var(--font-heading); font-weight:800; font-size:1.1rem; color:var(--accent-green);">${isEn ? (route.terrainTypeEn || route.terrainType) : route.terrainType}</div>
                </div>
                <div>
                    <span style="font-size:0.78rem; color:var(--text-dim);">${t('modalPitstops')}</span>
                    <div style="font-family:var(--font-heading); font-weight:800; font-size:1.2rem; color:var(--accent-gold);">${route.pitstops ? route.pitstops.length + (isEn ? ' Pitstops' : ' Mekan') : 'Mevcut'}</div>
                </div>
            </div>

            <!-- Route Leaderboard & Ride Time Logging Section -->
            <div class="modal-section">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.8rem; margin-bottom:1rem; border-bottom:1px solid var(--border-glass); padding-bottom:0.5rem;">
                    <h4 class="modal-section-title" style="margin-bottom:0; border-bottom:none; padding-bottom:0;">
                        <i class="fa-solid fa-trophy" style="color:var(--accent-gold);"></i> ${isEn ? 'Fastest Riders & Ride Times' : 'En Hızlı Sürücüler & Sürüş Süreleri (Liderlik Tablosu)'}
                    </h4>
                    <button class="btn btn-primary" style="padding:0.45rem 1rem; font-size:0.85rem;" onclick="openLogRideModal('${route.id}')">
                        <i class="fa-solid fa-stopwatch"></i> ${isEn ? 'Log Ride Time' : '⏱️ Sürüş Süreni Kaydet'}
                    </button>
                </div>
                <div class="route-leaderboard-list">
                    ${(function() {
                        const routeLogs = (typeof getRouteLeaderboard === "function") ? getRouteLeaderboard(route.id) : [];
                        if (routeLogs.length === 0) {
                            return `<p style="color:var(--text-muted); font-size:0.88rem; padding:0.5rem 0;">${isEn ? 'No recorded ride times for this route yet. Be the first rider to log your time!' : 'Bu rota için henüz süre kaydı yapılmadı. Sürenizi ilk kaydeden sürücü siz olun!'}</p>`;
                        }
                        return routeLogs.map((log, lIdx) => {
                            let rankBadge = `#${lIdx + 1}`;
                            if (lIdx === 0) rankBadge = '🥇 1.';
                            if (lIdx === 1) rankBadge = '🥈 2.';
                            if (lIdx === 2) rankBadge = '🥉 3.';

                            return `
                                <div class="route-leaderboard-row">
                                    <div style="display:flex; align-items:center; gap:0.8rem;">
                                        <span style="font-family:var(--font-heading); font-weight:900; font-size:1.1rem; color:var(--primary); min-width:36px;">${rankBadge}</span>
                                        <div>
                                            <strong style="color:var(--text-main); font-size:0.92rem; display:block;">${log.userName}</strong>
                                            <small style="color:var(--text-muted); font-size:0.78rem;">${log.bikeModel} • ${log.date}</small>
                                        </div>
                                    </div>
                                    <div style="text-align:right;">
                                        <span style="font-family:var(--font-heading); font-weight:800; font-size:1.1rem; color:var(--accent-gold); display:block;">⏱️ ${log.durationFormatted}</span>
                                        <small style="color:var(--accent-green); font-weight:700; font-size:0.75rem;">+${log.pointsEarned} XP Puan</small>
                                    </div>
                                </div>
                            `;
                        }).join('');
                    })()}
                </div>
            </div>

            <!-- Pitstops Section with Individual Pitstop Star Ratings -->
            <div class="modal-section">
                <h4 class="modal-section-title"><i class="fa-solid fa-mug-hot" style="color:var(--accent-gold);"></i> ${t('modalPitstopTitle')}</h4>
                <div style="display:flex; flex-direction:column; gap:0.8rem;">
                    ${pitstopsHtml || `<p style="color:var(--text-muted); font-size:0.9rem;">${isEn ? 'Pitstops listed for this route...' : 'Bu rotada önerilen mekanlar listeleniyor...'}</p>`}
                </div>
            </div>

            <div class="modal-section">
                <h4 class="modal-section-title"><i class="fa-solid fa-chart-area"></i> ${t('modalElevationTitle')}</h4>
                <div class="elevation-chart-container">
                    ${svgChart}
                </div>
            </div>

            <div class="modal-section" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
                <div>
                    <span style="font-size:0.85rem; color:var(--text-muted); display:block; margin-bottom:0.3rem;">${t('modalRecommendedBikes')}</span>
                    <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
                        ${(route.recommendedBikes || []).map(b => `<span style="background:rgba(255,107,0,0.15); color:var(--primary); border:1px solid rgba(255,107,0,0.3); padding:0.25rem 0.7rem; border-radius:6px; font-size:0.82rem; font-weight:600;">${b}</span>`).join('')}
                    </div>
                </div>
                <div style="display:flex; gap:0.6rem; flex-wrap:wrap;">
                    <button class="btn btn-secondary" onclick="focusRouteOnMap('${route.id}'); closeRouteModal();">
                        <i class="fa-solid fa-map-location-dot"></i> ${t('modalFocusMapBtn')}
                    </button>
                    <button class="btn btn-primary" onclick="downloadGPX('${route.id}')">
                        <i class="fa-solid fa-file-arrow-down"></i> ${t('modalDownloadGpxBtn')}
                    </button>
                    <button class="btn btn-danger-action" onclick="deleteRoute('${route.id}', event)">
                        <i class="fa-solid fa-trash-can"></i> ${isEn ? 'Delete Route' : 'Rotayı Sil'}
                    </button>
                </div>
            </div>

            <!-- Route Reviews & Rating Section (inline, original style) -->
            <div class="modal-section">
                <h4 class="modal-section-title">
                    <i class="fa-solid fa-star" style="color:var(--accent-gold);"></i> ${isEn ? 'Rider Reviews & 10-Star Ratings' : 'Sürücü Değerlendirmeleri & 10 Yıldız Puanları'}
                    <span style="font-size:0.85rem; font-weight:400; color:var(--text-muted); margin-left:0.5rem;">(${totalRouteReviewsCount} ${t('reviewsCountText')})</span>
                </h4>

                <div style="display:flex; flex-direction:column; gap:0.6rem; margin-bottom:1.2rem;">
                    ${routeReviewsHtml || `<p style="color:var(--text-muted); font-size:0.88rem; font-style:italic;">${t('modalNoReviews')}</p>`}
                </div>

                <!-- Add Route Review Form -->
                <div class="review-form-card">
                    <h4 style="font-family:var(--font-heading); color:var(--text-main); font-size:1rem; margin-bottom:0.8rem; display:flex; align-items:center; gap:0.5rem;">
                        <i class="fa-solid fa-pen-to-square" style="color:var(--primary);"></i> ${t('addRouteReviewTitle')}
                    </h4>

                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.8rem; margin-bottom:0.8rem;">
                        <div class="form-group">
                            <label class="form-label">${t('userNameLabel')}</label>
                            <input type="text" id="routeReviewName" class="form-input" placeholder="${t('userNamePlaceholder')}" />
                        </div>
                        <div class="form-group">
                            <label class="form-label">${t('bikeModelLabel')}</label>
                            <input type="text" id="routeReviewBike" class="form-input" placeholder="${t('bikeModelPlaceholder')}" />
                        </div>
                    </div>

                    ${createStarPickerHTML(routePickerId, 9.5)}

                    <div class="form-group" style="margin-top:0.8rem; margin-bottom:1rem;">
                        <label class="form-label">${t('yourReviewLabel')}</label>
                        <textarea id="routeReviewComment" class="form-textarea" rows="3" placeholder="${t('yourReviewPlaceholder')}"></textarea>
                    </div>

                    <button class="btn btn-primary" style="width:100%; justify-content:center; padding:0.7rem;" onclick="submitRouteReviewInModal('${route.id}')">
                        <i class="fa-solid fa-paper-plane"></i> ${t('submitReviewBtn')}
                    </button>
                </div>
            </div>
        </div>
    `;

    modal.classList.add("active");
}

/* 10-Star Interactive Star Picker Widget Functions */
function createStarPickerHTML(pickerId, initialRating = 9.5) {
    return `
        <div class="star-picker-widget" id="widget_${pickerId}" data-value="${initialRating}">
            <label class="form-label" style="margin-bottom:0.4rem; color:var(--text-main); font-weight:700; display:flex; align-items:center; gap:0.4rem;">
                <i class="fa-solid fa-star text-gold"></i> ${t('starRatingLabel')}
            </label>

            <div class="star-picker-flex">
                <div class="star-picker-stars" id="stars_container_${pickerId}" 
                     onmousemove="handleStarPickerMouseMove(event, '${pickerId}')" 
                     onmouseleave="handleStarPickerMouseLeave('${pickerId}')"
                     onclick="handleStarPickerClick(event, '${pickerId}')">
                    ${generatePickerStarsMarkup(initialRating)}
                </div>
                <span class="star-picker-badge" id="badge_${pickerId}">
                    <strong id="score_${pickerId}">${initialRating.toFixed(1)}</strong> / 10 ⭐
                </span>
            </div>

            <div style="margin-top:0.4rem; display:flex; align-items:center; gap:0.8rem;">
                <input type="range" min="0.5" max="10.0" step="0.5" value="${initialRating}" 
                       class="star-picker-slider" id="slider_${pickerId}" 
                       oninput="handleStarSliderChange('${pickerId}', this.value)" />
            </div>
            <p class="star-picker-hint">${t('halfStarTip')}</p>
        </div>
    `;
}

function generatePickerStarsMarkup(scoreVal) {
    const score = Math.max(0.5, Math.min(10, parseFloat(scoreVal) || 9.5));
    let html = '';
    for (let i = 1; i <= 10; i++) {
        if (score >= i) {
            html += `<i class="fa-solid fa-star star-pick-icon star-full" data-star="${i}"></i>`;
        } else if (score >= i - 0.5) {
            html += `<i class="fa-solid fa-star-half-stroke star-pick-icon star-half" data-star="${i}"></i>`;
        } else {
            html += `<i class="fa-regular fa-star star-pick-icon star-empty" data-star="${i}"></i>`;
        }
    }
    return html;
}

function handleStarSliderChange(pickerId, val) {
    const floatVal = Math.round(parseFloat(val) * 2) / 2;
    updateStarPickerUI(pickerId, floatVal);
}

function handleStarPickerMouseMove(event, pickerId) {
    const container = document.getElementById(`stars_container_${pickerId}`);
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const width = rect.width;
    let ratio = Math.max(0, Math.min(1, mouseX / width));
    let rawScore = ratio * 10;
    let roundedScore = Math.max(0.5, Math.min(10, Math.ceil(rawScore * 2) / 2));
    
    const scoreEl = document.getElementById(`score_${pickerId}`);
    if (container) {
        container.innerHTML = generatePickerStarsMarkup(roundedScore);
    }
    if (scoreEl) scoreEl.textContent = roundedScore.toFixed(1);
}

function handleStarPickerMouseLeave(pickerId) {
    const widget = document.getElementById(`widget_${pickerId}`);
    if (!widget) return;
    const currentVal = parseFloat(widget.getAttribute("data-value")) || 9.5;
    updateStarPickerUI(pickerId, currentVal);
}

function handleStarPickerClick(event, pickerId) {
    const container = document.getElementById(`stars_container_${pickerId}`);
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const width = rect.width;
    let ratio = Math.max(0, Math.min(1, mouseX / width));
    let rawScore = ratio * 10;
    let roundedScore = Math.max(0.5, Math.min(10, Math.ceil(rawScore * 2) / 2));
    
    updateStarPickerUI(pickerId, roundedScore);
}

function updateStarPickerUI(pickerId, score) {
    const widget = document.getElementById(`widget_${pickerId}`);
    const starsContainer = document.getElementById(`stars_container_${pickerId}`);
    const scoreEl = document.getElementById(`score_${pickerId}`);
    const slider = document.getElementById(`slider_${pickerId}`);

    if (widget) widget.setAttribute("data-value", score);
    if (starsContainer) starsContainer.innerHTML = generatePickerStarsMarkup(score);
    if (scoreEl) scoreEl.textContent = score.toFixed(1);
    if (slider) slider.value = score;
}

function togglePitstopReviewForm(routeId, pitstopIdx) {
    const box = document.getElementById(`pitstopReviewBox_${routeId}_${pitstopIdx}`);
    if (box) {
        box.classList.toggle("open");
    }
}

function submitPitstopReviewForm(routeId, pitstopIdx) {
    const nameInput = document.getElementById(`pitUserName_${routeId}_${pitstopIdx}`);
    const commentInput = document.getElementById(`pitComment_${routeId}_${pitstopIdx}`);
    const widget = document.getElementById(`widget_pit_picker_${routeId}_${pitstopIdx}`);

    const userName = nameInput ? nameInput.value.trim() : "";
    const comment = commentInput ? commentInput.value.trim() : "";
    const rating = widget ? (parseFloat(widget.getAttribute("data-value")) || 9.5) : 9.5;

    if (!userName || !comment) {
        alert(currentLang === 'en' ? "Please enter your name and comment for the pitstop." : "Lütfen adınızı ve mola mekanı yorumunuzu giriniz.");
        return;
    }

    const isEn = (currentLang === "en");
    const dateStr = new Date().toLocaleDateString(isEn ? 'en-US' : 'tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });

    const reviewObj = {
        id: "pr_user_" + Date.now(),
        userName: userName,
        rating: rating,
        date: dateStr,
        comment: comment,
        commentEn: comment
    };

    savePitstopReview(routeId, pitstopIdx, reviewObj);
    alert(t('ratingSavedSuccess'));
    openRouteModal(routeId);
    refreshAppRoutes();
}

function submitRouteReviewForm(routeId) {
    const nameInput = document.getElementById("routeReviewName");
    const bikeInput = document.getElementById("routeReviewBike");
    const commentInput = document.getElementById("routeReviewComment");
    const widget = document.getElementById(`widget_route_picker_${routeId}`);

    const userName = nameInput ? nameInput.value.trim() : "";
    const bike = bikeInput ? bikeInput.value.trim() : "";
    const comment = commentInput ? commentInput.value.trim() : "";
    const rating = widget ? (parseFloat(widget.getAttribute("data-value")) || 9.5) : 9.5;

    if (!userName || !comment) {
        alert(currentLang === 'en' ? "Please enter your name and comment." : "Lütfen adınızı ve yorumunuzu giriniz.");
        return;
    }

    const isEn = (currentLang === "en");
    const dateStr = new Date().toLocaleDateString(isEn ? 'en-US' : 'tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });

    const reviewObj = {
        id: "r_user_" + Date.now(),
        userName: userName,
        bike: bike || (isEn ? "Rider" : "Motosiklet Sürücüsü"),
        rating: rating,
        date: dateStr,
        comment: comment,
        commentEn: comment
    };

    saveRouteReview(routeId, reviewObj);

    if (typeof getCurrentUser === "function" && getCurrentUser() && typeof addXP === "function") {
        addXP(20);
    }

    alert(t('ratingSavedSuccess'));
    openRouteReviewModal(routeId);
    refreshAppRoutes();
}

// Detay modalı içindeki değerlendirme formu için gönderme fonksiyonu
function submitRouteReviewInModal(routeId) {
    const nameInput = document.getElementById("routeReviewName");
    const bikeInput = document.getElementById("routeReviewBike");
    const commentInput = document.getElementById("routeReviewComment");
    const widget = document.getElementById(`widget_route_picker_${routeId}`);

    const userName = nameInput ? nameInput.value.trim() : "";
    const bike = bikeInput ? bikeInput.value.trim() : "";
    const comment = commentInput ? commentInput.value.trim() : "";
    const rating = widget ? (parseFloat(widget.getAttribute("data-value")) || 9.5) : 9.5;

    if (!userName || !comment) {
        alert(currentLang === 'en' ? "Please enter your name and comment." : "Lütfen adınızı ve yorumunuzu giriniz.");
        return;
    }

    const isEn = (currentLang === "en");
    const dateStr = new Date().toLocaleDateString(isEn ? 'en-US' : 'tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });

    const reviewObj = {
        id: "r_user_" + Date.now(),
        userName: userName,
        bike: bike || (isEn ? "Rider" : "Motosiklet Sürücüsü"),
        rating: rating,
        date: dateStr,
        comment: comment,
        commentEn: comment
    };

    saveRouteReview(routeId, reviewObj);

    if (typeof getCurrentUser === "function" && getCurrentUser() && typeof addXP === "function") {
        addXP(20);
    }

    alert(t('ratingSavedSuccess'));
    // Detay modalını tazelemek için yeniden aç
    openRouteModal(routeId);
    refreshAppRoutes();
}

function switchModalMainImage(src, thumbEl) {
    const mainImg = document.getElementById("modalMainImg");
    if (mainImg) mainImg.src = src;

    document.querySelectorAll(".gallery-thumb").forEach(t => t.classList.remove("active"));
    if (thumbEl) thumbEl.classList.add("active");
}

function closeRouteModal() {
    const modal = document.getElementById("modalBackdrop");
    if (modal) modal.classList.remove("active");
}

function renderElevationSVG(profile) {
    if (!profile || profile.length < 2) {
        return '<div style="display:flex; align-items:center; justify-content:center; height:100%; color:var(--text-dim);">Profile data loading...</div>';
    }

    const width = 800;
    const height = 90;
    const padding = 12;

    const maxDist = profile[profile.length - 1][0];
    const maxElev = Math.max(...profile.map(p => p[1]), 100);

    const points = profile.map(p => {
        const x = padding + (p[0] / maxDist) * (width - 2 * padding);
        const y = height - padding - (p[1] / maxElev) * (height - 2 * padding);
        return `${x},${y}`;
    }).join(' ');

    const areaPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;

    return `
        <svg viewBox="0 0 ${width} ${height}" style="width:100%; height:100%; overflow:visible;">
            <defs>
                <linearGradient id="elevGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#ff6b00" stop-opacity="0.4"/>
                    <stop offset="100%" stop-color="#ff6b00" stop-opacity="0.0"/>
                </linearGradient>
            </defs>
            <polygon points="${areaPoints}" fill="url(#elevGrad)" />
            <polyline points="${points}" fill="none" stroke="#ff6b00" stroke-width="2.5" stroke-linecap="round" />
            ${profile.map(p => {
        const x = padding + (p[0] / maxDist) * (width - 2 * padding);
        const y = height - padding - (p[1] / maxElev) * (height - 2 * padding);
        return `<circle cx="${x}" cy="${y}" r="3" fill="#ffffff" stroke="#ff6b00" stroke-width="2" />
                        <text x="${x}" y="${y - 6}" fill="#94a3b8" font-size="9" text-anchor="middle" font-family="Inter">${p[1]}m</text>`;
    }).join('')}
        </svg>
    `;
}
