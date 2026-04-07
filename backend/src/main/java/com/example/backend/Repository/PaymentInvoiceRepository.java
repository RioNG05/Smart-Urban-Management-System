package com.example.backend.Repository;

import com.example.backend.Entity.PaymentInvoice;
import com.example.backend.Enum.InvoiceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Objects;

@Repository
public interface PaymentInvoiceRepository extends JpaRepository<PaymentInvoice, Integer> {
    List<Objects> findAllByInvoiceTypeAndPaymentId(InvoiceType invoiceType, Integer paymentId);
    List<PaymentInvoice> findAllByPaymentId(Integer paymentId);
    List<Objects> findAllByInvoiceType(InvoiceType invoiceType);
}
