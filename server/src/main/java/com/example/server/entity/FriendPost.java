package com.example.server.entity;

import java.time.LocalDateTime;

public class FriendPost {
    private Integer id;
    private Integer posterId;
    private String imageURL;
    private String content;
    private LocalDateTime postTime;



    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getPosterId() { return posterId; }
    public void setPosterId(Integer posterId) { this.posterId = posterId; }

    public String getImageURL() {return imageURL; }
    public void setImageURL(String imageURL) {this.imageURL = imageURL; }

    public String getContent() { return content; }
    public void setContent(String contents) { this.content = contents; }

    public LocalDateTime getPostTime() { return postTime; }
    public void setPostTime(LocalDateTime postTime) { this.postTime = postTime; }
}
