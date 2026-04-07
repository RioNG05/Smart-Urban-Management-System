package com.example.backend.Service;

import com.example.backend.DTO.Request.payment.PaymentRequest;
import com.example.backend.DTO.Response.ApiResponse;
import com.example.backend.DTO.Response.payment.VNPayResponse;
import com.example.backend.Entity.Payment;
import com.example.backend.Enum.InvoiceType;
import com.example.backend.Enum.PaymentStatus;
import com.example.backend.Enum.TransactionCode;
import com.example.backend.Enum.UtilitiesInvoiceStatus;
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
                .invoiceType(paymentRequest.getInvoiceType())
                .invoiceMonth(paymentRequest.getInvoiceMonth())
                .invoiceYear(paymentRequest.getInvoiceYear())
                .amount(paymentRequest.getAmount())
                .transactionId(vnp_TxnRef)
                .orderInfo(paymentRequest.getOrderInfo())
                .paymentGateway("VNPAY")
                .paymentStatus(0)
                .build();

        if(paymentRequest.getInvoiceType().equals(InvoiceType.UTILITIES_INVOICE)){
            Integer invoiceId = paymentRequest.getInvoiceId()[0];
            payment.setInvoiceId(invoiceId);
        }
        paymentRepository.save(payment);

        VNPayResponse vnPayResponse = new VNPayResponse();
        vnPayResponse.setPaymentUrl(paymentUrl);

        return vnPayResponse;
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

            Payment payment = paymentRepository.findByTransactionId(transactionRef).orElse(null);

            if(Objects.isNull(payment)){
                return TransactionCode.NOT_FOUND.getCode();
            }

            if(!Objects.equals(payment.getPaymentStatus(), PaymentStatus.SUCCESS.getCode())){
                String responseCode = request.getParameter("vnp_ResponseCode");
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
                 if(payment.getPaymentStatus() == 1) {
                     if ("00".equals(request.getParameter("vnp_TransactionStatus"))) {
                         payment.setPaymentStatus(1);
                         payment.setPaymentDate(LocalDateTime.now());
                         updateInvoiceStatus(payment);
                     } else {
                         payment.setPaymentStatus(2);
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

    private void updateInvoiceStatus(Payment payment){
        if(payment.getInvoiceType().equals(InvoiceType.UTILITIES_INVOICE)){
            updateUtilitiesInvoiceStatus(payment);
        }
    }

    private void updateUtilitiesInvoiceStatus(Payment payment){
        UtilitiesInvoice utilitiesInvoice = utilitiesInvoiceRepository.findById(payment.getInvoiceId()).orElse(null);

        if(Objects.isNull(utilitiesInvoice)){
            throw new RuntimeException("Can't found utilities invoice");
        }

        if(utilitiesInvoice.getStatus().equals(UtilitiesInvoiceStatus.PAID.getCode())){
            throw new RuntimeException(UtilitiesInvoiceStatus.PAID.getStatus());
        }

        utilitiesInvoice.setStatus(UtilitiesInvoiceStatus.PAID.getCode());
    }

    private void updateServiceInvoiceStatus(Payment payment){

    }
}
