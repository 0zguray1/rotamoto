/**
 * RotaMoto - Node.js Canlı Önizleme Sunucusu
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME_TYPES = {
    '.html': 'text/html; charset=UTF-8',
    '.css': 'text/css; charset=UTF-8',
    '.js': 'application/javascript; charset=UTF-8',
    '.json': 'application/json; charset=UTF-8',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.gpx': 'application/gpx+xml',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
    // API Endpoint Simülasyonu
    if (req.url.startsWith('/api/routes')) {
        res.writeHead(200, {
            'Content-Type': 'application/json; charset=UTF-8',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ status: 'ok', message: 'RotaMoto API Sunucusu Aktif' }));
        return;
    }

    // URL ayrıştırma
    let pathname;
    try {
        const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        pathname = decodeURIComponent(parsedUrl.pathname);
    } catch {
        pathname = req.url.split('?')[0];
    }

    let reqPath = (pathname === '/' || pathname === '') ? '/index.html' : pathname;
    let filePath = path.join(PUBLIC_DIR, reqPath);

    // Dizin dışına çıkılmasını engelle (Path Traversal koruması)
    if (!filePath.startsWith(PUBLIC_DIR)) {
        res.writeHead(403);
        res.end('Erişim Reddedildi');
        return;
    }

    fs.stat(filePath, (err, stats) => {
        if (err || stats.isDirectory()) {
            // Eğer dosya uzantısı yoksa veya html isteniyorsa index.html'e yönlendir (SPA fallback)
            if (!path.extname(reqPath)) {
                filePath = path.join(PUBLIC_DIR, 'index.html');
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
                res.end('404 Dosya Bulunamadı');
                return;
            }
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        fs.readFile(filePath, (readErr, content) => {
            if (readErr) {
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=UTF-8' });
                res.end('Sunucu Hatası: ' + readErr.code);
            } else {
                res.writeHead(200, {
                    'Content-Type': contentType,
                    'Cache-Control': 'no-cache'
                });
                res.end(content);
            }
        });
    });
});

server.listen(PORT, () => {
    console.log('====================================================');
    console.log(' 🏍️ RotaMoto Canlı Önizleme Sunucusu Çalışıyor!');
    console.log(` 🌐 Web Adresi: http://localhost:${PORT}`);
    console.log('====================================================');
});
