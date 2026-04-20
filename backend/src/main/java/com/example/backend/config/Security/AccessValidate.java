package com.example.backend.config.Security;

import com.example.backend.Entity.*;
import com.example.backend.Repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.jspecify.annotations.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component("accessValidate")
@FieldDefaults(level = AccessLevel.PRIVATE)
@RequiredArgsConstructor
public class AccessValidate {

    ContractRepository contractRepository;
    ResidentRepository residentRepository;
    BookingServiceRepository bookingServiceRepository;
    ComplaintRepository complaintRepository;
    ReplyRepository replyRepository;
    ServiceInvoiceRepository serviceInvoiceRepository;


    /**
     * Check xem user có được truy cập vào api của contract không
     * @param id id của contract
     * @param auth authentication header
     * @return true nếu được truy cập, false nếu không được truy cập
     */
    public boolean canViewContract(Integer id, @NonNull Authentication auth){
        Account account = (Account) auth.getPrincipal();

        Contract contract = contractRepository.findById(id).orElseThrow(() -> new RuntimeException("Contract not found for id: " + id));

        boolean isOwned = contract.getAccount().getId().equals(account.getId());

        boolean isAdmin = account.getAuthorities().stream().anyMatch((a) -> a.getAuthority().equals("Contracts_R_01"));

        return isAdmin | isOwned;
    }

    /**
     * Dùng khi user cần xem profile của resident
     * Kiểm tra xem user có phải resident hoặc có quyền xem profile của resident hay không
     * @param residentId residentId
     * @param auth authentication header
     * @return true nếu được xem, false nếu không được
     */
    public boolean canViewResidentProfile(Integer residentId, @NonNull Authentication auth){
        Account account = (Account) auth.getPrincipal();
        Resident resident = residentRepository.findById(residentId).orElseThrow(() -> new RuntimeException("Resident Id not foud!"));
        if(account.getRole().getId() == 6){
            return false;
        } else if(account.getRole().getId() == 2){
            Resident residentAccount = residentRepository.findByAccountId(account.getId()).orElse(null);
            return residentAccount!=null && residentAccount.getId().equals(resident.getId());
        }
        return true;
    }

    /**
     * Dùng khi xem danh sách những thứ thuộc về 1 account cụ thể
     * Check xem account Id được gửi từ jwt token và id ở api có trùng khớp không và cấp quyền truy cập
     * @param pathId id của account tại api
     * @param auth authentication header
     * @return true nếu trùng và false nếu không trùng
     */
    public boolean isAllowed(Integer pathId, Authentication auth){
        if(auth == null || !(auth.getPrincipal() instanceof Account)){
            throw new RuntimeException("Account information not found or you are not logged in");
        }
        Account account = (Account) auth.getPrincipal();
        return pathId.equals(account.getId()) || account.getRole().getId() == 1;
    }

    /**
     * Check xem account đang gửi Request có phải resident không
     * @param auth authentication header
     * @return true nếu có, false nếu không;
     */
    public boolean isResident(Authentication auth){
        Account account = (Account) auth.getPrincipal();
        return residentRepository.findByAccountId(account.getId()).isPresent();
    }

    /**
     * Check xem account gửi Request có quyền xem 1 booking cụ thể không
     * @param bookingId booking service đang được gửi yêu cầu xem
     * @param authentication authentication header
     * @return true nếu có quyền xem, false nếu không
     */
    public boolean canViewBookingService(Integer bookingId, Authentication authentication){
        Object principal = authentication.getPrincipal();
        if(!(principal instanceof Account account)){
            throw new RuntimeException("Invalid principal");
        }

        BookingService bookingService = bookingServiceRepository.findById(bookingId).orElse(null);
        if(bookingService == null){
            return false;
        }
        return bookingService.getAccount().getId().equals(account.getId());
    }

    /**
     * check xem account gửi Request có quyền xem 1 complaint cụ thể không
     * @param complaintId complaint Id được xem
     * @param auth authentication header
     * @return true nếu có, false nếu không
     */
    public boolean canViewComplaint(Integer complaintId, Authentication auth){
        Object principal = auth.getPrincipal();
        if(!(principal instanceof Account account)){
            throw new RuntimeException("Invalid principal");
        }

        Complaint complaint = complaintRepository.findById(complaintId).orElse(null);
        if(complaint == null){
            return false;
        }
        return complaint.getMadeByUser().getId().equals(account.getId());
    }

    /**
     * check xem account gửi Request có quyền xem 1 reply cụ thể không
     * @param replyId reply Id được xem
     * @param auth authentication header
     * @return true nếu có, false nếu không
     */
    public boolean canViewReplies(Integer replyId, Authentication auth){
        Object principal = auth.getPrincipal();
        if(!(principal instanceof Account account)){
            throw new RuntimeException("Invalid principal");
        }

        Reply reply = replyRepository.findById(replyId).orElse(null);
        if(reply == null){
            return false;
        }
        Complaint complaint = complaintRepository.findById(reply.getComplaint().getId()).orElse(null);
        if(complaint == null){
            return false;
        }
        return complaint.getMadeByUser().getId().equals(account.getId());
    }

    /**
     * Check xem account co xem duoc service invoice khong
     * @param serviceInvoiceId service invoice id dang duoc xem
     * @param auth authentication header
     * @return true neu co, false neu khong
     */
    public boolean canViewServiceInvoice(Integer serviceInvoiceId, Authentication auth){
        Object principal = auth.getPrincipal();
        if(!(principal instanceof Account account)){
            throw new RuntimeException("Invalid principal");
        }

        ServiceInvoice serviceInvoice = serviceInvoiceRepository.findById(serviceInvoiceId).orElse(null);
        if(serviceInvoice == null){
            return false;
        }

        BookingService bookingService = bookingServiceRepository.findById(serviceInvoice.getBookingService().getId()).orElse(null);
        if(bookingService == null){
            return false;
        }

        return bookingService.getAccount().getId().equals(account.getId());

    }
}
