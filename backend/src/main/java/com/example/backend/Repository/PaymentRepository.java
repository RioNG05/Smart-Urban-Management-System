package com.example.backend.Repository;

import com.example.backend.Entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    Optional<Payment> findByTransactionId(String transactionId);
//    Optional<Payment> findByInvoiceIdAndInvoiceType(Integer invoiceId, String invoiceType);
}
