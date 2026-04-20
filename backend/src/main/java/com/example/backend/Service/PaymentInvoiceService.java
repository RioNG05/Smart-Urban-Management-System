package com.example.backend.Service;

import com.example.backend.DTO.Request.contract.ContractCreateRequest;
import com.example.backend.DTO.Request.contract.ContractUpdateRequest;
import com.example.backend.DTO.Request.payment_invoice.PaymentInvoiceCreateRequest;
import com.example.backend.Entity.*;
import com.example.backend.Enum.InvoiceType;
import com.example.backend.Repository.*;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentInvoiceService {
    @Autowired
    PaymentInvoiceRepository repository;
    @Autowired
    PaymentRepository paymentRepository;
    @Autowired
    UtilitiesInvoiceRepository utilitiesInvoiceRepository;
    @Autowired
    ServiceInvoiceRepository serviceInvoiceRepository;

    public List<PaymentInvoice> findAll() {
        return repository.findAll();
    }

    public PaymentInvoice findById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contract not found for id: " + id));
    }

    public List<Objects> findAllByInvoiceTypeAndPaymentId(Integer paymentId, InvoiceType invoiceType){
        return repository.findAllByInvoiceTypeAndPaymentId(invoiceType, paymentId);
    }

    public List<PaymentInvoice> findAllByPaymentId(Integer paymentId){
        return repository.findAllByPaymentId(paymentId);
    }
    public List<Objects> findAllByInvoiceType(InvoiceType invoiceType){
        return repository.findAllByInvoiceType(invoiceType);
    }

    public PaymentInvoice create(PaymentInvoiceCreateRequest request) {
        Payment payment = paymentRepository.findById(request.getPaymentId()).orElseThrow(() -> new RuntimeException("Cant found payment by id: " + request.getPaymentId()));
        PaymentInvoice paymentInvoice = PaymentInvoice.builder()
                .payment(payment)
                .invoiceType(request.getInvoiceType())
                .invoiceMonth(request.getInvoiceMonth())
                .invoiceYear(request.getInvoiceYear())
                .amount(findAmountByInvoiceId(request.getInvoiceId(), request.getInvoiceType()))
                .build();

        if(findInvoiceByType(request.getInvoiceType(), request.getInvoiceId())){
            paymentInvoice.setInvoiceId(request.getInvoiceId());
        }else{
            throw new RuntimeException("Can found " + request.getInvoiceType() + " with id: " +request.getInvoiceId());
        }

        return repository.save(paymentInvoice);
    }

//    public Contract update(Integer id, ContractUpdateRequest request) {
//        Contract contract = findById(id);
//
//        if(request.getApartmentId() != null){
//            Apartment apartment = apartmentService.findById(request.getApartmentId());
//            contract.setApartment(apartment);
//        }
//
//        if(request.getAccountId() != null){
//            Account account = accountService.findById(request.getAccountId());
//            contract.setAccount(account);
//        }
//
//        if(request.getContractType() != null){
//            contract.setContractType(request.getContractType());
//        }
//
//        if(request.getStartDate() != null){
//            contract.setStartDate(request.getStartDate());
//        }
//
//        if(request.getMonthlyRent() != null){
//            contract.setMonthlyRent(request.getMonthlyRent());
//        }
//
//        if(request.getStatus() != null){
//            contract.setStatus(request.getStatus());
//        }
//
//        if(request.getEndDate() != null){
//            contract.setEndDate(request.getEndDate());
//        }
//
//        if(request.getCreatedById() != null){
//            contract.setCreatedById(request.getCreatedById());
//        }
//
//        return repository.save(contract);
//    }

    public void delete(Integer id) {
        findById(id);
        repository.deleteById(id);
    }

    /**
     * Check xem co ton tai invoice id khong
     * @param invoiceType kieu invoice
     * @param invoiceId invoice id
     * @return true neu co, false neu khong
     */
    public boolean findInvoiceByType(InvoiceType invoiceType, Integer invoiceId){
        if(invoiceType.equals(InvoiceType.SERVICES_INVOICE)){
            ServiceInvoice invoice = serviceInvoiceRepository.findById(invoiceId).orElse(null);
            return !Objects.isNull(invoice);
        }
        if(invoiceType.equals(InvoiceType.UTILITIES_INVOICE)){
            UtilitiesInvoice invoice = utilitiesInvoiceRepository.findById(invoiceId).orElse(null);
            return !Objects.isNull(invoice);
        }
        return false;
    }

    /**
     * Tim gia tien dua theo invoice id va invoice type
     * @param invoiceId
     * @param invoiceType
     * @return
     */
    public BigDecimal findAmountByInvoiceId(Integer invoiceId, InvoiceType invoiceType){
        BigDecimal amount = BigDecimal.ZERO;

        if(invoiceType.equals(InvoiceType.UTILITIES_INVOICE)){
            UtilitiesInvoice invoice = utilitiesInvoiceRepository.findById(invoiceId).orElseThrow(()-> new RuntimeException("Cant found utilities invoice"));
            amount = invoice.getTotalAmount();
        }
        if(invoiceType.equals(InvoiceType.SERVICES_INVOICE)){
            ServiceInvoice invoice = serviceInvoiceRepository.findById(invoiceId).orElseThrow(()-> new RuntimeException("Cant found utilities invoice"));
            amount = invoice.getAmount();
        }

        return amount;
    }

}
