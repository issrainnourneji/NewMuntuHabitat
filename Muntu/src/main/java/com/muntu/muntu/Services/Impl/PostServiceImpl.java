package com.muntu.muntu.Services.Impl;


import com.muntu.muntu.Entity.Document.Post;
import com.muntu.muntu.Entity.User;
import com.muntu.muntu.Repository.Document.PostRepository;
import com.muntu.muntu.Repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@Service
@AllArgsConstructor
public class PostServiceImpl {

    private final PostRepository postRepository;
    private final UserServiceImpl userService;

    private static final String uploadDir = "C:/Users/starinfo/Desktop/New/Muntu/uploads/";


    public Post savePostForUser(Long userId, User agent, String title, String description, MultipartFile image) throws IOException {
        User user = userService.getUserById(userId);

        if (user == null || agent == null) {
            throw new IllegalArgumentException("User or Agent not found");
        }

        File uploadDirectory = new File(uploadDir);
        if (!uploadDirectory.exists()) {
            uploadDirectory.mkdirs();
        }

        String imagePath = uploadDir + image.getOriginalFilename();
        image.transferTo(new File(imagePath));

        Post post = new Post(title, description, "uploads/" + image.getOriginalFilename());
        post.setUser(user);
        post.setAgent(agent);

        return postRepository.save(post);
    }
    public List<Post> getPostsByUser(Long userId) {
        return postRepository.findByUserId(userId);
    }
    public List<Post> getPostsForAgent(User agent) {
        return postRepository.findByAgent(agent);
    }
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public void DeletePost(Long id) {
        postRepository.deleteById(id);
    }

}

