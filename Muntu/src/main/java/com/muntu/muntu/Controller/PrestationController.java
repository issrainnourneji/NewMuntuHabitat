package com.muntu.muntu.Controller;

import com.muntu.muntu.Entity.Document.Prestation;
import com.muntu.muntu.Services.Impl.PrestationServiceImpl;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@Slf4j
@RestController
@RequestMapping("Prestation")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class PrestationController {
    private final PrestationServiceImpl prestationPrixService;


    @GetMapping("/all")
    public List<Prestation> getAllPrestation() {
        return prestationPrixService.RetrieveAllprestations();
    }

    @PostMapping("/add")
    public Prestation addPrestation(@RequestBody Prestation prestationPrix) {
        return prestationPrixService.addPrestation(prestationPrix);
    }

    @PutMapping("/update")
    public Prestation updatePrestation(@RequestBody Prestation prestationPrix) {
        return prestationPrixService.updatePresttaion(prestationPrix);
    }


    @GetMapping("get/{idD}")
    public Prestation getById(@PathVariable("idD") Long id) {
        return prestationPrixService.RetrievePrestation(id);
    }


    @DeleteMapping("/delete/{id}")
    public void deletePrestation(@PathVariable("id") Long id) {
        log.info("receive request to deletePrestation by id id:{}", id);
        prestationPrixService.DeletePrestation(id);
    }

}

