package com.muntu.muntu.Services.Impl;

import com.muntu.muntu.Entity.Document.Facture;
import com.muntu.muntu.Entity.Paiement;
import com.muntu.muntu.Repository.Document.FactureRepository;
import com.muntu.muntu.Repository.PaiementRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
@AllArgsConstructor
public class PaiementServiceImpl {

    private final PaiementRepository paiementRepo;

    private final FactureRepository factureRepo;

    private final NotificationService notificationService;

}
