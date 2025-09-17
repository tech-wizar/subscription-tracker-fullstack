package com.mytracker.subscriptiontrackerapi.repository;

import com.mytracker.subscriptiontrackerapi.model.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor; // <-- IMPORT THIS
import org.springframework.stereotype.Repository;
import com.mytracker.subscriptiontrackerapi.dto.CategoryExpenseDTO;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
// --- MODIFIED INTERFACE SIGNATURE ---
public interface SubscriptionRepository extends JpaRepository<Subscription, Long>, JpaSpecificationExecutor<Subscription> {

    List<Subscription> findByUserId(Long userId); // This can stay for other uses

    @Query("SELECT new com.mytracker.subscriptiontrackerapi.dto.CategoryExpenseDTO(s.category, " +
           "SUM(CASE WHEN s.billingCycle = 'YEARLY' THEN s.cost / 12 ELSE s.cost END)) " +
           "FROM Subscription s WHERE s.user.id = :userId GROUP BY s.category")
    List<CategoryExpenseDTO> getCategoryExpensesByUserId(@Param("userId") Long userId);
}