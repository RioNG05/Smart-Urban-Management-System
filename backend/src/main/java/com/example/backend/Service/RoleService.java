package com.example.backend.Service;

import com.example.backend.Entity.Role;
import com.example.backend.Repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleService {
    @Autowired
    private RoleRepository roleRepository;

    public List<Role> findAll(){return roleRepository.findAll();}

    public Role findById(Integer id){
        return roleRepository.findById(id).orElseThrow(()-> new RuntimeException("Role not found"));
    }
}
