/**
 * RotaMoto - Gerçek Karayolu Navigasyonu (OSRM Entegrasyonu), Mavi Çizgi & Motor Türü Seçimi
 */
let builderMap = null;
let builderWaypoints = [];       // Haritada tıklanan durak pini koordinatları [[lat, lng], ...]
let builderRoadCoordinates = []; // OSRM ile çekilen gerçek karayolu koordinatları [[lat, lng], ...]
let builderPolyline = null;
let builderPolylineGlow = null;
let builderMarkers = [];
let realRoadDistanceKm = 0;
let relocatingWaypointIndex = -1; // Haritada konum değiştirme modundaki durak indeksi

function initRouteBuilderMap() {
    const builderMapEl = document.getElementById("builderMap");
    if (!builderMapEl) return;

    const worldBounds = L.latLngBounds(
        L.latLng(-85.0, -180.0),
        L.latLng(85.0, 180.0)
    );

    builderMap = L.map("builderMap", {
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
        if (builderMap) {
            builderMap.invalidateSize();
            builderMap.setView([39.1, 35.2], 6);
        }
    }, 200);

    setTimeout(() => {
        if (builderMap) builderMap.invalidateSize();
    }, 600);

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

    osmLayer.addTo(builderMap);

    const baseMaps = {
        "🌐 Dünya Haritası": osmLayer,
        "🏔️ Dağ & Arazi (Cross/Enduro)": topoLayer,
        "🛰️ Uydu Görünümü": esriSatellite
    };

    L.control.layers(baseMaps, null, { position: 'topright' }).addTo(builderMap);

    builderMap.on('click', function (e) {
        if (relocatingWaypointIndex !== -1) {
            setWaypointPosition(relocatingWaypointIndex, e.latlng);
            cancelRelocateMode();
        } else {
            addWaypointToBuilder(e.latlng);
        }
    });
}

const POINT_TYPES = {
    normal: { icon: '📍', label: 'Yol Durağı', labelEn: 'Road Stop', color: '#0066ff' },
    rest: { icon: '🛋️', label: 'Dinlenme & Mola Alanı', labelEn: 'Rest & Relax Area', color: '#ff8800' },
    cafe: { icon: '☕', label: 'Motorcu Kahvesi', labelEn: 'Biker Cafe & Tea', color: '#ffb700' },
    gas: { icon: '⛽', label: 'Benzinlik / İkmal', labelEn: 'Gas & Refuel', color: '#00b0ff' },
    viewpoint: { icon: '📸', label: 'Manzara / Seyir', labelEn: 'Scenic Viewpoint', color: '#aa00ff' },
    camp: { icon: '⛺', label: 'Kamp / Konaklama', labelEn: 'Campsite & Stay', color: '#00e676' }
};

function getWaypointLat(wpt) {
    if (Array.isArray(wpt)) return wpt[0];
    return wpt.lat;
}

function getWaypointLng(wpt) {
    if (Array.isArray(wpt)) return wpt[1];
    return wpt.lng;
}

function getWaypointType(wpt) {
    if (Array.isArray(wpt)) return 'normal';
    return wpt.type || 'normal';
}

function getWaypointIcon(wpt) {
    if (Array.isArray(wpt)) return '📍';
    return wpt.icon || '📍';
}

function getWaypointLabel(wpt) {
    if (Array.isArray(wpt)) return 'Yol Durağı';
    return wpt.label || 'Yol Durağı';
}

async function addWaypointToBuilder(latlng) {
    const typeSelect = document.getElementById("builderPointType");
    const pType = typeSelect ? typeSelect.value : "normal";
    const pConfig = POINT_TYPES[pType] || POINT_TYPES['normal'];

    const newWaypoint = {
        lat: latlng.lat,
        lng: latlng.lng,
        type: pType,
        icon: pConfig.icon,
        label: pConfig.label,
        color: pConfig.color
    };

    builderWaypoints.push(newWaypoint);
    await updateBuilderStateAndRoute();
}

