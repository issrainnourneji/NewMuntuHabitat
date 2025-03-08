package com.muntu.muntu.Controller;

import com.muntu.muntu.Entity.Document.Contrat;
import com.muntu.muntu.Entity.Document.Post;
import com.muntu.muntu.Entity.User;
import com.muntu.muntu.Services.Impl.PostServiceImpl;
import com.muntu.muntu.Services.Impl.UserServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/post")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class PostController {

    private final PostServiceImpl postService;
    private final UserServiceImpl userService;



    @PostMapping("/add/{userId}")
    public ResponseEntity<Post> addPostForUser(
            @PathVariable Long userId,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("image") MultipartFile image
    ) throws IOException {
        try {
            // Récupérer l'utilisateur actuellement authentifié
            UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            // Utiliser le userDetails pour récupérer l'agent
            User agent = userService.findByEmail(userDetails.getUsername());

            if (agent == null) {
                return ResponseEntity.badRequest().body(null);
            }

            // Appel au service pour créer le post
            Post post = postService.savePostForUser(userId, agent, title, description, image);
            return ResponseEntity.ok(post);
        } catch (IllegalArgumentException e) {
            // Gérer les exceptions liées à l'utilisateur ou agent non trouvé
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Post>> getPostsByUser(@PathVariable Long userId) {
        List<Post> posts = postService.getPostsByUser(userId);
        return ResponseEntity.ok(posts);
    }


    @GetMapping("/all")
    public ResponseEntity<List<Post>> getAllPostsForAgent() {
        List<Post> posts = postService.getAllPosts();
        return ResponseEntity.ok(posts);
    }

    // Dans PostController
    @GetMapping("/agentp")
    public ResponseEntity<List<Post>> getPostsForAgent() {
        // Récupérer l'utilisateur actuellement authentifié
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User agent = userService.findByEmail(userDetails.getUsername());

        if (agent == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        List<Post> posts = postService.getPostsForAgent(agent);
        return ResponseEntity.ok(posts);
    }
    @DeleteMapping("/delete/{id}")
    public void deletePost(@PathVariable("id") Long id) {
        postService.DeletePost(id);
    }

}
