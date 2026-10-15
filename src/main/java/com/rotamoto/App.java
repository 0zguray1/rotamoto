package com.rotamoto;

import com.rotamoto.handler.ApiHandler;
import com.rotamoto.handler.StaticHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.net.InetSocketAddress;

public class App {
    private static final int PORT = 8080;

    public static void main(String[] args) {
        try {
            HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);

            // API Endpoint'leri
            server.createContext("/api/routes", new ApiHandler());

            // Statik Dosyalar (HTML, CSS, JS, Assets)
            server.createContext("/", new StaticHandler("public"));

            server.setExecutor(null); // varsayılan executor
            System.out.println("====================================================");
            System.out.println(" 🏍️ RotaMoto Java Sunucusu Başlatıldı!");
            System.out.println(" 🌐 Adres: http://localhost:" + PORT);
            System.out.println("====================================================");

            server.start();
        } catch (IOException e) {
            System.err.println("Sunucu başlatılırken hata oluştu: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
