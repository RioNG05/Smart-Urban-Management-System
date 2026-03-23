package com.example.backend.Repository;

import com.example.backend.Entity.UtilitiesInvoice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UtilitiesInvoiceRepository extends JpaRepository<UtilitiesInvoice, Integer> {
    List<UtilitiesInvoice> findAllByApartmentId(Integer apartmentId);
}