function removeLastWaypoint() {
    if (builderWaypoints.length === 0) return;
    if (relocatingWaypointIndex === builderWaypoints.length - 1) {
        cancelRelocateMode();
    }
    builderWaypoints.pop();
    updateBuilderStateAndRoute();
}

function removeWaypointAtIndex(index) {
    if (index < 0 || index >= builderWaypoints.length) return;
    if (relocatingWaypointIndex === index) {
        cancelRelocateMode();
    } else if (relocatingWaypointIndex > index) {
        relocatingWaypointIndex--;
    }
    builderWaypoints.splice(index, 1);
    updateBuilderStateAndRoute();
}

async function setWaypointPosition(index, latlng) {
    if (index < 0 || index >= builderWaypoints.length) return;
    builderWaypoints[index].lat = latlng.lat;
    builderWaypoints[index].lng = latlng.lng;
    await updateBuilderStateAndRoute();
}

function relocateWaypointAtIndex(index) {
    if (index < 0 || index >= builderWaypoints.length) return;
    if (relocatingWaypointIndex === index) {
        cancelRelocateMode();
        return;
    }
    relocatingWaypointIndex = index;
    showRelocateBanner(index);
    renderBuilderWaypointList();
}

function cancelRelocateMode() {
    relocatingWaypointIndex = -1;
    const banner = document.getElementById("relocateStatusBanner");
    if (banner) banner.remove();
    renderBuilderWaypointList();
}

function showRelocateBanner(index) {
    let existingBanner = document.getElementById("relocateStatusBanner");
    if (existingBanner) existingBanner.remove();

    const isEn = (typeof currentLang !== "undefined" && currentLang === "en");
    const banner = document.createElement("div");
    banner.id = "relocateStatusBanner";
    banner.className = "relocate-banner";
    banner.innerHTML = `
        <div class="relocate-banner-content">
            <span>📍 <strong>${index + 1}. ${isEn ? 'Stop' : 'Durak'}</strong> ${isEn ? 'click new position on map...' : 'için haritada yeni bir konuma tıklayın...'}</span>
            <button onclick="cancelRelocateMode()" class="btn-cancel-relocate">${isEn ? 'Cancel' : 'İptal'}</button>
        </div>
    `;
    const mapContainer = document.querySelector(".builder-map-container");
    if (mapContainer) mapContainer.appendChild(banner);
}

async function moveWaypointUp(index) {
    if (index <= 0 || index >= builderWaypoints.length) return;
    const temp = builderWaypoints[index];
    builderWaypoints[index] = builderWaypoints[index - 1];
    builderWaypoints[index - 1] = temp;

    if (relocatingWaypointIndex === index) relocatingWaypointIndex = index - 1;
    else if (relocatingWaypointIndex === index - 1) relocatingWaypointIndex = index;

    await updateBuilderStateAndRoute();
}

async function moveWaypointDown(index) {
    if (index < 0 || index >= builderWaypoints.length - 1) return;
    const temp = builderWaypoints[index];
    builderWaypoints[index] = builderWaypoints[index + 1];
    builderWaypoints[index + 1] = temp;

    if (relocatingWaypointIndex === index) relocatingWaypointIndex = index + 1;
    else if (relocatingWaypointIndex === index + 1) relocatingWaypointIndex = index;

    await updateBuilderStateAndRoute();
}

function changeWaypointType(index, newType) {
    if (index < 0 || index >= builderWaypoints.length) return;
    const pConfig = POINT_TYPES[newType] || POINT_TYPES['normal'];

    const lat = getWaypointLat(builderWaypoints[index]);
    const lng = getWaypointLng(builderWaypoints[index]);

    builderWaypoints[index] = {
        lat: lat,
        lng: lng,
        type: newType,
        icon: pConfig.icon,
        label: pConfig.label,
        color: pConfig.color
    };

    renderAllBuilderMarkers();
    renderBuilderWaypointList();
}

