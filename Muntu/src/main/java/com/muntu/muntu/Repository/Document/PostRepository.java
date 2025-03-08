package com.muntu.muntu.Repository.Document;

import com.muntu.muntu.Entity.Document.Post;
import com.muntu.muntu.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post,Long> {
    List<Post> findByUserId(Long userId);
    List<Post> findByAgent(User agent);
}
