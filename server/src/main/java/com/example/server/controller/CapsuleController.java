package com.example.server.controller;

import com.example.server.entity.Capsule;
import com.example.server.service.CapsuleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * exposes endpoints for creating time-capsules, listing your own,
 * and fetching/unlocking ones for a target user
 */
@RestController
@RequestMapping("/api/capsules")
public class CapsuleController {

    private final CapsuleService capsuleService;

    public CapsuleController(CapsuleService capsuleService) {
        this.capsuleService = capsuleService;
    }

    /**
     * schedule a new capsule
     */
    @PostMapping
    public ResponseEntity<Capsule> create(@RequestBody Capsule dto) {
        Capsule created = capsuleService.createCapsule(
                dto.getCreatorId(),
                dto.getTargetUserId(),
                dto.getMessage(),
                dto.getUnlockTime()
        );
        return ResponseEntity.ok(created);
    }

    /**
     * list all capsules you’ve created
     */
    @GetMapping("/creator/{userId}")
    public ResponseEntity<List<Capsule>> listByCreator(@PathVariable Integer userId) {
        List<Capsule> list = capsuleService.getCapsulesByCreator(userId);
        return ResponseEntity.ok(list);
    }

    /**
     * fetch (and unlock) any ready capsules for you
     */
    @GetMapping("/unlock/{userId}")
    public ResponseEntity<List<Capsule>> unlockForTarget(@PathVariable Integer userId) {
        List<Capsule> unlocked = capsuleService.fetchAndUnlockForTarget(userId);
        return ResponseEntity.ok(unlocked);
    }

    /**
     * lookup a single capsule
     */
    @GetMapping("/{id}")
    public ResponseEntity<Capsule> getById(@PathVariable Integer id) {
        Capsule c = capsuleService.getCapsuleById(id);
        return ResponseEntity.ok(c);
    }
}
