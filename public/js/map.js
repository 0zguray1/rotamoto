/**
 * RotaMoto - Küresel Dünya Haritası & Canlı Mavi Rota Çizgileri (Neon Blue Lines)
 */
let mapInstance = null;
let activePolylines = [];
let activeMarkers = [];

function initMainMap() {
    const mapElement = document.getElementById("leafletMap");
    if (!mapElement) return;

    const worldBounds = L.latLngBounds(
        L.latLng(-85.0, -180.0),
        L.latLng(85.0, 180.0)
    );

    mapInstance = L.map("leafletMap", {
        center: [39.1, 35.2],
        zoom: 6,
        minZoom: 2,
        maxZoom: 18,
        worldCopyJump: false,
        maxBounds: worldBounds,
        maxBoundsViscosity: 1.0,
        zoomControl: true
    });

    setTimeout(() => {
        if (mapInstance) mapInstance.invalidateSize();
    }, 300);

    const osmLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
        noWrap: true
    });

    const topoLayer = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
        attribution: 'Map style: &copy; OpenTopoMap',
        maxZoom: 17,
        noWrap: true
    });

    const esriSatellite = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        attribution: 'Tiles &copy; Esri',
        noWrap: true
    });

    osmLayer.addTo(mapInstance);

    const baseMaps = {
        "🌐 Dünya Haritası": osmLayer,
        "🏔️ Dağ & Arazi (Cross/Enduro)": topoLayer,
        "🛰️ Uydu Görünümü": esriSatellite
    };

    L.control.layers(baseMaps, null, { position: 'topright' }).addTo(mapInstance);

    renderRoutesOnMap(getStoredRoutes());
}

