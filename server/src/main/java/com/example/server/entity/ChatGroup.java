package com.example.server.entity;

public class ChatGroup {
    private Integer id;
    private Integer ownerId;
    private Boolean isGroup;
    private String groupName;

    //getter and setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getOwnerId() { return ownerId; }
    public void setOwnerId(Integer ownerId) { this.ownerId = ownerId; }

    public Boolean getIsGroup() { return isGroup; }
    public void setIsGroup(Boolean isGroup) { this.isGroup = isGroup; }

    public String getGroupName() { return groupName; }
    public void setGroupName(String groupName) { this.groupName = groupName; }
}
