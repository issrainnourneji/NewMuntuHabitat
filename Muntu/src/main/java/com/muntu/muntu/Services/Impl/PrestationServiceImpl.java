package com.muntu.muntu.Services.Impl;

import com.muntu.muntu.Entity.Document.Prestation;
import com.muntu.muntu.Repository.Document.PrestationRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@AllArgsConstructor
@Service
public class PrestationServiceImpl {

    private  final PrestationRepository prestationPrixRepository;


    public Prestation addPrestation(Prestation prestationPrix) {
        return prestationPrixRepository.save(prestationPrix);
    }

    public List<Prestation> RetrieveAllprestations() {
        List<Prestation> prestations ;
        prestations = prestationPrixRepository.findAll();
        return prestations ;
    }

    public Prestation updatePresttaion(Prestation d) {
        return prestationPrixRepository.save(d);

    }


    public Prestation RetrievePrestation(Long id) {
        return prestationPrixRepository.findById(id).get();

    }

    public void DeletePrestation(Long id) {
        prestationPrixRepository.deleteById(id);
    }
}
