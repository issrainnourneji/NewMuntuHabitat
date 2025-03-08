package com.muntu.muntu.Services.Impl;


import com.muntu.muntu.Dto.UserDto;
import com.muntu.muntu.Entity.Document.Post;
import com.muntu.muntu.Entity.Document.Prestation;
import com.muntu.muntu.Entity.Simulation.Categorie;
import com.muntu.muntu.Entity.Simulation.ProspectSelection;
import com.muntu.muntu.Entity.Simulation.Question;
import com.muntu.muntu.Entity.User;
import com.muntu.muntu.Repository.Simulation.CategorieRepository;
import com.muntu.muntu.Repository.Simulation.QuestionRepository;
import com.muntu.muntu.Repository.Simulation.SelectionRepository;
import com.muntu.muntu.Repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@AllArgsConstructor
@Service
public class SimulationServiceImpl {

    private  final QuestionRepository questionRepository;
    private  final CategorieRepository categorieRepository;
    private final UserRepository userRepo;

    private static final String uploadDir = "C:/Users/starinfo/Desktop/New/Muntu/uploads/categories/";


    public Categorie savecategorieForUser(String content, int price, String title,MultipartFile image, String description, String descriptionTitle) throws IOException {


        File uploadDirectory = new File(uploadDir);
        if (!uploadDirectory.exists()) {
            uploadDirectory.mkdirs();
        }

        String imagePath = uploadDir + image.getOriginalFilename();
        image.transferTo(new File(imagePath));

        Categorie categorie = new Categorie( content,  price,title, "uploads/categories/" + image.getOriginalFilename(), description,  descriptionTitle);


        return categorieRepository.save(categorie);
    }


    //Questions
    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    public Question addQuestion(Question question) {
        return questionRepository.save(question);
    }



    public Question getQuestionById(Long id) {
        return questionRepository.findById(id).orElse(null);
    }

    public void deleteQuestionById(Long id){
        questionRepository.deleteById(id);
    }
    public Question updateQuestion(Question d) {
        return questionRepository.save(d);

    }
    //Categories
    public List<Categorie> getAllCategories() {
        return categorieRepository.findAll();
    }

    public Categorie addCategorie(Categorie categorie) {
        return categorieRepository.save(categorie);
    }

    public Categorie getCategorieById(Long id) {
        return categorieRepository.findById(id).orElse(null);
    }

    public void deleteCategorieById(Long id){
        categorieRepository.deleteById(id);
    }

    public Categorie updateCategorie(Categorie d) {
        return categorieRepository.save(d);

    }

    //selections

    public List<User> getAllUsersWithSelections() {
        // Récupérer tous les utilisateurs et leurs sélections de prospect
        return userRepo.findAll();
    }

    public UserDto getUserById(Long id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User Not found"));
        return new UserDto(user); // Convertir en UserDTO pour inclure ProspectSelectionDto
    }
}

