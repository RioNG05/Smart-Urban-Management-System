package com.example.backend.Repository;

import com.example.backend.Entity.ServiceInvoice;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceInvoiceRepository extends JpaRepository<ServiceInvoice, Integer> {
}
