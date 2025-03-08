package com.muntu.muntu.Services.Impl;

import com.muntu.muntu.Dto.FactureDTO;
import com.muntu.muntu.Dto.PrestationDetailsDTO;
import com.muntu.muntu.Entity.Document.Facture;
import com.muntu.muntu.Entity.Document.Prestation;
import com.muntu.muntu.Entity.User;
import com.muntu.muntu.Repository.Document.FactureRepository;
import com.muntu.muntu.Repository.Document.PrestationRepository;
import com.muntu.muntu.Repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class FactureServiceImpl {

    private final FactureRepository factureRepository;
    private final UserRepository userRepository;
    private final PrestationRepository prestationRepository;


    public Facture createFacture(FactureDTO factureDTO) {
        if (factureDTO == null || factureDTO.getPrestations().isEmpty()) {
            throw new IllegalArgumentException("Les détails de la facture sont invalides.");
        }
        User user = userRepository.findById(factureDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        User agent = userRepository.findById(factureDTO.getAgentId())
                .orElseThrow(() -> new RuntimeException("Agent introuvable"));

        // Créer une nouvelle facture
        Facture facture = new Facture();
        facture.setUser(user);
        facture.setAgent(agent);
        facture.setSigned(false);

        // Ajouter les prestations
        double sousTotal = 0.0;
        for (PrestationDetailsDTO prestationDetail : factureDTO.getPrestations()) {
            Prestation prestation = prestationRepository.findById(prestationDetail.getPrestationId())
                    .orElseThrow(() -> new RuntimeException("Prestation non trouvée"));

            if (prestationDetail.getQuantite() <= 0) {
                throw new IllegalArgumentException("La quantité doit être supérieure à 0");
            }

            double montantTotal = prestation.getPrixUnitaire() * prestationDetail.getQuantite();
            sousTotal += montantTotal;

            facture.addPrestation(prestation, prestationDetail.getQuantite(), montantTotal);
        }

        facture.setSousTotal(sousTotal);
        facture.calculerTaxeEtTotalTTC(19.0);
        return factureRepository.save(facture);
    }

    public FactureDTO mapToDTO(Facture facture) {
        List<PrestationDetailsDTO> prestationDetails = facture.getFacturePrestations().stream().map(fp -> {
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

        return new FactureDTO(
                facture.getUser().getId(),
                facture.getAgent().getId(),
                prestationDetails,
                facture.getSousTotal(),
                facture.getTaxe(),
                facture.getTotalTTC()
        );
    }



    public List<Facture> getFactureByUser(Long userId) {
        return factureRepository.findByUserId(userId);
    }
    public List<Facture> getAllFactureForAgent() {
        return factureRepository.findAll();
    }

    public List<Facture> getFacturesByAgent(User agent) {
        return factureRepository.findByAgent(agent);
    }

    public Facture signFacture(Long factureId) {
        Facture facture = factureRepository.findById(factureId)
                .orElseThrow(() -> new IllegalArgumentException("Facture introuvable"));
        if (!facture.isSigned()) {
            facture.setSigned(true);
            factureRepository.save(facture);
        }
        return facture;
    }
    public void DeleteFacture(Long id) {
        factureRepository.deleteById(id);
    }


}


