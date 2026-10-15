/**
 * RotaMoto - Üye Sürüş Sıralaması (Motor Türüne Göre)
 * Rota bazlı sürüş süresi & XP puan sıralaması
 * Sadece avatar logosu gösterilir, isim yazılmaz.
 */

function getRiderAvatar(userId, bikeModel) {
    if (typeof getAllUsers === "function") {
        const users = getAllUsers();
        const user = users.find(u => u.id === userId);
        if (user && user.avatar) return user.avatar;
    }
    // Motor modeline göre varsayılan avatar
    const bike = (bikeModel || "").toLowerCase();
    if (bike.includes("r1") || bike.includes("cbr") || bike.includes("zx") || bike.includes("rsv") || bike.includes("panigale") || bike.includes("gsxr")) return "assets/racing_bike.jpg";
    if (bike.includes("ktm") || bike.includes("exc") || bike.includes("crf") || bike.includes("wr") || bike.includes("450") || bike.includes("enduro")) return "assets/cross_bike.jpg";
    if (bike.includes("gs") || bike.includes("tiger") || bike.includes("africa") || bike.includes("adventure") || bike.includes("vstrom")) return "assets/adventure_bike.jpg";
    return "assets/naked_bike.jpg";
}

function renderMemberReviews(filterCat) {
    const grid = document.getElementById("memberReviewsGrid");
    if (!grid) return;

    const allRoutes = typeof getStoredRoutes === "function" ? getStoredRoutes() : [];
    const allLogs = typeof getAllRideLogs === "function" ? getAllRideLogs() : [];

    // Filtre: seçilen motor türündeki rotaları bul
    const filteredRoutes = (filterCat === "all")
        ? allRoutes
        : allRoutes.filter(r => r.bikeCategory === filterCat);

    // Her rota için en iyi sürüş loglarını al
    const routeBlocks = [];
    filteredRoutes.forEach(route => {
        const routeLogs = allLogs
            .filter(log => log.routeId === route.id)
            .sort((a, b) => a.durationMinutes - b.durationMinutes); // en hızlıdan yavaşa
        if (routeLogs.length > 0) {
            routeBlocks.push({ route, logs: routeLogs });
        }
    });

    if (routeBlocks.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-glass);">
                <i class="fa-solid fa-stopwatch" style="font-size: 2.5rem; margin-bottom: 1rem; color: var(--primary); display: block;"></i>
                <p style="font-size: 0.95rem;">Bu motor türü için henüz sürüş süresi kaydı bulunmuyor.</p>
            </div>
        `;
        return;
    }

    const catColors = {
        "touring-chopper": { accent: "#ff6b00", glow: "rgba(255,107,0,0.18)", icon: "fa-motorcycle" },
        "racing":          { accent: "#d50000", glow: "rgba(213,0,0,0.18)",   icon: "fa-gauge-high" },
        "cross-enduro":    { accent: "#2e7d32", glow: "rgba(46,125,50,0.18)", icon: "fa-mountain" },
        "adventure":       { accent: "#0288d1", glow: "rgba(2,136,209,0.18)", icon: "fa-compass" }
    };

    const rankMedals = ["🥇", "🥈", "🥉"];

    grid.innerHTML = routeBlocks.map(({ route, logs }) => {
        const bikeCategory = route.bikeCategory || "touring-chopper";
        const { accent, glow, icon } = catColors[bikeCategory] || catColors["touring-chopper"];
        const routeTitle = (typeof currentLang !== "undefined" && currentLang === "en")
            ? (route.titleEn || route.title) : route.title;

        const rowsHtml = logs.slice(0, 5).map((log, idx) => {
            const avatarSrc = getRiderAvatar(log.userId, log.bikeModel);
            const medal = rankMedals[idx] || `#${idx + 1}`;
            const isFirst = idx === 0;

            return `
                <div style="
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.65rem 0.8rem;
                    border-radius: var(--radius-sm);
                    background: ${isFirst ? glow : 'transparent'};
                    border: 1px solid ${isFirst ? accent + '55' : 'transparent'};
                    transition: background 0.2s;
                " onmouseenter="this.style.background='${glow}'" onmouseleave="this.style.background='${isFirst ? glow : 'transparent'}'">

                    <!-- Sıralama -->
                    <span style="font-size: ${isFirst ? '1.3rem' : '1rem'}; min-width: 28px; text-align: center; line-height: 1;">
                        ${medal}
                    </span>

                    <!-- Sadece Avatar (isim yok) -->
                    <div style="position: relative; flex-shrink: 0;">
                        <img src="${avatarSrc}" alt="Sürücü" style="
                            width: ${isFirst ? '42px' : '34px'};
                            height: ${isFirst ? '42px' : '34px'};
                            border-radius: 50%;
                            border: 2px solid ${isFirst ? accent : 'var(--border-glass)'};
                            object-fit: cover;
                            display: block;
                            transition: all 0.2s;
                            box-shadow: ${isFirst ? '0 0 10px ' + glow : 'none'};
                        " />
                    </div>

                    <!-- Süre & XP -->
                    <div style="flex: 1; min-width: 0;">
                        <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                            <span style="font-family: var(--font-heading); font-weight: 800; font-size: ${isFirst ? '1rem' : '0.88rem'}; color: ${isFirst ? accent : 'var(--text-main)'};">
                                ⏱️ ${log.durationFormatted}
                            </span>
                            <span style="font-size: 0.75rem; font-weight: 700; color: var(--accent-gold); background: rgba(255,183,0,0.12); border: 1px solid rgba(255,183,0,0.25); padding: 1px 7px; border-radius: 1rem;">
                                +${log.pointsEarned} XP
                            </span>
                        </div>
                        <div style="font-size: 0.72rem; color: var(--text-dim); margin-top: 1px;">
                            🏍️ ${log.bikeModel} · ${log.date}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="member-review-card" style="
                background: var(--bg-card);
                border: 1px solid var(--border-glass);
                border-top: 3px solid ${accent};
                border-radius: var(--radius-md);
                overflow: hidden;
                transition: transform 0.2s, box-shadow 0.2s;
            " onmouseenter="this.style.transform='translateY(-3px)';this.style.boxShadow='0 10px 36px ${glow}'" onmouseleave="this.style.transform='';this.style.boxShadow=''">

                <!-- Rota Başlığı -->
                <div style="padding: 0.9rem 1rem 0.7rem; background: linear-gradient(135deg, ${glow}, transparent); border-bottom: 1px solid var(--border-glass);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.3rem;">
                        <i class="fa-solid ${icon}" style="color: ${accent}; font-size: 0.85rem;"></i>
                        <span style="font-size: 0.72rem; font-weight: 700; color: ${accent}; text-transform: uppercase; letter-spacing: 0.5px;">
                            ${route.bikeCategoryName || 'Motosiklet'}
                        </span>
                    </div>
                    <button onclick="openRouteModal('${route.id}')" style="
                        background: none; border: none; padding: 0;
                        font-family: var(--font-heading); font-weight: 800;
                        font-size: 0.98rem; color: var(--text-main);
                        cursor: pointer; text-align: left; line-height: 1.3;
                        display: block; width: 100%;
                    " title="${routeTitle}">
                        ${routeTitle}
                    </button>
                    <div style="font-size: 0.75rem; color: var(--text-dim); margin-top: 3px;">
                        <i class="fa-solid fa-users"></i> ${logs.length} sürücü kaydı
                        · <i class="fa-solid fa-road"></i> ${route.distanceKm} km
                    </div>
                </div>

                <!-- Sıralama Listesi -->
                <div style="padding: 0.5rem 0.6rem; display: flex; flex-direction: column; gap: 0.2rem;">
                    ${rowsHtml}
                </div>
            </div>
        `;
    }).join('');
}

function filterMemberReviews(cat, btnEl) {
    document.querySelectorAll(".review-category-tab").forEach(btn => {
        btn.style.background = "transparent";
        btn.style.color = "var(--text-muted)";
        btn.style.borderColor = "var(--border-glass)";
        btn.style.fontWeight = "600";
    });
    if (btnEl) {
        btnEl.style.background = "var(--primary)";
        btnEl.style.color = "#fff";
        btnEl.style.borderColor = "var(--primary)";
        btnEl.style.fontWeight = "700";
    }
    renderMemberReviews(cat);
}
