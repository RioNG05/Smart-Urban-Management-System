package com.example.backend.Service;


import com.example.backend.DTO.Request.utilitiesInvoice.UICreateRequest;
import com.example.backend.DTO.Request.utilitiesInvoice.UIUpdateRequest;
import com.example.backend.Entity.Apartment;
import com.example.backend.Entity.Services;
import com.example.backend.Entity.Contract;
import com.example.backend.Entity.UtilitiesInvoice;
import com.example.backend.Repository.ContractRepository;
import com.example.backend.Repository.ServicesRepository;
import com.example.backend.Repository.UtilitiesInvoiceRepository;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.swing.text.Utilities;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UtilitiesInvoiceService {
    @Autowired
    UtilitiesInvoiceRepository repository;
    @Autowired
    ServicesRepository servicesRepository;
    @Autowired
    ServicesService servicesService;
    @Autowired
    ApartmentService apartmentService;
    @Autowired
    ContractRepository contractRepository;


    public List<UtilitiesInvoice> findAll() {
        return repository.findAll();
    }

    public UtilitiesInvoice findById(Integer id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn với id: " + id));
    }

    public UtilitiesInvoice create(UICreateRequest req) {
        if(!apartmentService.isOwned(req.getApartmentId())){
            throw new RuntimeException("Căn hộ chưa được sở hữu");
        }

        Apartment apartment = apartmentService.findById(req.getApartmentId());

        Services electricServices = servicesService.findByServiceCode("ELEC_01");
        Services waterServices = servicesService.findByServiceCode("WAT_01");

        BigDecimal electricInvoice = electricServices.getFeePerUnit().multiply(BigDecimal.valueOf(req.getTotalElectricUsed()));
        BigDecimal waterInvoice = waterServices.getFeePerUnit().multiply(BigDecimal.valueOf(req.getTotalWaterUsed()));

        BigDecimal totalAmount = calculateTotalAmount(req.getApartmentId(), req.getTotalElectricUsed(), req.getTotalWaterUsed());

        UtilitiesInvoice UI = UtilitiesInvoice.builder()
                .apartment(apartment)
                .billingYear(req.getBillingYear())
                .billingMonth(req.getBillingMonth())
                .totalElectricUsed(electricInvoice)
                .totalWaterUsed(waterInvoice)
                .totalAmount(totalAmount)
                .status(Optional.ofNullable(req.getStatus()).orElse(0))
                .build();

        return repository.save(UI);
    }

    public UtilitiesInvoice update(Integer id, UIUpdateRequest req) {
        if(!apartmentService.isOwned(req.getApartmentId())){
            throw new RuntimeException("Căn hộ chưa được sở hữu");
        }

        UtilitiesInvoice UI = findById(id);

        Services waterServices = servicesService.findByServiceCode("WAT_01");
        BigDecimal waterInvoice = waterServices.getFeePerUnit().multiply(BigDecimal.valueOf(req.getTotalWaterUsed()));
        Services electricServices = servicesService.findByServiceCode("ELEC_01");
        BigDecimal electricInvoice = electricServices.getFeePerUnit().multiply(BigDecimal.valueOf(req.getTotalElectricUsed()));

        if (req.getBillingMonth() != null) {
            UI.setBillingMonth(req.getBillingMonth());
        }

        if (req.getBillingYear() != null) {
            UI.setBillingYear(req.getBillingYear());
        }

        if (req.getTotalWaterUsed() != null) {
            UI.setTotalWaterUsed(waterInvoice);
        }

        if (req.getApartmentId() != null) {
            Apartment apartment = apartmentService.findById(req.getApartmentId());
            UI.setApartment(apartment);
        }

        if (req.getTotalElectricUsed() != null) {
            UI.setTotalElectricUsed(electricInvoice);
        }

        if (req.getStatus() != null) {
            UI.setStatus(req.getStatus());
        }
        BigDecimal totalAmount = calculateTotalAmount(req.getApartmentId(), req.getTotalElectricUsed(), req.getTotalWaterUsed());
        UI.setTotalAmount(totalAmount);

        return repository.save(UI);
    }

    public void delete(Integer id) {
        findById(id);
        repository.deleteById(id);
    }

    private BigDecimal calculateTotalAmount(Integer apartmentId, Integer electricUsed, Integer waterUsed) {
        List<Services> services =
                servicesRepository.findByServiceCodeIn(
                        List.of("ELEC_01", "WAT_01", "MNG_FEE_MONTH"));

        Map<String, Services> serviceMap =
                services.stream()
                        .collect(Collectors.toMap(
                                Services::getServiceCode,
                                s -> s));

        BigDecimal electricCost =
                serviceMap.get("ELEC_01")
                        .getFeePerUnit()
                        .multiply(BigDecimal.valueOf(electricUsed));

        BigDecimal waterCost =
                serviceMap.get("WAT_01")
                        .getFeePerUnit()
                        .multiply(BigDecimal.valueOf(waterUsed));

        BigDecimal managementFee =
                serviceMap.get("MNG_FEE_MONTH")
                        .getFeePerUnit();

        BigDecimal totalAmount =
                electricCost
                        .add(waterCost)
                        .add(managementFee);

        Optional<Contract> contractOpt =
                contractRepository
                        .findFirstByApartmentIdAndStatus(apartmentId, 1);

        if (contractOpt.isPresent()) {

            Contract contract = contractOpt.get();

            if ("Rent".equals(contract.getContractType())) {

                totalAmount =
                        totalAmount.add(contract.getMonthlyRent());

            } else if ("Sale".equals(contract.getContractType())) {

                Apartment apartment =
                        apartmentService.findById(apartmentId);

                BigDecimal buyPrice =
                        apartment.getApartmentType()
                                .getCommonPriceForBuying();

                totalAmount =
                        totalAmount.add(buyPrice);
            }
        }

        return totalAmount;
    }

}