async function updateBuilderStateAndRoute() {
    renderAllBuilderMarkers();

    const rawCoords = builderWaypoints.map(wpt => [getWaypointLat(wpt), getWaypointLng(wpt)]);

    if (builderWaypoints.length >= 2) {
        await fetchOSRMRealRoadRoute();
    } else {
        builderRoadCoordinates = [...rawCoords];
        realRoadDistanceKm = 0;
        drawBuilderPolyline();
        updateBuilderMetrics();
    }
}

function renderAllBuilderMarkers() {
    // Mevcut harita pinlerini temizle
    builderMarkers.forEach(m => {
        if (builderMap) builderMap.removeLayer(m);
    });
    builderMarkers = [];

    const isEn = (typeof currentLang !== "undefined" && currentLang === "en");

    builderWaypoints.forEach((wpt, idx) => {
        const markerIndex = idx + 1;
        const lat = getWaypointLat(wpt);
        const lng = getWaypointLng(wpt);
        const pType = getWaypointType(wpt);
        const pConfig = POINT_TYPES[pType] || POINT_TYPES['normal'];
        const iconSymbol = pConfig.icon;

        const isRelocating = (relocatingWaypointIndex === idx);
        const activeBorderColor = isRelocating ? '#ff9900' : '#ffffff';

        const markerIcon = L.divIcon({
            className: `builder-marker-icon ${isRelocating ? 'marker-pulsing' : ''}`,
            html: `<div style="background:${pConfig.color}; color:#fff; padding:0 8px; height:28px; border-radius:14px; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:12px; border:2.5px solid ${activeBorderColor}; box-shadow:0 3px 10px rgba(0,0,0,0.5); white-space:nowrap; cursor:grab;">${iconSymbol} ${markerIndex}</div>`,
            iconSize: [46, 28],
            iconAnchor: [23, 14]
        });

        const marker = L.marker([lat, lng], { 
            icon: markerIcon,
            draggable: true,
            title: isEn ? 'Drag on map to change position' : 'Sürükleyerek konumunu değiştirin'
        }).addTo(builderMap);

        // Haritada pini sürükleyip bırakınca yeni konuma oturt ve rotayı yenile
        marker.on('dragend', async function (e) {
            const newPos = e.target.getLatLng();
            builderWaypoints[idx].lat = newPos.lat;
            builderWaypoints[idx].lng = newPos.lng;
            await updateBuilderStateAndRoute();
        });

        const deleteLabel = isEn ? 'Noktayı Sil' : 'Noktayı Sil';
        const typeTitle = isEn ? (pConfig.labelEn || pConfig.label) : pConfig.label;

        let typeOptionsHtml = Object.keys(POINT_TYPES).map(key => {
            const cfg = POINT_TYPES[key];
            const sel = (key === pType) ? 'selected' : '';
            return `<option value="${key}" ${sel}>${cfg.icon} ${isEn ? (cfg.labelEn || cfg.label) : cfg.label}</option>`;
        }).join('');

        const popupContent = `
            <div style="text-align: center; padding: 6px; min-width: 190px; font-family: 'Inter', sans-serif;">
                <strong style="display: block; margin-bottom: 6px; font-size: 13px; color: #0f172a;">${iconSymbol} ${typeTitle} #${markerIndex}</strong>
                <div style="margin-bottom: 8px;">
                    <select onchange="changeWaypointType(${idx}, this.value)" style="width:100%; font-size:11px; padding:4px 6px; border-radius:6px; border:1px solid #cbd5e1; outline:none; background:#f8fafc; cursor:pointer;">
                        ${typeOptionsHtml}
                    </select>
                </div>
                <div style="display: flex; gap: 4px; justify-content: center; margin-bottom: 8px;">
                    <button onclick="moveWaypointUp(${idx})" ${idx === 0 ? 'disabled' : ''} title="${isEn ? 'Move Up' : 'Yukarı Taşı'}" style="background:#f1f5f9; color:#334155; border:1px solid #cbd5e1; padding:4px 8px; border-radius:4px; font-size:11px; cursor:pointer; opacity:${idx === 0 ? '0.4' : '1'};">
                        <i class="fa-solid fa-arrow-up"></i>
                    </button>
                    <button onclick="moveWaypointDown(${idx})" ${idx === builderWaypoints.length - 1 ? 'disabled' : ''} title="${isEn ? 'Move Down' : 'Aşağı Taşı'}" style="background:#f1f5f9; color:#334155; border:1px solid #cbd5e1; padding:4px 8px; border-radius:4px; font-size:11px; cursor:pointer; opacity:${idx === builderWaypoints.length - 1 ? '0.4' : '1'};">
                        <i class="fa-solid fa-arrow-down"></i>
                    </button>
                    <button onclick="relocateWaypointAtIndex(${idx})" title="${isEn ? 'Click new location on map' : 'Haritada yeni konum seç'}" style="background:#0066ff; color:#fff; border:none; padding:4px 8px; border-radius:4px; font-size:11px; cursor:pointer; font-weight:600; display:inline-flex; align-items:center; gap:3px;">
                        <i class="fa-solid fa-location-crosshairs"></i> ${isEn ? 'Relocate' : 'Taşı'}
                    </button>
                </div>
                <button onclick="removeWaypointAtIndex(${idx})" style="background: #ff3344; color: #fff; border: none; padding: 5px 12px; border-radius: 6px; font-size: 11px; cursor: pointer; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; transition: background 0.2s; width: 100%; justify-content: center;">
                    <i class="fa-solid fa-trash-can"></i> ${deleteLabel}
                </button>
                <div style="margin-top: 6px; font-size: 10px; color: #64748b; font-style: italic;">
                    <i class="fa-solid fa-hand-pointer"></i> ${isEn ? 'Or drag marker directly on map' : 'Veya pini haritada sürükleyin'}
                </div>
            </div>
        `;

        marker.bindPopup(popupContent);
        builderMarkers.push(marker);
    });
}

