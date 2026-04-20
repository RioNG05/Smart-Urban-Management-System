package com.example.backend.Service;


import com.example.backend.DTO.Request.utilitiesInvoice.UICreateRequest;
import com.example.backend.DTO.Request.utilitiesInvoice.UIUpdateRequest;
import com.example.backend.Entity.*;
import com.example.backend.Repository.*;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UtilitiesInvoiceService {
    @Autowired
    UtilitiesInvoiceRepository repository;
    @Autowired
    MandatoryServicesRepository mandatoryServicesRepository;
    @Autowired
    ApartmentService apartmentService;
    @Autowired
    IoTSyncLogRepository ioTSyncLogRepository;


    public List<UtilitiesInvoice> findAll() {
        Sort sort = Sort.by(
                Sort.Order.desc("billingYear"),
                Sort.Order.desc("billingMonth")
        );
        return repository.findAll(sort);
    }

    public List<UtilitiesInvoice> findAllByApartmentId(Integer apartmentId){
        return repository.findAllByApartmentId(apartmentId);
    }

    public UtilitiesInvoice findById(Integer id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Invoice not found for id: " + id));
    }

    public UtilitiesInvoice create(UICreateRequest req) {
        if(!apartmentService.isOwned(req.getApartmentId())){
            throw new RuntimeException("Apartment is not owned yet");
        }

        Apartment apartment = apartmentService.findById(req.getApartmentId());

        IoTSyncLog[] listIoT = getLatestIoT(req.getApartmentId());
        IoTSyncLog thisMonth = listIoT[0];
        IoTSyncLog lastMonth = listIoT[1];

        BigDecimal totalAmount = calculateTotalAmount(req.getApartmentId());

        UtilitiesInvoice invoice = UtilitiesInvoice.builder()
                .apartment(apartment)
                .billingYear(req.getBillingYear())
                .billingMonth(req.getBillingMonth())
                .totalElectricUsed(getElectricityUsedOfApartment(thisMonth,lastMonth))
                .totalWaterUsed(getWaterUsedOfApartment(thisMonth,lastMonth))
                .totalAmount(totalAmount)
                .status(Optional.ofNullable(req.getStatus()).orElse(0))
                .build();

        return repository.save(invoice);
    }

    public UtilitiesInvoice update(Integer id, UIUpdateRequest req) {
        if(!apartmentService.isOwned(req.getApartmentId())){
            throw new RuntimeException("Apartment is not owned yet");
        }

        UtilitiesInvoice invoice = findById(id);

        IoTSyncLog[] listIoT = getLatestIoT(req.getApartmentId());
        IoTSyncLog thisMonth = listIoT[0];
        IoTSyncLog lastMonth = listIoT[1];

        if (req.getBillingMonth() != null) {
            invoice.setBillingMonth(req.getBillingMonth());
        }

        if (req.getBillingYear() != null) {
            invoice.setBillingYear(req.getBillingYear());
        }

        if (req.getApartmentId() != null) {
            Apartment apartment = apartmentService.findById(req.getApartmentId());
            invoice.setApartment(apartment);
        }

        if (req.getStatus() != null) {
            invoice.setStatus(req.getStatus());
        }
        BigDecimal totalAmount = calculateTotalAmount(req.getApartmentId());
        invoice.setTotalElectricUsed(getElectricityUsedOfApartment(thisMonth, lastMonth));
        invoice.setTotalWaterUsed(getWaterUsedOfApartment(thisMonth,lastMonth));
        invoice.setTotalAmount(totalAmount);

        return repository.save(invoice);
    }

    public void delete(Integer id) {
        findById(id);
        repository.deleteById(id);
    }

    private BigDecimal calculateTotalAmount(Integer apartmentId) {
        MandatoryServices electricityService = mandatoryServicesRepository.findByServiceCode("ELEC_01").orElseThrow(() -> new RuntimeException("Electricity service not found"));
        MandatoryServices waterService = mandatoryServicesRepository.findByServiceCode("WAT_01").orElseThrow(() -> new RuntimeException("Water service not found"));
        MandatoryServices monthlyFee = mandatoryServicesRepository.findByServiceCode("MNG_FEE").orElseThrow(() -> new RuntimeException("Monthly fee service not found"));
//
        IoTSyncLog[] listIoT = getLatestIoT(apartmentId);
        IoTSyncLog thisMonth = listIoT[0];
        IoTSyncLog lastMonth = listIoT[1];

        BigDecimal electricityUsed = getElectricityUsedOfApartment(thisMonth, lastMonth);
        BigDecimal waterUsed = getWaterUsedOfApartment(thisMonth, lastMonth);

        BigDecimal electricityAmount = electricityUsed.multiply(electricityService.getBasePrice());
        BigDecimal waterAmount = waterUsed.multiply(waterService.getBasePrice());

        return electricityAmount.add(waterAmount).add(monthlyFee.getBasePrice());
    }

    private BigDecimal getElectricityUsedOfApartment(IoTSyncLog thisMonth, IoTSyncLog lastMonth){
        return thisMonth.getElectricityEndNum().subtract(lastMonth.getElectricityEndNum());
    }

    private BigDecimal getWaterUsedOfApartment(IoTSyncLog thisMonth, IoTSyncLog lastMonth){
        return  thisMonth.getWaterEndNum().subtract(lastMonth.getWaterEndNum());
    }

    private IoTSyncLog[] getLatestIoT(Integer apartmentId){
        List<IoTSyncLog> listIoT = ioTSyncLogRepository.findAllByApartmentIdOrderByLogDateDesc(apartmentId);
        if(listIoT.size() <2){
            throw new RuntimeException("Insufficient IoT log data");
        }

        return new IoTSyncLog[]{listIoT.get(0), listIoT.get(1)};
    }
}
