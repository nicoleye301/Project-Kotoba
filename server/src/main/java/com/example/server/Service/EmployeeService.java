package com.example.server.Service;

import com.example.server.Entity.Employee;
import com.example.server.mapper.EmployeeMapper;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    @Resource
    private EmployeeMapper employeeMapper;


    public List<Employee> selectAll() {
        return employeeMapper.selectAll();
    }
}
