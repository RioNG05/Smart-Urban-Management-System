package com.example.backend.Service;

import com.example.backend.DTO.Request.bookingservice.BookingServiceCreateRequest;
import com.example.backend.Entity.Account;
import com.example.backend.Entity.BookingService;
import com.example.backend.Repository.AccountRepository;
import com.example.backend.Repository.BookingServiceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingServiceService {

    private final BookingServiceRepository bookingRepository;
    private final AccountRepository accountRepository;

    public BookingServiceService(BookingServiceRepository bookingRepository,
                                 AccountRepository accountRepository) {
        this.bookingRepository = bookingRepository;
        this.accountRepository = accountRepository;
    }

    public List<BookingService> findAll() {
        return bookingRepository.findAll();
    }

    public BookingService findById(Integer id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    public BookingService create(BookingServiceCreateRequest request) {

        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        BookingService booking = new BookingService();

        booking.setAccount(account);
        booking.setBookFrom(request.getBookFrom());
        booking.setBookTo(request.getBookTo());
        booking.setStatus(request.getStatus());
        booking.setTotalAmount(request.getTotalAmount());

        return bookingRepository.save(booking);
    }

    public BookingService update(Integer id, BookingServiceCreateRequest request) {

        BookingService booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        booking.setAccount(account);
        booking.setBookFrom(request.getBookFrom());
        booking.setBookTo(request.getBookTo());
        booking.setStatus(request.getStatus());
        booking.setTotalAmount(request.getTotalAmount());

        return bookingRepository.save(booking);
    }

    public void delete(Integer id) {
        bookingRepository.deleteById(id);
    }

    public List<BookingService> findByAccount(Integer accountId) {
        return bookingRepository.findByAccountId(accountId);
    }
}