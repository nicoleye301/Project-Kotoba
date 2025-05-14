package com.example.server.config;

import com.example.server.websocket.KHandshakeInterceptor;
import com.example.server.websocket.KTextWebSocket;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(new KTextWebSocket(), "/ws")
                .addInterceptors(new KHandshakeInterceptor())
                .setAllowedOrigins("*");
    }
}