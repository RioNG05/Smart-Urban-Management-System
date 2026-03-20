package com.example.backend.Repository;

import com.example.backend.Entity.ServiceResource;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServicesResourceRepository extends JpaRepository<ServiceResource, Integer> {
}
