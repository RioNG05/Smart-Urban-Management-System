package com.example.backend.Service;

import com.example.backend.DTO.Request.contract.ContractCreateRequest;
import com.example.backend.DTO.Request.contract.ContractUpdateRequest;
import com.example.backend.DTO.Request.serviceInvoce.SICreateRequest;
import com.example.backend.DTO.Request.serviceInvoce.SIUpdateRequest;
import com.example.backend.Entity.*;
import com.example.backend.Repository.BookingServiceRepository;
import com.example.backend.Repository.ServiceInvoiceRepository;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ServiceInvoiceService {
    @Autowired
    ServiceInvoiceRepository repository;
    @Autowired
    BookingServiceRepository bookingServiceRepository;

    public List<ServiceInvoice> findAll() {
        return repository.findAll();
    }

    public ServiceInvoice findById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service invoice not found for id: " + id));
    }

    public ServiceInvoice create(SICreateRequest request) {
        BookingService bookingService = bookingServiceRepository.findById(request.getBookingServiceId())
                .orElseThrow(() -> new RuntimeException("Booking service not found for id: " + request.getBookingServiceId()));

        ServiceInvoice serviceInvoice = ServiceInvoice.builder()
                .bookingService(bookingService)
                .amount(request.getAmount())
                .status(Optional.ofNullable(request.getStatus()).orElse(0))
                .paymentDate(request.getPaymentDate())
                .build();

        return repository.save(serviceInvoice);
    }

    public ServiceInvoice update(Integer id, SIUpdateRequest request) {
        ServiceInvoice serviceInvoice = findById(id);

        if(request.getAmount() != null){
            serviceInvoice.setAmount(request.getAmount());
        }
        if(request.getBookingServiceId() != null){
            BookingService bookingService = bookingServiceRepository.findById(request.getBookingServiceId())
                    .orElseThrow(() -> new RuntimeException("Booking service not found for id: " + request.getBookingServiceId()));
            serviceInvoice.setBookingService(bookingService);
        }
        if(request.getStatus() != null){
            serviceInvoice.setStatus(request.getStatus());
        }
        if(request.getPaymentDate() != null){
            serviceInvoice.setPaymentDate(request.getPaymentDate());
        }

        return repository.save(serviceInvoice);
    }

    public void delete(Integer id) {
        findById(id);
        repository.deleteById(id);
    }
}
