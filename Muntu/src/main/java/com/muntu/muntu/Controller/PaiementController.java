package com.muntu.muntu.Controller;

import com.muntu.muntu.Entity.Paiement;
import com.muntu.muntu.Services.Impl.PaiementServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("payer")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class PaiementController {
    private PaiementServiceImpl paiementService;


}
