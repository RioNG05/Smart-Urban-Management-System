package com.example.backend.Service;

import com.example.backend.DTO.Request.AccountCreateRequest;
import com.example.backend.DTO.Request.AccountUpdateRequest;
import com.example.backend.Entity.Account;
import com.example.backend.Entity.Role;
import com.example.backend.Repository.AccountRepository;
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
    private RoleService roleService;

    public List<Account> findAll() {
        return repository.findAll();
    }

    public Account findById(java.lang.Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Account với ID: " + id));
    }

    public Account create(AccountCreateRequest req) {
        Account account =new Account();
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

        account.setEmail(req.getEmail());
        account.setUsername(req.getUsername());
        account.setPassword(passwordEncoder.encode(req.getPassword()));
        Role role = roleService.findById(req.getRoleId());
        account.setRole(role);
        account.setIsActive(req.getActive());

        return repository.save(account);
    }

    public Account update(java.lang.Integer id, AccountUpdateRequest req) {
        // Kiểm tra xem record có tồn tại không trước khi update
        Account account = findById(id);

        account.setEmail(req.getEmail());
        account.setUsername(req.getUsername());
        account.setPassword(req.getPassword());
        Role role = roleService.findById(req.getRoleId());
        account.setRole(role);
        account.setIsActive(req.getActive());
        
        return repository.save(account);
    }

    public void delete(java.lang.Integer id) {
        // Kiểm tra tồn tại trước khi xóa
        findById(id); 
        repository.deleteById(id);
    }

}
