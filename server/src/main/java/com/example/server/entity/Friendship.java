package com.example.server.entity;

public class Friendship {
    private Integer id;
    private Integer userId;           // the sender of the friend request
    private Integer friendId;         // the target user (friend's user ID)
    private String nickname;          // optional nickname for this friend
    private Integer directChatGroupId; // gor creating a direct chat group later
    private String status;            // "pending", "accepted", "declined", or "deleted"
    private String milestoneSettings;

    // getters and Setters
    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }
    public Integer getUserId() {
        return userId;
    }
    public void setUserId(Integer userId) {
        this.userId = userId;
    }
    public Integer getFriendId() {
        return friendId;
    }
    public void setFriendId(Integer friendId) {
        this.friendId = friendId;
    }
    public String getNickname() {
        return nickname;
    }
    public void setNickname(String nickname) {
        this.nickname = nickname;
    }
    public Integer getDirectChatGroupId() {
        return directChatGroupId;
    }
    public void setDirectChatGroupId(Integer directChatGroupId) {
        this.directChatGroupId = directChatGroupId;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }

    public String getMilestoneSettings() {
        return milestoneSettings;
    }

    public void setMilestoneSettings(String milestoneSettings) {
        this.milestoneSettings = milestoneSettings;
    }
}
