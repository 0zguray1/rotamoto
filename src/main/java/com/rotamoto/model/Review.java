package com.rotamoto.model;

public class Review {
    private String id;
    private String userName;
    private String bike;
    private int rating;
    private String date;
    private String comment;

    public Review() {}

    public Review(String id, String userName, String bike, int rating, String date, String comment) {
        this.id = id;
        this.userName = userName;
        this.bike = bike;
        this.rating = rating;
        this.date = date;
        this.comment = comment;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getBike() { return bike; }
    public void setBike(String bike) { this.bike = bike; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
}
