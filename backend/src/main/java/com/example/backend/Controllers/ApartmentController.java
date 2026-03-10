package com.example.backend.Controllers;

import com.example.backend.Entity.Apartment;
import com.example.backend.Service.ApartmentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/apartments")
public class ApartmentController {

    private final ApartmentService service;

    public ApartmentController(ApartmentService service) {
        this.service = service;
    }

    @GetMapping
    public List<Apartment> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Apartment getById(@PathVariable Integer id) {
        return service.findById(id);
    }

    @PostMapping
    public Apartment create(@RequestBody Apartment apartment) {
        return service.create(apartment);
    }

    @PutMapping("/{id}")
    public Apartment update(@PathVariable Integer id,
                            @RequestBody Apartment apartment) {
        return service.update(id, apartment);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}