// OSRM (Open Source Routing Machine) Gerçek Yol Çekme Fonksiyonu
async function fetchOSRMRealRoadRoute() {
    if (builderWaypoints.length < 2) return;

    // OSRM lon,lat formatı gerektirir
    const formattedPoints = builderWaypoints.map(wpt => `${getWaypointLng(wpt)},${getWaypointLat(wpt)}`).join(';');
    const url = `https://router.project-osrm.org/route/v1/driving/${formattedPoints}?overview=full&geometries=geojson`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
            const osrmRoute = data.routes[0];
            // GeoJSON coordinates [lon, lat] formatındadır -> [lat, lon] dönüştür
            builderRoadCoordinates = osrmRoute.geometry.coordinates.map(coord => [coord[1], coord[0]]);
            realRoadDistanceKm = Math.round((osrmRoute.distance / 1000) * 10) / 10;
        } else {
            builderRoadCoordinates = builderWaypoints.map(wpt => [getWaypointLat(wpt), getWaypointLng(wpt)]);
            realRoadDistanceKm = calculateHaversineDistance(builderRoadCoordinates);
        }
    } catch (e) {
        console.warn("OSRM routing fallback to direct points:", e);
        builderRoadCoordinates = builderWaypoints.map(wpt => [getWaypointLat(wpt), getWaypointLng(wpt)]);
        realRoadDistanceKm = calculateHaversineDistance(builderRoadCoordinates);
    }

    drawBuilderPolyline();
    updateBuilderMetrics();
}

function drawBuilderPolyline() {
    if (builderPolyline) builderMap.removeLayer(builderPolyline);
    if (builderPolylineGlow) builderMap.removeLayer(builderPolylineGlow);

    if (builderRoadCoordinates.length < 2) return;

    // DIŞ ELEKTRİK MAVİ PARLAMA ÇİZGİSİ
    builderPolylineGlow = L.polyline(builderRoadCoordinates, {
        color: '#00d2ff',
        weight: 10,
        opacity: 0.4,
        lineJoin: 'round'
    }).addTo(builderMap);

    // ANA CANLI ELEKTRİK MAVİ GERÇEK YOL ÇİZGİSİ
    builderPolyline = L.polyline(builderRoadCoordinates, {
        color: '#0066ff',
        weight: 6,
        opacity: 0.95,
        lineJoin: 'round'
    }).addTo(builderMap);
}

