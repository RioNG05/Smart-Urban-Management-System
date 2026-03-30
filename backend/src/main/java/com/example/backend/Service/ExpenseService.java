package com.example.backend.Service;

import com.example.backend.DTO.Request.expense.ExpenseCreateRequest;
import com.example.backend.DTO.Request.expense.ExpenseUpdateRequest;
import com.example.backend.Entity.Account;
import com.example.backend.Entity.Apartment;
import com.example.backend.Entity.Expense;
import com.example.backend.Repository.ExpenseRepository;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ExpenseService {

    @Autowired
    ExpenseRepository repository;

    @Autowired
    ApartmentService apartmentService;

    @Autowired
    AccountService accountService;

    public List<Expense> findAll() {
        return repository.findAll();
    }

    public Expense findById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy expense id: " + id));
    }

    public List<Expense> findByApartmentId(Integer apartmentId) {
        return repository.findAllByApartmentId(apartmentId);
    }

    public List<Expense> findByCreatedBy(Integer createdBy) {
        return repository.findAllByCreatedById(createdBy);
    }

    public Expense create(ExpenseCreateRequest request) {

        Apartment apartment = apartmentService.findById(request.getApartmentId());
        Account account = accountService.findById(request.getCreatedById());

        Expense expense = Expense.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .apartment(apartment)
                .createdBy(account)
                .amount(request.getAmount())
                .expenseDate(request.getExpenseDate())
                .status(request.getStatus())
                .build();

        return repository.save(expense);
    }

    public Expense update(Integer id, ExpenseUpdateRequest request) {
        Expense expense = findById(id);

        if(request.getTitle() != null){
            expense.setTitle(request.getTitle());
        }

        if(request.getDescription() != null){
            expense.setDescription(request.getDescription());
        }

        if(request.getApartmentId() != null){
            Apartment apartment = apartmentService.findById(request.getApartmentId());
            expense.setApartment(apartment);
        }

        if(request.getCreatedById() != null){
            Account account = accountService.findById(request.getCreatedById());
            expense.setCreatedBy(account);
        }

        if(request.getAmount() != null){
            expense.setAmount(request.getAmount());
        }

        if(request.getExpenseDate() != null){
            expense.setExpenseDate(request.getExpenseDate());
        }

        if(request.getStatus() != null){
            expense.setStatus(request.getStatus());
        }

        return repository.save(expense);
    }

    public void delete(Integer id) {
        findById(id);
        repository.deleteById(id);
    }
}