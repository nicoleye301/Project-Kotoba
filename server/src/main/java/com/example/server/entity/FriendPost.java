package com.example.server.entity;

public class FriendPost {
    private Integer id;
    private String content;
    private User poster;

    public FriendPost(Integer id, String content, User poster)
    {
        this.setId(id);
        this.setContent(content);
        this.setPoster(poster);
    }

    public Integer getId() { return id; }

    public void setId(Integer id) { this.id = id; }

    public String getContent() { return content; }

    public void setContent(String contents) { this.content = contents; }

    public User getPoster() { return poster; }

    public void setPoster(User poster) { this.poster = poster; }


}