function resetBuilder() {
    builderWaypoints = [];
    builderRoadCoordinates = [];
    realRoadDistanceKm = 0;
    cancelRelocateMode();

    if (builderPolyline && builderMap) builderMap.removeLayer(builderPolyline);
    if (builderPolylineGlow && builderMap) builderMap.removeLayer(builderPolylineGlow);

    builderPolyline = null;
    builderPolylineGlow = null;

    builderMarkers.forEach(m => {
        if (builderMap) builderMap.removeLayer(m);
    });
    builderMarkers = [];
    updateBuilderMetrics();
}

function calculateHaversineDistance(coords) {
    if (coords.length < 2) return 0;
    let totalKm = 0;
    const R = 6371;
    for (let i = 0; i < coords.length - 1; i++) {
        const lat1 = coords[i][0] * Math.PI / 180;
        const lon1 = coords[i][1] * Math.PI / 180;
        const lat2 = coords[i + 1][0] * Math.PI / 180;
        const lon2 = coords[i + 1][1] * Math.PI / 180;
        const dLat = lat2 - lat1;
        const dLon = lon2 - lon1;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        totalKm += R * c;
    }
    return Math.round(totalKm * 10) / 10;
}

function updateBuilderMetrics() {
    const distEl = document.getElementById("builderDistance");
    const countEl = document.getElementById("builderPointCount");
    const isEn = (typeof currentLang !== "undefined" && currentLang === "en");

    if (distEl) distEl.textContent = `${realRoadDistanceKm} km`;
    if (countEl) countEl.textContent = `${builderWaypoints.length} ${isEn ? 'Stops' : 'Durak'}`;

    renderBuilderWaypointList();
}

function renderBuilderWaypointList() {
    const listEl = document.getElementById("builderWaypointList");
    if (!listEl) return;

    const isEn = (typeof currentLang !== "undefined" && currentLang === "en");

    if (builderWaypoints.length === 0) {
        listEl.innerHTML = `
            <div class="builder-empty-list">
                <i class="fa-solid fa-map-pin"></i>
                <span>${isEn ? 'Click on the map to add waypoints & rest areas.' : 'Haritada tıklayarak durak ve mola alanları ekleyin.'}</span>
            </div>
        `;
        return;
    }

    let html = '';
    builderWaypoints.forEach((wpt, idx) => {
        const lat = getWaypointLat(wpt);
        const lng = getWaypointLng(wpt);
        const pType = getWaypointType(wpt);
        const pConfig = POINT_TYPES[pType] || POINT_TYPES['normal'];

        const latFormatted = lat.toFixed(4);
        const lngFormatted = lng.toFixed(4);
        const isRelocating = (relocatingWaypointIndex === idx);

        let typeOptionsHtml = Object.keys(POINT_TYPES).map(key => {
            const cfg = POINT_TYPES[key];
            const sel = (key === pType) ? 'selected' : '';
            return `<option value="${key}" ${sel}>${cfg.icon} ${isEn ? (cfg.labelEn || cfg.label) : cfg.label}</option>`;
        }).join('');

        html += `
            <div class="builder-waypoint-item ${isRelocating ? 'is-relocating' : ''}">
                <div class="builder-waypoint-info">
                    <span class="builder-waypoint-badge" style="background:${pConfig.color}">${idx + 1}</span>
                    <div style="flex:1;">
                        <div style="display:flex; align-items:center; gap:4px; margin-bottom:2px;">
                            <span style="font-size:0.9rem;">${pConfig.icon}</span>
                            <select onchange="changeWaypointType(${idx}, this.value)" class="builder-type-inline-select">
                                ${typeOptionsHtml}
                            </select>
                        </div>
                        <small class="builder-waypoint-coords">${latFormatted}, ${lngFormatted}</small>
                    </div>
                </div>
                <div class="builder-waypoint-actions">
                    <button class="builder-btn-action" onclick="moveWaypointUp(${idx})" ${idx === 0 ? 'disabled' : ''} title="${isEn ? 'Move Up' : 'Yukarı Taşı'}">
                        <i class="fa-solid fa-chevron-up"></i>
                    </button>
                    <button class="builder-btn-action" onclick="moveWaypointDown(${idx})" ${idx === builderWaypoints.length - 1 ? 'disabled' : ''} title="${isEn ? 'Move Down' : 'Aşağı Taşı'}">
                        <i class="fa-solid fa-chevron-down"></i>
                    </button>
                    <button class="builder-btn-action builder-btn-relocate ${isRelocating ? 'active' : ''}" onclick="relocateWaypointAtIndex(${idx})" title="${isEn ? 'Click new location on map' : 'Haritada yeni yer seç'}">
                        <i class="fa-solid fa-location-crosshairs"></i>
                    </button>
                    <button class="builder-waypoint-delete" onclick="removeWaypointAtIndex(${idx})" title="${isEn ? 'Delete Stop' : 'Durak Noktasını Sil'}">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </div>
        `;
    });

    listEl.innerHTML = html;
}

