package com.example.backend.Service;

import com.example.backend.DTO.Request.payment.PaymentRequest;
import com.example.backend.DTO.Response.payment.VNPayResponse;
import com.example.backend.Entity.Payment;
import com.example.backend.Repository.PaymentRepository;
import com.example.backend.Repository.UtilitiesInvoiceRepository;
import com.example.backend.Entity.UtilitiesInvoice;
import com.example.backend.config.VNPayConfig;
import com.example.backend.util.VNPayUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class VNPayService {

    @Autowired
    private VNPayConfig vnPayConfig;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private UtilitiesInvoiceRepository utilitiesInvoiceRepository;

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
        BigDecimal amount = paymentRequest.getAmount().multiply(new BigDecimal(100));
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

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
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
                .invoiceId(paymentRequest.getInvoiceId())
                .invoiceType(paymentRequest.getInvoiceType())
                .amount(paymentRequest.getAmount())
                .transactionId(vnp_TxnRef)
                .orderInfo(paymentRequest.getOrderInfo())
                .paymentGateway("VNPAY")
                .paymentStatus("PENDING")
                .build();
        paymentRepository.save(payment);

        VNPayResponse response = new VNPayResponse();
        response.setCode("00");
        response.setMessage("Success");
        response.setPaymentUrl(paymentUrl);

        return response;
    }

    public int orderReturn(HttpServletRequest request) {
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
        
        if (signValue.equals(vnp_SecureHash)) {
            String transactionRef = request.getParameter("vnp_TxnRef");
            
            // Find in DB
            Optional<Payment> optionalPayment = paymentRepository.findByTransactionId(transactionRef);
            if(optionalPayment.isPresent()){
                Payment payment = optionalPayment.get();
                if ("00".equals(request.getParameter("vnp_TransactionStatus"))) {
                    payment.setPaymentStatus("SUCCESS");
                    payment.setPaymentDate(LocalDateTime.now());
                    paymentRepository.save(payment);
                    updateInvoiceStatus(payment);
                    return 1;
                } else {
                    payment.setPaymentStatus("FAILED");
                    paymentRepository.save(payment);
                    return 0;
                }
            }
        }
        return -1; // Error or tampered
    }
    
    // IPN handler if needed by server to server call
    public String handleIPN(HttpServletRequest request) {
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
        if (signValue.equals(vnp_SecureHash)) {
             String transactionRef = request.getParameter("vnp_TxnRef");
             Optional<Payment> optionalPayment = paymentRepository.findByTransactionId(transactionRef);
             if(optionalPayment.isPresent()){
                 Payment payment = optionalPayment.get();
                 if(!"SUCCESS".equals(payment.getPaymentStatus())) {
                     if ("00".equals(request.getParameter("vnp_TransactionStatus"))) {
                         payment.setPaymentStatus("SUCCESS");
                         payment.setPaymentDate(LocalDateTime.now());
                         updateInvoiceStatus(payment);
                     } else {
                         payment.setPaymentStatus("FAILED");
                     }
                     paymentRepository.save(payment);
                 }
                 return "{\"RspCode\":\"00\",\"Message\":\"Confirm Success\"}";
             } else {
                 return "{\"RspCode\":\"01\",\"Message\":\"Order not found\"}";
             }
        } else {
            return "{\"RspCode\":\"97\",\"Message\":\"Invalid Checksum\"}";
        }
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

    private void updateInvoiceStatus(Payment payment) {
        if ("UTILITIES".equalsIgnoreCase(payment.getInvoiceType())) {
            Optional<UtilitiesInvoice> invoiceOpt = utilitiesInvoiceRepository.findById(payment.getInvoiceId());
            if (invoiceOpt.isPresent()) {
                UtilitiesInvoice invoice = invoiceOpt.get();
                invoice.setStatus(1);
                utilitiesInvoiceRepository.save(invoice);
            }
        }
    }
}
