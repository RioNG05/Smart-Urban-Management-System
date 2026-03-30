package com.example.backend.Repository;

import com.example.backend.Entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Integer> {

    List<Expense> findAllByApartmentId(Integer apartmentId);

    List<Expense> findAllByCreatedById(Integer createdBy);

}