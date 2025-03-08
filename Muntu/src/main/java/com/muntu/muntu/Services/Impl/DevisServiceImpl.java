package com.muntu.muntu.Services.Impl;

import com.muntu.muntu.Dto.DevisDTO;
import com.muntu.muntu.Dto.PrestationDetailsDTO;
import com.muntu.muntu.Entity.Document.Devis;
import com.muntu.muntu.Entity.Document.Prestation;
import com.muntu.muntu.Entity.User;
import com.muntu.muntu.Repository.Document.DevisRepository;
import com.muntu.muntu.Repository.Document.PrestationRepository;
import com.muntu.muntu.Repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class DevisServiceImpl {

    private final DevisRepository devisRepository;
    private final UserRepository userRepository;
    private final PrestationRepository prestationRepository;



    public Devis createDevis(DevisDTO devisDTO) {
        if (devisDTO == null || devisDTO.getPrestations().isEmpty()) {
            throw new IllegalArgumentException("Les détails de devis sont invalides.");
        }
        User user = userRepository.findById(devisDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        User agent = userRepository.findById(devisDTO.getAgentId())
                .orElseThrow(() -> new RuntimeException("Agent introuvable"));

        Devis devis = new Devis();
        devis.setUser(user);
        devis.setAgent(agent);
        devis.setSigned(false);

        devis.setObjet(devisDTO.getObjet());
        devis.setAdresse(devisDTO.getAdresse());
        devis.setStanding(devisDTO.getStanding());
        devis.setType(devisDTO.getType());
        devis.setDateDebut(devisDTO.getDateDebut());
        devis.setDuree(devisDTO.getDuree());

        double sousTotal = 0.0;
        for (PrestationDetailsDTO prestationDetail : devisDTO.getPrestations()) {
            Prestation prestation = prestationRepository.findById(prestationDetail.getPrestationId())
                    .orElseThrow(() -> new RuntimeException("Prestation non trouvée"));

            if (prestationDetail.getQuantite() <= 0) {
                throw new IllegalArgumentException("La quantité doit être supérieure à 0");
            }

            double montantTotal = prestation.getPrixUnitaire() * prestationDetail.getQuantite();
            sousTotal += montantTotal;

            devis.addPrestation(prestation, prestationDetail.getQuantite(), montantTotal);
        }

        devis.setSousTotal(sousTotal);
        devis.calculerTaxeEtTotalTTC(19.0);
        return devisRepository.save(devis);
    }

    public DevisDTO mapToDTO(Devis devis) {
        List<PrestationDetailsDTO> prestationDetails = devis.getDevisPrestations().stream().map(fp -> {
            // Ajout des informations supplémentaires dans le DTO
            Prestation prestation = fp.getPrestation();
            return new PrestationDetailsDTO(
                    prestation.getId(),
                    fp.getQuantite(),
                    fp.getMontantTotal(),
                    prestation.getDesignation(),
                    prestation.getLot(),            // Ajout du lot
                    prestation.getPrixUnitaire(),
                    prestation.getUnite()// Ajout du prix unitaire
            );
        }).collect(Collectors.toList());

        return new DevisDTO(
                devis.getUser().getId(),
                devis.getAgent().getId(),
                prestationDetails,
                devis.getSousTotal(),
                devis.getTaxe(),
                devis.getTotalTTC(),
                devis.getObjet(),
                devis.getAdresse(),
                devis.getStanding(),
                devis.getType(),
                devis.getDateDebut(),
                devis.getDuree()
        );
    }

    public List<Devis> getDevisByUser(Long userId) {
        return devisRepository.findByUserId(userId);
    }
    public List<Devis> getAllDevisForAgent() {
        return devisRepository.findAll();
    }

    public List<Devis> getDevisByAgent(User agent) {
        return devisRepository.findByAgent(agent);
    }

    public Devis signDevis(Long devisId) {
        Devis devis = devisRepository.findById(devisId)
                .orElseThrow(() -> new IllegalArgumentException("Devis introuvable"));
        if (!devis.isSigned()) {
            devis.setSigned(true);
            devisRepository.save(devis);
        }
        return devis;
    }

    public void DeleteDevis(Long id) {
        devisRepository.deleteById(id);
    }

}

