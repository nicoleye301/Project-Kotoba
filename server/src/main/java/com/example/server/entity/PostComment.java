package com.example.server.entity;

import java.time.LocalDateTime;

public class PostComment {
    private Integer id;
    private Integer postId;
    private Integer senderId;
    private String content;
    private LocalDateTime postTime;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getPostId() { return postId; }
    public void setPostId(Integer postId) { this.postId = postId; }

    public Integer getSenderId() { return senderId; }
    public void setSenderId(Integer senderId) { this.senderId = senderId; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public LocalDateTime getPostTime() { return postTime; }
    public void setPostTime(LocalDateTime postTime) { this.postTime = postTime; }
}
