package com.muntu.muntu.Services.Impl;

import com.muntu.muntu.Entity.Document.Contrat;
import com.muntu.muntu.Entity.Document.Post;
import com.muntu.muntu.Entity.User;
import com.muntu.muntu.Repository.Document.ContratRepository;
import com.muntu.muntu.Repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;


@Service
@AllArgsConstructor
public class ContratServiceImpl {

    private final ContratRepository contratRepository;
    private final UserServiceImpl userService;



    public Contrat saveContratForUser(Long userId, User agent) {
        // Récupérer l'utilisateur par son ID
        User user = userService.getUserById(userId);

        if (user == null || agent == null) {
            throw new IllegalArgumentException("User or Agent not found");
        }

        // Créer le contrat
        Contrat contrat = new Contrat();
        contrat.setUser(user);
        contrat.setAgent(agent);

        // Enregistrer le contrat dans la base de données
        return contratRepository.save(contrat);
    }

    public List<Contrat> getContratByUser(Long userId) {
        return contratRepository.findByUserId(userId);
    }
    public List<Contrat> getAllContratForAgent() {
        return contratRepository.findAll();
    }

    public List<Contrat> getContratsByAgent(User agent) {
        // Utiliser une requête personnalisée dans le repository
        return contratRepository.findByAgent(agent);
    }

    public Contrat signContrat(Long contratId) {
        Contrat contrat = contratRepository.findById(contratId)
                .orElseThrow(() -> new IllegalArgumentException("Contrat introuvable"));
        if (!contrat.isSigned()) {
            contrat.setSigned(true);
            contratRepository.save(contrat); // Sauvegarder la mise à jour
        }
        return contrat;
    }

    public void DeleteContrat(Long id) {
        contratRepository.deleteById(id);
    }

}

