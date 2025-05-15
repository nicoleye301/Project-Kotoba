package com.example.server.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.OffsetDateTime;

public class Capsule {
    private Integer id;
    private Integer creatorId;
    private Integer targetUserId;
    private String message;

    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private OffsetDateTime unlockTime;

    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private OffsetDateTime createdAt;

    private Boolean isUnlocked;

    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private OffsetDateTime unlockedAt;

    // getters & setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getCreatorId() { return creatorId; }
    public void setCreatorId(Integer creatorId) { this.creatorId = creatorId; }

    public Integer getTargetUserId() { return targetUserId; }
    public void setTargetUserId(Integer targetUserId) { this.targetUserId = targetUserId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public OffsetDateTime getUnlockTime() { return unlockTime; }
    public void setUnlockTime(OffsetDateTime unlockTime) { this.unlockTime = unlockTime; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public Boolean getIsUnlocked() { return isUnlocked; }
    public void setIsUnlocked(Boolean isUnlocked) { this.isUnlocked = isUnlocked; }

    public OffsetDateTime getUnlockedAt() { return unlockedAt; }
    public void setUnlockedAt(OffsetDateTime unlockedAt) { this.unlockedAt = unlockedAt; }
}
