package com.example.server.entity;

public class PostLike {
    private Integer id;
    private Integer postId;
    private Integer senderId;
    private String content;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getPostId() { return postId; }
    public void setPostId(Integer postId) { this.postId = postId; }

    public Integer getSenderId() { return senderId; }
    public void setSenderId(Integer userId) { this.senderId = userId; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content;}
}
