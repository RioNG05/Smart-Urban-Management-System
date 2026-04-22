package com.example.backend.Service;

import com.example.backend.DTO.Request.payment.PaymentRequest;
import com.example.backend.DTO.Request.payment_invoice.PaymentInvoiceCreateRequest;
import com.example.backend.DTO.Response.payment.VNPayResponse;
import com.example.backend.Entity.Payment;
import com.example.backend.Entity.PaymentInvoice;
import com.example.backend.Entity.ServiceInvoice;
import com.example.backend.Entity.UtilitiesInvoice;
import com.example.backend.Enum.InvoiceStatus;
import com.example.backend.Enum.InvoiceType;
import com.example.backend.Enum.PaymentStatus;
import com.example.backend.Enum.TransactionCode;
import com.example.backend.Repository.PaymentInvoiceRepository;
import com.example.backend.Repository.PaymentRepository;
import com.example.backend.Repository.ServiceInvoiceRepository;
import com.example.backend.Repository.UtilitiesInvoiceRepository;
import com.example.backend.config.VNPayConfig;
import com.example.backend.util.VNPayUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class VNPayService {

    @Autowired
    private VNPayConfig vnPayConfig;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private PaymentInvoiceRepository paymentInvoiceRepository;

    @Autowired
    private UtilitiesInvoiceRepository utilitiesInvoiceRepository;
    @Autowired
    private ServiceInvoiceRepository serviceInvoiceRepository;
    @Autowired
    private PaymentInvoiceService paymentInvoiceService;

    public VNPayResponse createPaymentUrl(HttpServletRequest request, PaymentRequest paymentRequest) {
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String vnp_TxnRef = VNPayUtil.getRandomNumber(8);
        String vnp_IpAddr = VNPayUtil.getIpAddress(request);
        String vnp_TmnCode = vnPayConfig.getVnp_TmnCode();

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        
        // Amount is in VND, multiplied by 100
        BigDecimal amount = findAmount(paymentRequest.getInvoices()).multiply(new BigDecimal(100));
        vnp_Params.put("vnp_Amount", String.valueOf(amount.longValue()));
        
        vnp_Params.put("vnp_CurrCode", "VND");
        
        // Optional bank code
        // vnp_Params.put("vnp_BankCode", "NCB");

        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", paymentRequest.getOrderInfo());
        vnp_Params.put("vnp_OrderType", "other");
        vnp_Params.put("vnp_Locale", "vn");

        vnp_Params.put("vnp_ReturnUrl", vnPayConfig.getVnp_ReturnUrl());
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        formatter.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        // Sort Map
        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                // Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                // Build query
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = VNPayUtil.hmacSHA512(vnPayConfig.getVnp_HashSecret(), hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = vnPayConfig.getVnp_PayUrl() + "?" + queryUrl;

        // Create Payment log in DB

        Payment payment = Payment.builder()
                .amount(amount)
                .transactionId(vnp_TxnRef)
                .orderInfo(paymentRequest.getOrderInfo())
                .paymentGateway("VNPAY")
                .paymentStatus(0)
                .build();
        paymentRepository.save(payment);

        saveInvoicesByList(paymentRequest.getInvoices(), payment);

        VNPayResponse vnPayResponse = new VNPayResponse();
        vnPayResponse.setPaymentUrl(paymentUrl);

        return vnPayResponse;
    }

    @Transactional
    public Integer orderReturn(HttpServletRequest request) {
        Map<String, String> fields = new HashMap<>();
        for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements();) {
            String fieldName = params.nextElement();
            String fieldValue = request.getParameter(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                fields.put(fieldName, fieldValue);
            }
        }

        String vnp_SecureHash = request.getParameter("vnp_SecureHash");
        if (fields.containsKey("vnp_SecureHashType")) {
            fields.remove("vnp_SecureHashType");
        }
        if (fields.containsKey("vnp_SecureHash")) {
            fields.remove("vnp_SecureHash");
        }
        
        String signValue = hashAllFields(fields);

        /*check cai checksum t cung eo hieu lam ;-; nhung ma dai khai la neu khong phai url do minh cung cap thi khong xu ly*/
        if (signValue.equals(vnp_SecureHash)) {
            String transactionRef = request.getParameter("vnp_TxnRef");

            Payment payment = paymentRepository.findByTransactionId(transactionRef).orElse(null);

            /* Kiem tra xem co payment trong he thong khong */
            if(Objects.isNull(payment)){
                return TransactionCode.NOT_FOUND.getCode();
            }

            /*Kiem tra xem cai payment da tim thay day da duoc thanh toan chua */
            if(!Objects.equals(payment.getPaymentStatus(), PaymentStatus.SUCCESS.getCode())){
                String responseCode = request.getParameter("vnp_ResponseCode");

                /* kiem tra xem cai response code co thanh cong khong de xu ly cai payment*/
                if(responseCode.equals("00")){
                    updateInvoiceStatus(payment);
                    return TransactionCode.SUCCESS.getCode();
                } else{
                    return TransactionCode.FAILED.getCode();
                }
            }
            return TransactionCode.SUCCEED_ALREADY.getCode();
        }
        return TransactionCode.WRONG_CHECKSUM.getCode(); // Invalid checksum
    }

    private String hashAllFields(Map<String, String> fields) {
        List<String> fieldNames = new ArrayList<>(fields.keySet());
        Collections.sort(fieldNames);
        StringBuilder sb = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = fields.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                sb.append(fieldName);
                sb.append("=");
                sb.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
            }
            if (itr.hasNext()) {
                sb.append("&");
            }
        }
        return VNPayUtil.hmacSHA512(vnPayConfig.getVnp_HashSecret(), sb.toString());
    }

    private BigDecimal findAmount(List<PaymentInvoiceCreateRequest> invoices){
        BigDecimal totalAmount = BigDecimal.ZERO;

        for(PaymentInvoiceCreateRequest item: invoices){
            if(item.getInvoiceType().equals(InvoiceType.UTILITIES_INVOICE)){
                UtilitiesInvoice invoice = utilitiesInvoiceRepository.findById(item.getInvoiceId()).orElseThrow(()-> new RuntimeException("Cant found utilities invoice"));
                totalAmount = totalAmount.add(invoice.getTotalAmount());
            }
            if(item.getInvoiceType().equals(InvoiceType.SERVICES_INVOICE)){
                ServiceInvoice invoice = serviceInvoiceRepository.findById(item.getInvoiceId()).orElseThrow(()-> new RuntimeException("Cant found utilities invoice"));
                totalAmount = totalAmount.add(invoice.getAmount());
            }
        }

        return totalAmount;
    }

    private void saveInvoicesByList(List<PaymentInvoiceCreateRequest> invoices,Payment payment){
        for(PaymentInvoiceCreateRequest item : invoices){
            PaymentInvoice pi = PaymentInvoice.builder()
                    .payment(payment)
                    .invoiceType(item.getInvoiceType())
                    .invoiceId(item.getInvoiceId())
                    .invoiceMonth(item.getInvoiceMonth())
                    .invoiceYear(item.getInvoiceYear())
                    .amount(paymentInvoiceService.findAmountByInvoiceId(item.getInvoiceId(), item.getInvoiceType()))
                    .build();
            paymentInvoiceRepository.save(pi);
        }
    }

    @Transactional
    private void updateInvoiceStatus(Payment payment){
        List<PaymentInvoice> list = paymentInvoiceRepository.findAllByPaymentId(payment.getId());
        for(PaymentInvoice item: list){
            if(item.getInvoiceType().equals(InvoiceType.UTILITIES_INVOICE)){
                UtilitiesInvoice invoice = utilitiesInvoiceRepository.findById(item.getInvoiceId()).orElseThrow(()-> new RuntimeException("Cant found utilities invoice"));
                if(invoice.getStatus().equals(InvoiceStatus.PAID.getCode())){
                    throw new RuntimeException("Invoice id: " + item.getInvoiceId() + " is paid");
                }
                invoice.setStatus(InvoiceStatus.PAID.getCode());
                utilitiesInvoiceRepository.save(invoice);
            }

            if(item.getInvoiceType().equals(InvoiceType.SERVICES_INVOICE)){
                ServiceInvoice invoice = serviceInvoiceRepository.findById(item.getInvoiceId()).orElseThrow(()-> new RuntimeException("Cant found utilities invoice"));
                if(invoice.getStatus().equals(InvoiceStatus.PAID.getCode())){
                    throw new RuntimeException("Invoice id: " + item.getInvoiceId() + " is paid");
                }
                invoice.setStatus(InvoiceStatus.PAID.getCode());
                serviceInvoiceRepository.save(invoice);
            }
        }

        payment.setPaymentStatus(PaymentStatus.SUCCESS.getCode());
        paymentRepository.save(payment);
    }
}
