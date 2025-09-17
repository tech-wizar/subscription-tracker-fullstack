package com.mytracker.subscriptiontrackerapi.repository;

import com.mytracker.subscriptiontrackerapi.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // This is a custom "derived query". Spring Data JPA will automatically
    // create the code to find a user by their email address. We will need
    // this to check if a user logging in with Google already exists.
    Optional<User> findByEmail(String email);

}