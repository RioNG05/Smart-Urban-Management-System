package com.example.backend.Repository;

import com.example.backend.Entity.Reply;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReplyRepository extends JpaRepository<Reply, Integer> {

    List<Reply> findByComplaintId(Integer complaintId);

}