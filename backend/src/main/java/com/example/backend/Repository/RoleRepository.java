package com.example.backend.Repository;

import com.example.backend.Entity.Role;
import com.example.backend.Enum.RoleEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findByRoleName(RoleEnum roleName);
}
