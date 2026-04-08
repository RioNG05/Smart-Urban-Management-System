package com.example.backend.Controllers;

import com.example.backend.DTO.Request.payment.PaymentRequest;
import com.example.backend.DTO.Response.ApiResponse;
import com.example.backend.DTO.Response.payment.VNPayResponse;
import com.example.backend.Enum.PaymentStatus;
import com.example.backend.Enum.TransactionCode;
import com.example.backend.Service.VNPayService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private VNPayService vnPayService;

    /**
     * Endpoint to create a payment URL and transaction log.
     * Use this from the Frontend when the user clicks 'Pay'.
     *
     * @param request The HttpServletRequest (automatically passed).
     * @param paymentRequest Contains invoiceId, invoiceType, amount, and orderInfo.
     * @return VNPayResponse containing the paymentUrl to redirect the user to.
     */
    @PostMapping("/create")
    public ApiResponse<VNPayResponse> createPayment(HttpServletRequest request, @RequestBody PaymentRequest paymentRequest) {
        VNPayResponse vnPayResponse = vnPayService.createPaymentUrl(request, paymentRequest);
        ApiResponse<VNPayResponse> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Success");
        response.setResult(vnPayResponse);

        return response;
    }

    /**
     * Endpoint for VNPAY Server to Server Call (IPN) to update transaction status safely.
     * 
     * @param request The HttpServletRequest containing all query params from VNPAY.
     * @return JSON String with RspCode that VNPAY expects.
     */
//    @GetMapping("/vnpay_ipn")
//    public ResponseEntity<String> vnpayIpn(HttpServletRequest request) {
//        String ipnResponse = vnPayService.handleIPN(request);
//        return ResponseEntity.ok(ipnResponse);
//    }

    /**
     * Optional endpoint for Frontend check using GET.
     * Useful if the Frontend needs the backend to verify the checksum on return.
     *
     * @param request The HttpServletRequest containing all query params from VNPAY.
     * @return Status 1 (Success), 0 (Failed), -1 (Tampered)
     */
    @GetMapping("/vnpay_return")
    public ApiResponse<?> vnpayReturn(HttpServletRequest request){
        Integer code = vnPayService.orderReturn(request);
        ApiResponse<?> response = new ApiResponse<>();

        response.setCode(code);
        response.setMessage(TransactionCode.getStatusByCode(code));

        return response;
    }
}
