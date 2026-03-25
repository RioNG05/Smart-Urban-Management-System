package com.example.backend.Service;

import com.example.backend.DTO.Request.contract.ContractCreateRequest;
import com.example.backend.DTO.Request.contract.ContractUpdateRequest;
import com.example.backend.DTO.Request.role.RoleCreateRequest;
import com.example.backend.DTO.Request.role.RoleUpdateRequest;
import com.example.backend.Entity.Account;
import com.example.backend.Entity.Apartment;
import com.example.backend.Entity.Contract;
import com.example.backend.Entity.Role;
import com.example.backend.Repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleService {
    @Autowired
    private RoleRepository repository;

    public List<Role> findAll(){return repository.findAll();}

    public Role findById(Integer id){
        return repository.findById(id).orElseThrow(()-> new RuntimeException("Role not found"));
    }

    public Role create(RoleCreateRequest request) {
        Role role = Role.builder()
                .roleName(request.getRoleName())
                .build();

        return repository.save(role);
    }

    public Role update(Integer id, RoleUpdateRequest request) {
        Role role = findById(id);

        if(request.getRoleName() != null){
            role.setRoleName(request.getRoleName());
        }

        return repository.save(role);
    }

    public void delete(Integer id) {
        findById(id);
        repository.deleteById(id);
    }
}
