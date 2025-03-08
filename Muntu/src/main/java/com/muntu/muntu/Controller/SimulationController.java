package com.muntu.muntu.Controller;


import com.muntu.muntu.Dto.UserDto;
import com.muntu.muntu.Entity.Document.Post;
import com.muntu.muntu.Entity.Simulation.Categorie;
import com.muntu.muntu.Entity.Simulation.Question;
import com.muntu.muntu.Entity.User;
import com.muntu.muntu.Services.Impl.SimulationServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("simulation")
@AllArgsConstructor
public class SimulationController {

    private final SimulationServiceImpl simulationService;

    @PostMapping("/add")
    public ResponseEntity<Categorie> addCForUser(
            @RequestParam("content") String content,
            @RequestParam("price") int price,
            @RequestParam("title") String title,
            @RequestParam("image") MultipartFile image,
            @RequestParam("description") String description,
            @RequestParam("descriptionTitle") String descriptionTitle
    ) throws IOException {
        try {

            Categorie categorie = simulationService.savecategorieForUser(content, price, title, image, description,descriptionTitle);
            return ResponseEntity.ok(categorie);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    //Questions
    @PostMapping("/addQ")
    public Question addQuestion(@RequestBody Question question) {
        return simulationService.addQuestion(question);
    }

    @GetMapping("/allQuestions")
    public List<Question> getAllQuestions() {
        return simulationService.getAllQuestions();
    }


    @PutMapping("/updateQ")
    public Question updateQuestion(@RequestBody Question q) {
        return simulationService.updateQuestion(q);
    }

    @GetMapping("getQ/{id}")
    public Question getById(@PathVariable("id") Long id) {
        return simulationService.getQuestionById(id);
    }
    @DeleteMapping("/deleteQ/{id}")
    public void deleteQuestion(@PathVariable("id") Long id) {
        simulationService.deleteQuestionById(id);
    }

    //Categories
    @GetMapping("/allCategories")
    public List<Categorie> getAllCategories() {
        return simulationService.getAllCategories();
    }

    @PostMapping("/addC")
    public Categorie addCategorie(@RequestBody Categorie categorie) {
        return simulationService.addCategorie(categorie);
    }

    @GetMapping("/getC/{id}")
    public Categorie getItemById(@PathVariable Long id) {
        return simulationService.getCategorieById(id);
    }
    @PutMapping("/updateC")
    public Categorie updateCategorie(@RequestBody Categorie c) {
        return simulationService.updateCategorie(c);
    }
    @DeleteMapping("/deleteC/{id}")
    public void deleteCategorie(@PathVariable("id") Long id) {
        simulationService.deleteCategorieById(id);
    }

    //selectionns

    @GetMapping("/prospects")
    public List<UserDto> getAllUsersWithSelections() {
        // Transformer chaque User en UserDTO
        return simulationService.getAllUsersWithSelections().stream()
                .map(UserDto::new)
                .collect(Collectors.toList());
    }

    @GetMapping("prospect/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        UserDto userDTO = simulationService.getUserById(id);
        return ResponseEntity.ok(userDTO);
    }



}

