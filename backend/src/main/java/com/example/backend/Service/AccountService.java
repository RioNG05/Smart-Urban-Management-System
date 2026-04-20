package com.example.backend.Service;

import com.example.backend.DTO.Request.account.AccountCreateRequest;
import com.example.backend.DTO.Request.account.AccountUpdateRequest;
import com.example.backend.DTO.Response.AccountsResponse;
import com.example.backend.Entity.Account;
import com.example.backend.Entity.Role;
import com.example.backend.Enum.RoleEnum;
import com.example.backend.Repository.AccountRepository;
import com.example.backend.Repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AccountService {
    @Autowired
    private AccountRepository repository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private RoleService roleService;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

    public List<Account> findAll() {
        return repository.findAll();
    }

    public Account findById(java.lang.Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Account với ID: " + id));
    }

    public Account findByUsername(String username) {
        return repository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Account với username: " + username));
    }

    public Account create(AccountCreateRequest req) {
        Account account =new Account();
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        Role role =  roleRepository.findByRoleName(RoleEnum.USER).orElseThrow(() -> new RuntimeException("USER role not found"));

        account.setEmail(req.getEmail());
        account.setUsername(req.getUsername());
        account.setPassword(passwordEncoder.encode(req.getPassword()));
        account.setRole(role);
        account.setIsActive(req.getActive());

        return repository.save(account);
    }

    public Account update(Integer id, AccountUpdateRequest req) {
        Account account = findById(id);

        if (req.getEmail() != null) {
            account.setEmail(req.getEmail());
        }

        if (req.getUsername() != null) {
            account.setUsername(req.getUsername());
        }

        if (req.getPassword() != null) {
            account.setPassword(passwordEncoder.encode(req.getPassword()));
        }
        if (req.getRoleId() != null) {
            Role role =  roleRepository.findById(req.getRoleId()).orElseThrow(() -> new RuntimeException("USER role not found"));
            account.setRole(role);
        }
        if (req.getIsActive() != null) {
            account.setIsActive(req.getIsActive());
        }

        return repository.save(account);
    }

    public void delete(Integer id) {
        findById(id);
        repository.deleteById(id);
    }

    public void changeRole(Integer id, Integer roleId){
        Account account = findById(id);
        Role role = roleService.findById(roleId);
        account.setRole(role);
        repository.save(account);
    }

}
