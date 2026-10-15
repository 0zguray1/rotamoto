package com.rotamoto.model;

import java.util.List;

public class Route {
    private String id;
    private String title;
    private String tagline;
    private String region;
    private String category;
    private String difficulty;
    private double curvatureRating;
    private int turnCount;
    private String asphaltQuality;
    private double distanceKm;
    private String estimatedDuration;
    private int elevationMin;
    private int elevationMax;
    private String startPoint;
    private String endPoint;
    private List<String> recommendedBikes;
    private String image;
    private String cautionNote;
    private List<List<Double>> coordinates;
    private List<Review> reviews;

    public Route() {}

    public Route(String id, String title, String tagline, String region, String category, 
                 String difficulty, double curvatureRating, int turnCount, String asphaltQuality, 
                 double distanceKm, String estimatedDuration, int elevationMin, int elevationMax, 
                 String startPoint, String endPoint, List<String> recommendedBikes, String image, 
                 String cautionNote, List<List<Double>> coordinates, List<Review> reviews) {
        this.id = id;
        this.title = title;
        this.tagline = tagline;
        this.region = region;
        this.category = category;
        this.difficulty = difficulty;
        this.curvatureRating = curvatureRating;
        this.turnCount = turnCount;
        this.asphaltQuality = asphaltQuality;
        this.distanceKm = distanceKm;
        this.estimatedDuration = estimatedDuration;
        this.elevationMin = elevationMin;
        this.elevationMax = elevationMax;
        this.startPoint = startPoint;
        this.endPoint = endPoint;
        this.recommendedBikes = recommendedBikes;
        this.image = image;
        this.cautionNote = cautionNote;
        this.coordinates = coordinates;
        this.reviews = reviews;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getTagline() { return tagline; }
    public void setTagline(String tagline) { this.tagline = tagline; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public double getCurvatureRating() { return curvatureRating; }
    public void setCurvatureRating(double curvatureRating) { this.curvatureRating = curvatureRating; }

    public int getTurnCount() { return turnCount; }
    public void setTurnCount(int turnCount) { this.turnCount = turnCount; }

    public String getAsphaltQuality() { return asphaltQuality; }
    public void setAsphaltQuality(String asphaltQuality) { this.asphaltQuality = asphaltQuality; }

    public double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(double distanceKm) { this.distanceKm = distanceKm; }

    public String getEstimatedDuration() { return estimatedDuration; }
    public void setEstimatedDuration(String estimatedDuration) { this.estimatedDuration = estimatedDuration; }

    public int getElevationMin() { return elevationMin; }
    public void setElevationMin(int elevationMin) { this.elevationMin = elevationMin; }

    public int getElevationMax() { return elevationMax; }
    public void setElevationMax(int elevationMax) { this.elevationMax = elevationMax; }

    public String getStartPoint() { return startPoint; }
    public void setStartPoint(String startPoint) { this.startPoint = startPoint; }

    public String getEndPoint() { return endPoint; }
    public void setEndPoint(String endPoint) { this.endPoint = endPoint; }

    public List<String> getRecommendedBikes() { return recommendedBikes; }
    public void setRecommendedBikes(List<String> recommendedBikes) { this.recommendedBikes = recommendedBikes; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getCautionNote() { return cautionNote; }
    public void setCautionNote(String cautionNote) { this.cautionNote = cautionNote; }

    public List<List<Double>> getCoordinates() { return coordinates; }
    public void setCoordinates(List<List<Double>> coordinates) { this.coordinates = coordinates; }

    public List<Review> getReviews() { return reviews; }
    public void setReviews(List<Review> reviews) { this.reviews = reviews; }
}
