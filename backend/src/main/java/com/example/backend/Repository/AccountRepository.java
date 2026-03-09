package com.example.backend.Repository;

import com.example.backend.Entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Integer> {
    Optional<Account> findByUsername(String username);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
<<<<<<< HEAD

    Optional<Account> findByEmail(String email);
=======
>>>>>>> 7556d3b09e62fb6b078dcc54df4950da91a18a6c
}
