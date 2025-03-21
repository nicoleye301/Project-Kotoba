package com.example.server.entity;

import java.time.LocalDateTime;

public class ChatGroup {
    private Integer id;
    private Integer ownerId;
    private Boolean isGroup;       // should be true for group chats (including 1-to-1 chats)
    private String groupName;
    private LocalDateTime lastUpdateTime; // used for ordering
    private Boolean muted;         // default false

    // getters and setters
    public Integer getId() {return id;}
    public void setId(Integer id) {
        this.id = id;
    }
    public Integer getOwnerId() {
        return ownerId;
    }
    public void setOwnerId(Integer ownerId) {
        this.ownerId = ownerId;
    }
    public Boolean getIsGroup() {
        return isGroup;
    }
    public void setIsGroup(Boolean isGroup) {
        this.isGroup = isGroup;
    }
    public String getGroupName() {
        return groupName;
    }
    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }
    public LocalDateTime getLastUpdateTime() {
        return lastUpdateTime;
    }
    public void setLastUpdateTime(LocalDateTime lastUpdateTime) {
        this.lastUpdateTime = lastUpdateTime;
    }
    public Boolean getMuted() {
        return muted;
    }
    public void setMuted(Boolean muted) {
        this.muted = muted;
    }
}