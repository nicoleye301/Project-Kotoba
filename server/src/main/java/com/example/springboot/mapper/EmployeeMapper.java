package com.example.springboot.mapper;

import com.example.springboot.Entity.Employee;

import java.util.List;

public interface EmployeeMapper {
    List<Employee> selectAll();
}