function saveUserCreatedRoute() {
    const titleInput = document.getElementById("newRouteTitle");
    const bikeTypeSelect = document.getElementById("newRouteBikeType");
    const regionSelect = document.getElementById("newRouteRegion");
    const diffSelect = document.getElementById("newRouteDifficulty");

    if (!titleInput || !titleInput.value.trim()) {
        alert(currentLang === 'en' ? "Please enter a title for your route." : "Lütfen rotanıza bir başlık giriniz.");
        return;
    }

    if (builderWaypoints.length < 2) {
        alert(currentLang === 'en' ? "Click on the map at least 2 times to create waypoints along the road." : "Rotanızı haritada oluşturmak için en az 2 noktaya tıklayın.");
        return;
    }

    const selectedBikeCat = bikeTypeSelect ? bikeTypeSelect.value : "touring-chopper";
    let selectedBikeName = "🛵 Naked / Streetfighter";
    let defaultImg = "assets/naked_bike.jpg";

    if (selectedBikeCat === "racing") {
        selectedBikeName = "🏎️ Racing / Supersport";
        defaultImg = "assets/racing_bike.jpg";
    } else if (selectedBikeCat === "cross-enduro") {
        selectedBikeName = "🏔️ Cross / Enduro / Off-Road";
        defaultImg = "assets/cross_bike.jpg";
    } else if (selectedBikeCat === "adventure") {
        selectedBikeName = "🧳 Adventure / Touring";
        defaultImg = "assets/adventure_bike.jpg";
    }

    const rawCoords = builderWaypoints.map(wpt => [getWaypointLat(wpt), getWaypointLng(wpt)]);
    const distKm = realRoadDistanceKm || calculateHaversineDistance(rawCoords);
    const finalCoords = builderRoadCoordinates.length > 0 ? builderRoadCoordinates : rawCoords;

    // Sürücünün eklediği özel mola yerlerini derle
    const userPitstops = builderWaypoints
        .filter(wpt => getWaypointType(wpt) !== 'normal')
        .map((wpt, idx) => {
            const pType = getWaypointType(wpt);
            const pConfig = POINT_TYPES[pType] || POINT_TYPES['normal'];
            return {
                title: `${pConfig.icon} ${pConfig.label} (Durak ${idx + 1})`,
                titleEn: `${pConfig.icon} ${pConfig.labelEn || pConfig.label} (Stop ${idx + 1})`,
                category: pType,
                icon: pConfig.icon,
                lat: getWaypointLat(wpt),
                lng: getWaypointLng(wpt),
                desc: `Sürücü tarafından eklenen ${pConfig.label.toLowerCase()} mola durağı.`,
                descEn: `Custom rider marked ${pConfig.labelEn || pConfig.label}.`,
                image: "assets/biker_pitstop.jpg"
            };
        });

    if (userPitstops.length === 0) {
        userPitstops.push({
            title: "☕ Rota Çizim Pitstop & Çay Molası",
            titleEn: "☕ Custom Pitstop Stop",
            category: "cafe",
            icon: "☕",
            lat: getWaypointLat(builderWaypoints[0]),
            lng: getWaypointLng(builderWaypoints[0]),
            desc: "Sürücünün belirlediği mola noktası.",
            descEn: "Custom pitstop marked by rider.",
            image: "assets/biker_pitstop.jpg"
        });
    }

    const newRoute = {
        id: "custom-" + Date.now(),
        title: titleInput.value.trim(),
        titleEn: titleInput.value.trim(),
        tagline: "Sürücü Tarafından Gerçek Karayolu Navigasyonu İle Çizilen Rota",
        taglineEn: "Custom route generated with real road navigation",
        region: regionSelect ? regionSelect.value : "Türkiye 🇹🇷",
        country: regionSelect ? regionSelect.value : "Türkiye 🇹🇷",
        countryEn: regionSelect ? regionSelect.value : "Turkey 🇹🇷",
        bikeCategory: selectedBikeCat,
        bikeCategoryName: selectedBikeName,
        category: "bol-viraj",
        difficulty: diffSelect ? diffSelect.value : "Orta",
        difficultyEn: diffSelect ? diffSelect.value : "Medium",
        curvatureRating: 8.8,
        turnCount: Math.round(builderWaypoints.length * 9.5),
        terrainType: "%95 Gerçek Sıcak Asfalt",
        terrainTypeEn: "%95 Real Road Asphalt",
        asphaltQuality: "%95 Asfalt",
        distanceKm: distKm,
        estimatedDuration: `${Math.round(distKm / 50 * 60)} dk`,
        elevationMin: 50,
        elevationMax: 450,
        elevationGain: 400,
        startPoint: "Başlangıç Noktası",
        endPoint: "Varış Noktası",
        recommendedBikes: [selectedBikeName],
        image: defaultImg,
        gallery: [defaultImg, "assets/biker_pitstop.jpg"],
        cautionNote: "⚠️ Kendi çizdiğiniz rotada sürüş yaparken trafik tabelalarına ve viraj açılarına dikkat edin.",
        cautionNoteEn: "⚠️ Pay attention to traffic signs and cornering speed.",
        weather: { temp: "24°C", condition: "Açık", wind: "10 km/h" },
        coordinates: finalCoords,
        pitstops: userPitstops,
        waypoints: builderWaypoints.map((wpt, idx) => ({
            lat: getWaypointLat(wpt),
            lng: getWaypointLng(wpt),
            title: `${getWaypointIcon(wpt)} Durak ${idx + 1}`,
            desc: getWaypointLabel(wpt)
        })),
        elevationProfile: [
            [0, 50], [distKm / 2, 450], [distKm, 80]
        ],
        reviews: []
    };

    saveCustomRoute(newRoute);
    titleInput.value = "";
    resetBuilder();

    if (typeof closeRouteBuilderModal === "function") {
        closeRouteBuilderModal();
    }

    if (typeof refreshAppRoutes === "function") {
        refreshAppRoutes();
    }

    alert(currentLang === 'en' ? "🎉 Real road route saved and published!" : "🎉 Harika! Gerçek karayolu rotanız başarıyla kaydedildi ve yayınlandı.");
    const routesSec = document.getElementById("routesSection");
    if (routesSec) routesSec.scrollIntoView({ behavior: 'smooth' });
}

function downloadGPX(routeId) {
    const routes = getStoredRoutes();
    const route = routes.find(r => r.id === routeId);
    if (!route) return;

    let gpxContent = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="RotaMoto - Motorcycle Route Platform" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${escapeXml(route.title)}</name>
    <desc>${escapeXml(route.tagline)}</desc>
  </metadata>
  <trk>
    <name>${escapeXml(route.title)}</name>
    <trkseg>
`;

    route.coordinates.forEach(coord => {
        gpxContent += `      <trkpt lat="${coord[0]}" lon="${coord[1]}"></trkpt>\n`;
    });

    gpxContent += `    </trkseg>
  </trk>
</gpx>`;

    const blob = new Blob([gpxContent], { type: 'application/gpx+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${route.id}.gpx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function escapeXml(unsafe) {
    return unsafe.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
        }
    });
}
