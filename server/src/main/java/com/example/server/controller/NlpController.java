package com.example.server.controller;
import com.example.server.exception.CustomException;
import com.example.server.service.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/nlp")
public class NlpController {

    private final GeminiService geminiService;

    @Autowired
    public NlpController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping("/suggestAiReplies")
    public Mono<List<String>> suggestAiReplies(@RequestBody Map<String, String> payload) {
        String text = payload.get("text");
        if (text == null || text.trim().isEmpty()) {
            throw new CustomException(400, "Text input is required for analysis");
        }
        return geminiService.generateReplySuggestions(text);
    }
}
