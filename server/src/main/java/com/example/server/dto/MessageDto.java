package com.example.server.dto;

public class MessageDto {
    // sender's user ID
    private Integer senderId;
    // for one-to-one messages, the recipient's user ID; null for group messages
    private Integer targetId;
    // for group chat messages, the group's ID; null for one-to-one messages
    private Integer groupId;
    // the content of the message
    private String content;

    // getters and setters
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
    public String getContent() {
        return content;
    }
    public void setContent(String content) {
        this.content = content;
    }
}
