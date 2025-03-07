package com.example.server.entity;

public class Message {
    private Integer id;
    private String content;
    private Integer senderId;
    // for one-to-one messages, the target user ID
    private Integer targetId;
    // for group chat messages, the group ID (if not null, then targetId is ignored)
    private Integer groupId;

    // getters and setters
    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }
    public String getContent() {
        return content;
    }
    public void setContent(String content) {
        this.content = content;
    }
    public Integer getSenderId() {
        return senderId;
    }
    public void setSenderId(Integer senderId) {
        this.senderId = senderId;
    }
    public Integer getTargetId() {
        return targetId;
    }
    public void setTargetId(Integer targetId) {
        this.targetId = targetId;
    }
    public Integer getGroupId() {
        return groupId;
    }
    public void setGroupId(Integer groupId) {
        this.groupId = groupId;
    }
}
