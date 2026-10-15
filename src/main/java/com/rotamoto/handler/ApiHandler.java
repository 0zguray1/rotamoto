package com.rotamoto.handler;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

public class ApiHandler implements HttpHandler {

    private static final String SAMPLE_ROUTES_JSON = "[\n" +
            "  {\n" +
            "    \"id\": \"ucmakdere-virajlari\",\n" +
            "    \"title\": \"Tekirdağ Uçmakdere Viraj Rotası\",\n" +
            "    \"tagline\": \"Marmara'nın En İkonik Deniz Manzaralı Viraj Fırtınası\",\n" +
            "    \"region\": \"Marmara\",\n" +
            "    \"category\": \"bol-viraj\",\n" +
            "    \"difficulty\": \"Usta\",\n" +
            "    \"curvatureRating\": 9.6,\n" +
            "    \"turnCount\": 148,\n" +
            "    \"asphaltQuality\": \"%92 Pürüzsüz Asfalt\",\n" +
            "    \"distanceKm\": 46.5,\n" +
            "    \"estimatedDuration\": \"1 saat 15 dk\",\n" +
            "    \"startPoint\": \"Kumbağ, Tekirdağ\",\n" +
            "    \"endPoint\": \"Şarköy, Tekirdağ\"\n" +
            "  }\n" +
            "]";

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        
        // CORS Headers
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");

        if ("OPTIONS".equalsIgnoreCase(method)) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        if ("GET".equalsIgnoreCase(method)) {
            byte[] responseBytes = SAMPLE_ROUTES_JSON.getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
            exchange.sendResponseHeaders(200, responseBytes.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(responseBytes);
            }
        } else {
            exchange.sendResponseHeaders(455, -1);
        }
    }
}
