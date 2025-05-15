package com.example.server.service;

import com.example.server.entity.Capsule;
import com.example.server.exception.CustomException;
import com.example.server.mapper.CapsuleMapper;
import com.example.server.websocket.KTextWebSocket;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.List;

@Service
public class CapsuleService {

    @Resource
    private CapsuleMapper capsuleMapper;

    @Resource
    private KTextWebSocket kTextWebSocket;

    /**
     * create a new time‐capsule message
     */
    @Transactional
    public Capsule createCapsule(Integer creatorId,
                                 Integer targetUserId,
                                 String message,
                                 OffsetDateTime unlockTime) {
        try {
            Capsule c = new Capsule();
            c.setCreatorId(creatorId);
            c.setTargetUserId(targetUserId);
            c.setMessage(message);
            c.setUnlockTime(unlockTime);
            c.setCreatedAt(OffsetDateTime.now());
            c.setIsUnlocked(false);
            capsuleMapper.insertCapsule(c);
            return c;
        } catch (Exception e) {
            throw new CustomException(500, "Error creating capsule: " + e.getMessage());
        }
    }

    /**
     * fetch all capsules that the given user has created,
     * regardless of unlock status/time
     */
    public List<Capsule> getCapsulesByCreator(Integer creatorId) {
        return capsuleMapper.selectByCreator(creatorId);
    }

    /**
     * fetch any capsules for the target user whose unlock time has passed
     * but have not yet been marked unlocked
     * marks each one unlocked and broadcasts a WebSocket notification
     */
    @Transactional
    public List<Capsule> fetchAndUnlockForTarget(Integer targetUserId) {
        List<Capsule> ready = capsuleMapper.selectReadyCapsulesByTarget(targetUserId);

        // mark unlocked & optionally notify via websocket
        for (Capsule c : ready) {
            capsuleMapper.markCapsuleUnlocked(c.getId());

            // send a websocket event so the client can play the animation
            try {
                HashMap<String,Object> payload = new HashMap<>();
                payload.put("capsuleId",   c.getId());
                payload.put("message",     c.getMessage());
                payload.put("unlockTime",  c.getUnlockTime().toString());
                payload.put("creatorId",   c.getCreatorId());
                payload.put("targetUserId",c.getTargetUserId());

                String json = new ObjectMapper().writeValueAsString(payload);
                kTextWebSocket.broadcast(json, targetUserId);
            } catch (Exception ex) {
                // log but don’t fail the entire batch
                System.err.println("WebSocket error: " + ex.getMessage());
            }
        }

        return ready;
    }

    /**
     * retrieve a capsule by its ID
     */
    public Capsule getCapsuleById(Integer id) {
        Capsule c = capsuleMapper.selectById(id);
        if (c == null) {
            throw new CustomException(404, "Capsule not found: " + id);
        }
        return c;
    }

    public List<Capsule> getReceivedByTarget(Integer targetUserId) {
        return capsuleMapper.selectReceivedByTarget(targetUserId);
    }
}
