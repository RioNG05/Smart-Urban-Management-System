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

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AccountService {
    @Autowired
    private AccountRepository repository;
    @Autowired
    private RoleService roleService;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

    public List<Account> findAll() {
        return repository.findAll();
    }

    public Account findById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Account với ID: " + id));
    }

    public Account create(AccountCreateRequest req) {

        if (repository.existsByUsername(req.getUsername())) {
            throw new RuntimeException("Tên người dùng đã được sử dụng");
        }

        if (repository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng");
        }


        Account account = new Account();

        account.setEmail(req.getEmail());
        account.setUsername(req.getUsername());
        account.setPassword(passwordEncoder.encode(req.getPassword()));
        Role role = roleService.findById(req.getRoleId());
        account.setRole(role);

        return repository.save(account);
    }

    public Account update(Integer id, AccountUpdateRequest req) {
        // Kiểm tra xem record có tồn tại không trước khi update
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
            Role role = roleService.findById(req.getRoleId());
            account.setRole(role);
        }
        if (req.getActive() != null) {
            account.setIsActive(req.getActive());
        }

        return repository.save(account);
    }

    public void delete(Integer id) {
        findById(id);
        repository.deleteById(id);
    }

}
