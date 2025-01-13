package com.example.server.mapper;

import com.example.server.Entity.Employee;

import java.util.List;

public interface EmployeeMapper {
    List<Employee> selectAll();
}
