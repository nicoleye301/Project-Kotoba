package com.example.server.controller;

import com.example.server.exception.CustomException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;

@RestController
public class WebController {
    @GetMapping("/hello")
    public String hello() {
        return "Hello, world!";
    }

    @GetMapping("/weather")
    public String weather() {
        return "Today is sunny!";
    }

    @GetMapping("/count")
    public Integer count() {
        throw new CustomException(500, "This is a custom exception.");
    }

    @GetMapping("/map")
    public ResponseEntity<HashMap<String, Object>> map() {
        HashMap<String, Object> map = new HashMap<>();
        map.put("name", "Alice");
        map.put("age", 20);
        return new ResponseEntity<>(map, HttpStatus.OK);
    }
}
