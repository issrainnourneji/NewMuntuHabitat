package com.muntu.muntu.Repository;

import com.muntu.muntu.Entity.User;
import com.muntu.muntu.Enums.Status;
import com.muntu.muntu.Enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    Optional<User> findByResetPasswordToken(String token);
    List<User> findByRole(UserRole role);
    List<User> findAllByRole(UserRole role);
    long countUsersByRole(UserRole role);
    List<User> findByAgent(User agent);
    List<User> findAllByStatus(Status status);

}
