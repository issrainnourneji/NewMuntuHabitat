package com.muntu.muntu.Controller;

import com.muntu.muntu.Dto.*;
import com.muntu.muntu.Exception.NotFoundException;
import com.muntu.muntu.Services.Impl.UserServiceImpl;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserServiceImpl userService;

    @PostMapping("/register")
    public ResponseEntity<Response> registerUser(@RequestBody UserDto registrationRequest){
        System.out.println(registrationRequest);
        return ResponseEntity.ok(userService.registerUser(registrationRequest));
    }
    @PostMapping("/login")
    public ResponseEntity<Response> loginUser(@RequestBody LoginRequest loginRequest){
        return ResponseEntity.ok(userService.loginUser(loginRequest));
    }

    @GetMapping("/activate-account")
    public void confirm(
            @RequestParam String token
    ) throws MessagingException {
        userService.activateAccount(token);
    }

    @PostMapping("/registerAgent")
    public ResponseEntity<Response> registerAgent(@RequestBody UserDto registrationRequest) {
        Response response = userService.registerAgent(registrationRequest);
        return new ResponseEntity<>(response, HttpStatus.valueOf(response.getStatus()));
    }
    @PostMapping("/registerProspect")
    public Response registerProspect(@RequestBody UserDto registrationRequest) {
        return userService.registerProspect(registrationRequest);
    }

    @PostMapping("/forgot-password")
    @ResponseStatus(HttpStatus.OK)
    public Response forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        try {
            userService.requestPasswordReset(request.getEmail());
            return Response.builder()
                    .status(200)
                    .message("Password reset email sent successfully")
                    .build();
        } catch (NotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (MessagingException e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error sending reset email. Please try again later."
            );
        }
    }

    @PostMapping("/reset-password")
    @ResponseStatus(HttpStatus.OK)
    public Response resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        try {
            userService.resetPassword(request.getToken(), request.getNewPassword());
            return Response.builder()
                    .status(200)
                    .message("Password reset successfully")
                    .build();
        } catch (NotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (IllegalStateException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }
}