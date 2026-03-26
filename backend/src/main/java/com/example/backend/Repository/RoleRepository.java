package com.example.backend.Repository;

import com.example.backend.Entity.Role;
<<<<<<< HEAD
import com.example.backend.Enum.RoleEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findByRoleName(RoleEnum roleName);
=======
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
>>>>>>> c6f5a04 (Sửa hiển thị role trong api)
}
