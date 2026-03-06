package com.example.backend.Service;

import com.example.backend.DTO.Request.AccountCreateRequest;
import com.example.backend.DTO.Request.AccountUpdateRequest;
import com.example.backend.Entity.Account;
import com.example.backend.Repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AccountService {
    @Autowired
    private AccountRepository repository;

    public List<Account> findAll() {
        return repository.findAll();
    }

    public Account findById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Account với ID: " + id));
    }

    public Account create(AccountCreateRequest req) {
        Account account =new Account();

        account.setEmail(req.getEmail());
        account.setUsername(req.getUsername());
        account.setPassword(req.getPassword());
        account.setRole(req.getRole());
        account.setIsActive(req.getActive());

        return repository.save(account);
    }

    public Account update(Integer id, AccountUpdateRequest req) {
        // Kiểm tra xem record có tồn tại không trước khi update
        Account account = findById(id);

        account.setEmail(req.getEmail());
        account.setUsername(req.getUsername());
        account.setPassword(req.getPassword());
        account.setRole(req.getRole());
        account.setIsActive(req.getActive());
        
        return repository.save(account); // Tạm thời save đè (Cần cẩn thận nếu entity gửi lên thiếu trường)
    }

    public void delete(Integer id) {
        // Kiểm tra tồn tại trước khi xóa
        findById(id); 
        repository.deleteById(id);
    }
}
