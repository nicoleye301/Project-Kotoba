package com.example.server.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
public class GeminiService {

    private final WebClient webClient;

    @Value("${gemini.api.key}")
    private String apiKey;

    public GeminiService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder
                .baseUrl("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent")
                .build();
    }

    public Mono<List<String>> generateReplySuggestions(String inputText) {
        String prompt = """
                        You are helping someone respond to a message from a close friend or family member. 
                        They aren’t sure what to say, so you’ll suggest 3 natural and emotionally honest replies.
                    
                        Message:
                        "%s"
                    
                        The replies should:
                        - feel like something a real person would actually say over text
                        - be warm, casual, and sincere — not overly formal, cheesy, or "perfect"
                        - show you’re listening or that you relate (if it makes sense)
                        - sound like something you’d send to someone you care about
                    
                        Keep each reply short (1–2 sentences max). 
                        Avoid being overly optimistic or dramatic. Just sound real.
                    
                        Don’t include:
                        - labels, numbers, or bullet points
                        - emojis
                        - quotation marks
                        - any explanations or formatting
                    
                        Only return the 3 replies as plain text, each on its own line.
                        """.formatted(inputText);
        var requestBody = new GeminiRequest(prompt);

        return webClient.post()
                .uri(uriBuilder -> uriBuilder.queryParam("key", apiKey).build())
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(GeminiResponse.class)
                .map(response -> response.getSuggestions().stream()
                        .map(this::cleanReply)
                        .filter(text -> !text.isEmpty())
                        .toList()
                );
    }

    private String cleanReply(String text) {
        return text
                .replaceAll("\\*\\*(.*?)\\*\\*", "$1")
                .replaceAll("\\(.*?\\)", "")
                .trim();
    }


    // Gemini API request format
    static class GeminiRequest {
        public final List<Content> contents;

        public GeminiRequest(String text) {
            this.contents = List.of(new Content("user", List.of(new Part(text))));
        }

        static class Content {
            public final String role;
            public final List<Part> parts;

            public Content(String role, List<Part> parts) {
                this.role = role;
                this.parts = parts;
            }
        }

        static class Part {
            public final String text;

            public Part(String text) {
                this.text = text;
            }
        }
    }

    // Gemini API response format
    static class GeminiResponse {
        public List<Candidate> candidates;

        public List<String> getSuggestions() {
            return candidates.stream()
                    .map(c -> c.content.parts.get(0).text)
                    .toList();
        }

        static class Candidate {
            public Content content;
        }

        static class Content {
            public List<Part> parts;
        }

        static class Part {
            public String text;
        }
    }
}