function renderRoutesOnMap(routes) {
    if (!mapInstance) return;

    activePolylines.forEach(p => mapInstance.removeLayer(p));
    activeMarkers.forEach(m => mapInstance.removeLayer(m));
    activePolylines = [];
    activeMarkers = [];

    const bounds = L.latLngBounds();

    routes.forEach(route => {
        if (!route.coordinates || route.coordinates.length < 2) return;

        // HARİTADA ASLA KARIŞMAYAN CANLI ELEKTRİK MAVİ ROTA ÇİZGİSİ
        const mainPolylineColor = "#0066ff"; // Elektrik Mavi
        const polyGlowColor = "#00d2ff";     // Neon Parlama Mavi

        // Arka Dış Parlama Çizgisi (Glow Line)
        const outerPoly = L.polyline(route.coordinates, {
            color: polyGlowColor,
            weight: 10,
            opacity: 0.4,
            lineJoin: 'round'
        }).addTo(mapInstance);

        // Ana Keskin Mavi Rota Çizgisi
        const polyline = L.polyline(route.coordinates, {
            color: mainPolylineColor,
            weight: 6,
            opacity: 0.95,
            lineJoin: 'round'
        }).addTo(mapInstance);

        const isEn = (currentLang === "en");
        const title = isEn ? (route.titleEn || route.title) : route.title;
        const tagline = isEn ? (route.taglineEn || route.tagline) : route.tagline;
        const country = isEn ? (route.countryEn || route.country) : route.country;
        const btnText = isEn ? "View Details & Download GPX" : "Detayları & Mola Mekanlarını Gör";

        const routeAvgScore = typeof getRouteAverageRating === "function" ? getRouteAverageRating(route) : (route.curvatureRating || 9.0);
        const routeRevCount = route.reviews ? route.reviews.length : 0;

        polyline.bindPopup(`
            <div style="font-family: 'Inter', sans-serif; padding: 6px; min-width: 220px;">
                <div style="font-size: 0.75rem; font-weight: 700; color: #0066ff; margin-bottom: 2px;">
                    ${route.socialTag ? route.socialTag + ' • ' : ''}${route.bikeCategoryName}
                </div>
                <h4 style="margin:0 0 4px 0; color:#0f172a; font-family:'Outfit'; font-size:1.1rem; font-weight:800;">${title}</h4>
                <div style="color:#d97706; font-weight:800; font-size:0.85rem; margin-bottom:6px;">
                    ⭐ <strong>${routeAvgScore.toFixed(1)} / 10</strong> <span style="color:#64748b; font-size:0.75rem; font-weight:normal;">(${routeRevCount} ${isEn ? 'Reviews' : 'Değerlendirme'})</span>
                </div>
                <p style="margin:0 0 8px 0; font-size:0.85rem; color:#475569;">${tagline}</p>
                <div style="background:#f1f5f9; padding:6px; border-radius:6px; margin-bottom:8px; font-size:0.8rem; font-weight:600; color:#334155;">
                    <div>📍 ${country} | ${route.distanceKm} km</div>
                    <div>🛣️ Zemin: ${route.terrainType || route.asphaltQuality}</div>
                </div>
                <button onclick="openRouteModal('${route.id}')" style="width:100%; background:#0066ff; color:#fff; border:none; padding:8px; border-radius:6px; font-weight:700; cursor:pointer;">
                    ${btnText}
                </button>
            </div>
        `);

        activePolylines.push(outerPoly);
        activePolylines.push(polyline);
        route.coordinates.forEach(coord => bounds.extend(coord));

        // Eğer rotanın koordinat sayısı az ise (seyrek noktalar), arka planda OSRM ile gerçek yollara oturt
        if (route.coordinates.length < 15) {
            snapRouteToRealRoads(route, polyline, outerPoly);
        }

        // Başlangıç Pini
        const startCoord = route.coordinates[0];
        let iconEmoji = "🏍️";
        if (route.bikeCategory === "cross-enduro") iconEmoji = "🏔️";
        if (route.bikeCategory === "racing") iconEmoji = "🏁";

        const startIcon = L.divIcon({
            className: 'custom-map-icon',
            html: `<div style="background:#0066ff; color:#fff; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2.5px solid #fff; box-shadow:0 4px 12px rgba(0,102,255,0.5); font-size:15px;">${iconEmoji}</div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });

        const startMarker = L.marker(startCoord, { icon: startIcon }).addTo(mapInstance);
        startMarker.bindPopup(`<b>${title}</b><br>⭐ <b>${routeAvgScore.toFixed(1)}/10</b> | ${country}`);
        activeMarkers.push(startMarker);

        // MOTORCU MOLA PİNLERİ
        if (route.pitstops && route.pitstops.length > 0) {
            route.pitstops.forEach(pit => {
                const pitTitle = isEn ? (pit.titleEn || pit.title) : pit.title;
                const pitDesc = isEn ? (pit.descEn || pit.desc) : pit.desc;
                const pitAvgScore = typeof getPitstopAverageRating === "function" ? getPitstopAverageRating(pit) : 9.5;
                const pitRevCount = pit.reviews ? pit.reviews.length : 0;

                const pitIcon = L.divIcon({
                    className: 'custom-pitstop-icon',
                    html: `<div style="background:#ffb700; color:#000; width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2px solid #fff; box-shadow:0 2px 10px rgba(0,0,0,0.5); font-size:13px; font-weight:bold;">${pit.icon || '☕'}</div>`,
                    iconSize: [28, 28],
                    iconAnchor: [14, 14]
                });

                const pitMarker = L.marker([pit.lat, pit.lng], { icon: pitIcon }).addTo(mapInstance);
                pitMarker.bindPopup(`
                    <div style="font-family:'Inter', sans-serif; padding:4px;">
                        <span style="font-size:0.75rem; background:#ffb700; color:#000; font-weight:700; padding:2px 6px; border-radius:4px;">☕ MOTORCU MOLA MEKANI</span>
                        <h4 style="margin:4px 0; color:#0f172a; font-size:0.95rem;">${pitTitle}</h4>
                        <div style="color:#d97706; font-size:0.8rem; font-weight:700; margin-bottom:4px;">
                            ⭐ <strong>${pitAvgScore.toFixed(1)} / 10</strong> <span style="color:#64748b; font-size:0.72rem; font-weight:normal;">(${pitRevCount} ${isEn ? 'Reviews' : 'Yorum'})</span>
                        </div>
                        <p style="font-size:0.8rem; color:#475569; margin:0 0 6px 0;">${pitDesc}</p>
                        <button onclick="openRouteModal('${route.id}')" style="background:#ffb700; color:#000; border:none; padding:4px 8px; border-radius:4px; font-size:0.75rem; font-weight:700; cursor:pointer;">
                            ${isEn ? 'Rate & View' : 'Mekanı Değerlendir & Yorum Yap'}
                        </button>
                    </div>
                `);
                activeMarkers.push(pitMarker);
                bounds.extend([pit.lat, pit.lng]);
            });
        }
    });

    if (routes.length > 0 && bounds.isValid()) {
        mapInstance.fitBounds(bounds, { padding: [50, 50] });
    }
}

function focusRouteOnMap(routeId) {
    const routes = getStoredRoutes();
    const route = routes.find(r => r.id === routeId);
    if (!route || !mapInstance) return;

    const bounds = L.latLngBounds(route.coordinates);
    mapInstance.fitBounds(bounds, { padding: [60, 60] });

    const el = document.getElementById("leafletMap");
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}

async function snapRouteToRealRoads(route, polyline, outerPoly) {
    if (!route.coordinates || route.coordinates.length >= 15 || route.coordinates.length < 2) return;

    const formattedPoints = route.coordinates.map(pt => `${pt[1]},${pt[0]}`).join(';');
    const url = `https://router.project-osrm.org/route/v1/driving/${formattedPoints}?overview=full&geometries=geojson`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.code === 'Ok' && data.routes && data.routes[0]) {
            const osrmCoords = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
            route.coordinates = osrmCoords;
            polyline.setLatLngs(osrmCoords);
            outerPoly.setLatLngs(osrmCoords);
        }
    } catch (e) {
        console.warn("OSRM dynamic snapping fallback:", e);
    }
}
