package com.example.backend.Service;

import com.example.backend.DTO.Request.bookingservice.BookingServiceCreateRequest;
import com.example.backend.DTO.Request.bookingservice.BookingServiceUpdateRequest;
import com.example.backend.DTO.Request.serviceInvoce.SICreateRequest;
import com.example.backend.Entity.Account;
import com.example.backend.Entity.BookingService;
import com.example.backend.Entity.ServiceResource;
import com.example.backend.Repository.AccountRepository;
import com.example.backend.Repository.BookingServiceRepository;
import com.example.backend.Repository.ServicesResourceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingServiceService {

    private static final List<Integer> BLOCKING_STATUSES = List.of(0, 1);

    private final BookingServiceRepository bookingRepository;
    private final AccountRepository accountRepository;
    private final ServicesResourceRepository resourceRepository;
    private final ServiceInvoiceService serviceInvoiceService;
    private final NotificationService notificationService;

    public BookingServiceService(BookingServiceRepository bookingRepository,
                                 AccountRepository accountRepository,
                                 ServicesResourceRepository resourceRepository,
                                 ServiceInvoiceService serviceInvoiceService,
                                 NotificationService notificationService) {
        this.bookingRepository = bookingRepository;
        this.accountRepository = accountRepository;
        this.resourceRepository = resourceRepository;
        this.serviceInvoiceService = serviceInvoiceService;
        this.notificationService = notificationService;
    }

    public List<BookingService> findAll() {
        return bookingRepository.findAllByOrderByBookAtDesc();
    }

    public BookingService findById(Integer id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    private void validateOverlap(Integer resourceId,
                                 java.time.LocalDateTime bookFrom,
                                 java.time.LocalDateTime bookTo,
                                 Integer excludeId) {

        boolean conflict = (excludeId == null)
                ? bookingRepository.existsOverlappingBooking(
                        resourceId, bookFrom, bookTo, BLOCKING_STATUSES)
                : bookingRepository.existsOverlappingBookingExceptId(
                        resourceId, excludeId, bookFrom, bookTo, BLOCKING_STATUSES);

        if (conflict) {
            throw new RuntimeException("Booking time overlaps with an existing booking");
        }
    }

    public BookingService create(BookingServiceCreateRequest request) {

        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        ServiceResource resource = resourceRepository.findById(request.getResourceId())
                .orElseThrow(() -> new RuntimeException("Resource not found"));

        validateOverlap(
                request.getResourceId(),
                request.getBookFrom(),
                request.getBookTo(),
                null
        );

        BookingService booking = new BookingService();
        booking.setAccount(account);
        booking.setServiceResource(resource);
        booking.setBookFrom(request.getBookFrom());
        booking.setBookTo(request.getBookTo());
        booking.setStatus(0); // default pending
        booking.setTotalAmount(request.getTotalAmount());

        return bookingRepository.save(booking);
    }

    public BookingService update(Integer id, BookingServiceUpdateRequest request) {

        BookingService booking = findById(id);
        int oldStatus = booking.getStatus();

        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        ServiceResource resource = resourceRepository.findById(request.getResourceId())
                .orElseThrow(() -> new RuntimeException("Resource not found"));

        validateOverlap(
                request.getResourceId(),
                request.getBookFrom(),
                request.getBookTo(),
                id
        );

        booking.setAccount(account);
        booking.setServiceResource(resource);
        booking.setBookFrom(request.getBookFrom());
        booking.setBookTo(request.getBookTo());
        booking.setStatus(request.getStatus());
        booking.setTotalAmount(request.getTotalAmount());

        // ✅ chỉ tạo invoice khi chuyển từ Pending -> Approved
        if (isApproved(oldStatus, booking.getStatus())) {
            createInvoice(booking);
        }
        BookingService savedBooking = bookingRepository.save(booking);

        if (isDecisionStatusChange(oldStatus, savedBooking.getStatus())) {
            createBookingStatusNotification(savedBooking);
        }

        return savedBooking;
    }

    public void delete(Integer id) {
        bookingRepository.deleteById(id);
    }

    public List<BookingService> findByAccount(Integer accountId) {
        return bookingRepository.findByAccountId(accountId);
    }

    private boolean isApproved(Integer oldStatus, Integer newStatus) {
        return oldStatus == 0 && newStatus == 1;
    }


    private boolean isDecisionStatusChange(Integer currentStatus, Integer updateStatus) {
        return currentStatus == 0 && (updateStatus == 1 || updateStatus == 2);
    }

    private void createInvoice(BookingService bookingService){
        SICreateRequest request = SICreateRequest.builder()
                .bookingServiceId(bookingService.getId())
                .status(0)
                .amount(bookingService.getTotalAmount())
                .build();

        serviceInvoiceService.create(request);
    }

    private void createBookingStatusNotification(BookingService bookingService) {
        Integer receiverId = bookingService.getAccount() != null ? bookingService.getAccount().getId() : null;

        if (receiverId == null) {
            return;
        }

        boolean approved = Integer.valueOf(1).equals(bookingService.getStatus());
        String serviceName =
                bookingService.getServiceResource() != null &&
                bookingService.getServiceResource().getService() != null &&
                bookingService.getServiceResource().getService().getServiceName() != null
                        ? bookingService.getServiceResource().getService().getServiceName()
                        : "your booking";

        notificationService.createNotification(
                receiverId,
                null,
                approved ? "Booking approved" : "Booking denied",
                approved
                        ? "Your booking for " + serviceName + " has been approved."
                        : "Your booking for " + serviceName + " has been denied.",
                approved ? "BOOKING_APPROVED" : "BOOKING_DENIED",
                "/billing"
        );
    }
}
