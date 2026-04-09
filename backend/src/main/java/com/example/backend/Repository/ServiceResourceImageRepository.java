package com.example.backend.Repository;

import com.example.backend.Entity.ServiceResourceImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServiceResourceImageRepository extends JpaRepository<ServiceResourceImage, Integer> {
    List<ServiceResourceImage> findAllByOrderByServiceResourceIdAscIdAsc();
}
