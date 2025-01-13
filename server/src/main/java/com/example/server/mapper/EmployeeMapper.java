package com.example.server.mapper;

import com.example.server.entity.Employee;

import java.util.List;

public interface EmployeeMapper {
    List<Employee> selectAll();
}
