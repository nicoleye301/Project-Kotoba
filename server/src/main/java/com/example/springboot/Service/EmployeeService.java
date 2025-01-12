package com.example.springboot.Service;

import com.example.springboot.Entity.Employee;
import com.example.springboot.mapper.EmployeeMapper;
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
