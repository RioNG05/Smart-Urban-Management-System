package com.example.backend.Service;


import com.example.backend.Entity.UtilitiesInvoice;
import com.example.backend.Repository.UtilitiesInvoiceRepository;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UtilitiesInvoiceService {
    UtilitiesInvoiceRepository repository;

    public List<UtilitiesInvoice> findAll(){
        return repository.findAll();
    }

    public UtilitiesInvoice findById(Integer id){return repository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn với id: " +id));}

//    public UtilitiesInvoice
}
