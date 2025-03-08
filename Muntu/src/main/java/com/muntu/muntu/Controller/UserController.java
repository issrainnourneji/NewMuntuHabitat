package com.muntu.muntu.Controller;

import com.muntu.muntu.Dto.ProspectSelectionDto;
import com.muntu.muntu.Dto.Response;
import com.muntu.muntu.Dto.UserDto;
import com.muntu.muntu.Entity.Document.Prestation;
import com.muntu.muntu.Entity.Simulation.ProspectSelection;
import com.muntu.muntu.Entity.User;
import com.muntu.muntu.Repository.UserRepository;
import com.muntu.muntu.Services.Impl.UserServiceImpl;
import com.muntu.muntu.Services.Interf.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserServiceImpl userService;
    private final UserRepository userRepository;



    @GetMapping("/get-all")
    public ResponseEntity<Response> getAllUsers(){
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/my-info")
    public ResponseEntity<Response> getUserInfoAndOrderHistory(){
        return ResponseEntity.ok(userService.getUserInfo());
    }

    @GetMapping("/agents-and-users")
    public ResponseEntity<Response> getUsersAndAgents() {
        Response response = userService.getUsersAndAgentsAssigned();
        if (response.getStatus() == HttpStatus.OK.value()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(response.getStatus()).body(response);
        }
    }

    @PutMapping("up/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @RequestBody UserDto userDto
    ) {
        return userRepository.findById(id).map(user -> {
            // Mise à jour des champs modifiables
            if (userDto.getName() != null) {
                user.setName(userDto.getName());
            }
            if (userDto.getPhoneNumber() != null) {
                user.setPhoneNumber(userDto.getPhoneNumber());
            }
            if (userDto.getAddress() != null) {
                user.setAddress(userDto.getAddress());
            }

            // Sauvegarde dans la base de données
            userRepository.save(user);

            // Retourne la réponse
            return ResponseEntity.ok(new UserDto(user));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("get/{id}")
    public User getById(@PathVariable("id") Long id) {
        return userService.getUserById(id);
    }
    @DeleteMapping("/del/{id}")
    public void deleteUser(@PathVariable("id") Long id) {
        userService.DeleteUser(id);
    }

    @DeleteMapping("/delT/{id}")
    public void deleteToken(@PathVariable("id") Integer id) {
        userService.DeleteToken(id);
    }

    @GetMapping("/getP")
    public List<ProspectSelection> getAllProspects() {
        return userService.getAllProspects();
    }
    @GetMapping("/assigned")
    public List<ProspectSelection> getAssignedProspects(@RequestParam Long agentId) {
        return userService.getAssignedProspects(agentId);
    }
}