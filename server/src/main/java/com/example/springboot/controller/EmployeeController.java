package com.example.springboot.controller;

import com.example.springboot.Entity.Employee;
import com.example.springboot.Service.EmployeeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/employee")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping("/selectAll")
    public ResponseEntity<List<Employee>> selectAll(){
        List<Employee> list = employeeService.selectAll();
        return ResponseEntity.ok(list);
    }
}
