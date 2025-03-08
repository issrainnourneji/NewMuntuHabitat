package com.muntu.muntu.Services.Impl;

import com.muntu.muntu.Dto.LoginRequest;
import com.muntu.muntu.Dto.ProspectSelectionDto;
import com.muntu.muntu.Dto.Response;
import com.muntu.muntu.Dto.UserDto;
import com.muntu.muntu.Entity.Document.Prestation;
import com.muntu.muntu.Entity.EmailVerif.EmailTemplateName;
import com.muntu.muntu.Entity.EmailVerif.Token;
import com.muntu.muntu.Entity.Simulation.ProspectSelection;
import com.muntu.muntu.Entity.User;
import com.muntu.muntu.Enums.Status;
import com.muntu.muntu.Enums.UserRole;
import com.muntu.muntu.Exception.InvalidCredentialsException;
import com.muntu.muntu.Exception.NotFoundException;
import com.muntu.muntu.Mapper.EntityDtoMapper;
import com.muntu.muntu.Repository.Simulation.SelectionRepository;
import com.muntu.muntu.Repository.TokenRepository;
import com.muntu.muntu.Repository.UserRepository;
import com.muntu.muntu.Security.JwtUtils;
import com.muntu.muntu.Services.Interf.UserService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.context.Context;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {


    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final EntityDtoMapper entityDtoMapper;
    private final EmailServiceImpl emailService;
    private final TokenRepository tokenRepository;
    private final SelectionRepository prospectSelectionRepo;


    private String activationUrl = "http://localhost:4200/activate-account";



    @Override
    @Transactional
    public Response registerUser(UserDto registrationRequest) {
        // Default user role is USER
        UserRole role = UserRole.USER;
        if (registrationRequest.getRole() != null && registrationRequest.getRole().equalsIgnoreCase("admin")) {
            role = UserRole.ADMIN;
        }

        // Create user object
        User user = User.builder()
                .name(registrationRequest.getName())
                .email(registrationRequest.getEmail())
                .password(passwordEncoder.encode(registrationRequest.getPassword()))
                .phoneNumber(registrationRequest.getPhoneNumber())
                .address(registrationRequest.getAddress())
                .accountLocked(false)
                .enabled(false)
                .role(role)
                .build();

        // Save the user temporarily
        User savedUser = userRepo.save(user);

        // If the user is of role USER, assign to an agent
        if (role == UserRole.USER) {
            assignUserToAgent(savedUser);
        }

        // Send validation email
        try {
            sendValidationEmail(savedUser);
        } catch (MessagingException e) {
            log.error("Failed to send validation email", e);
        }

        UserDto userDto = entityDtoMapper.mapUserToDtoBasic(savedUser);
        return Response.builder()
                .status(200)
                .message("User Successfully Added")
                .user(userDto)
                .build();
    }

    private void assignUserToAgent(User user) {
        // Get all agents
        List<User> agents = userRepo.findAllByRole(UserRole.AGENT);

        // If no agents are found, log an error or handle appropriately
        if (agents.isEmpty()) {
            log.error("No agents available to assign to user.");
            return;
        }

        // Use round-robin approach: assign user to the next available agent
        int agentIndex = (int) (userRepo.countUsersByRole(UserRole.USER) % agents.size());
        User assignedAgent = agents.get(agentIndex);

        // Associate the user with the selected agent
        user.setAgent(assignedAgent);

        // Save the updated user
        userRepo.save(user);
    }

    public Response registerAgent(UserDto registrationRequest) {
        // Validation des données d'entrée
        if (registrationRequest == null) {
            return Response.builder()
                    .status(HttpStatus.BAD_REQUEST.value())
                    .message("Registration request cannot be null")
                    .build();
        }

        if (registrationRequest.getEmail() == null || registrationRequest.getPassword() == null) {
            return Response.builder()
                    .status(HttpStatus.BAD_REQUEST.value())
                    .message("Email and password are required")
                    .build();
        }

        User user = User.builder()
                .name(registrationRequest.getName())
                .email(registrationRequest.getEmail())
                .password(passwordEncoder.encode(registrationRequest.getPassword()))
                .phoneNumber(registrationRequest.getPhoneNumber())
                .address(registrationRequest.getAddress())
                .accountLocked(false)
                .enabled(true)
                .role(UserRole.AGENT)
                .build();

        try {
            User savedUser = userRepo.save(user);
            sendValidationEmail(savedUser);

            UserDto userDto = entityDtoMapper.mapUserToDtoBasic(savedUser);
            return Response.builder()
                    .status(HttpStatus.OK.value())
                    .message("Agent successfully registered")
                    .user(userDto)
                    .build();
        } catch (MessagingException e) {
            log.error("Failed to send validation email", e);
            return Response.builder()
                    .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .message("Failed to send validation email: " + e.getMessage())
                    .build();
        } catch (Exception e) {
            log.error("Failed to register agent", e);
            return Response.builder()
                    .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .message("Failed to register agent: " + e.getMessage())
                    .build();
        }
    }

    public Response registerProspect(UserDto registrationRequest) {
        if (registrationRequest == null) {
            return Response.builder()
                    .status(HttpStatus.BAD_REQUEST.value())
                    .message("Informations request cannot be null")
                    .build();
        }

        if (registrationRequest.getEmail() == null || registrationRequest.getPassword() == null ||
                registrationRequest.getPhoneNumber() == null || registrationRequest.getAddress() == null) {
            return Response.builder()
                    .status(HttpStatus.BAD_REQUEST.value())
                    .message("All informations are required")
                    .build();
        }

        // Step 1: Create the new prospect
        User user = User.builder()
                .name(registrationRequest.getName())
                .email(registrationRequest.getEmail())
                .password(passwordEncoder.encode(registrationRequest.getPassword()))
                .phoneNumber(registrationRequest.getPhoneNumber())
                .address(registrationRequest.getAddress())
                .accountLocked(false)
                .enabled(false)
                .role(UserRole.PROSPECT)
                .build();

        // Step 2: Find the agent with the least number of prospects
        List<User> agents = userRepo.findByRole(UserRole.AGENT);
        User selectedAgent = findAgentWithLeastProspects(agents);

        // Step 3: Create the ProspectSelection object and assign it to the agent
        ProspectSelection selection = ProspectSelection.builder()
                .role(registrationRequest.getProspectSelection().getRole())
                .propertyType(registrationRequest.getProspectSelection().getPropertyType())
                .workType(registrationRequest.getProspectSelection().getWorkType())
                .budget(registrationRequest.getProspectSelection().getBudget())
                .assignedAgent(selectedAgent)
                .user(user)
                .build();

        user.setProspectSelection(selection);

        try {
            User savedUser = userRepo.save(user);

            // Step 4: Save the ProspectSelection
            prospectSelectionRepo.save(selection);

            try {
                Context context = new Context();
                context.setVariable("name", user.getName()); // Variable pour la template
                context.setVariable("agentName", selectedAgent.getName()); // Nom de l'agent
                context.setVariable("agentEmail", selectedAgent.getEmail()); // Email de l'agent

                // Envoi de l'email avec les informations de l'agent
                emailService.sendEmailWithTemplate(
                        user.getEmail(),
                        "Bienvenue chez Notre Service",
                        "email-template", // Nom du fichier de template sans extension
                        context
                );
            } catch (Exception emailException) {
                log.error("Échec de l'envoi de l'email au prospect : {}", user.getEmail(), emailException);
            }

            UserDto userDto = entityDtoMapper.mapUserToDtoBasic(savedUser);
            return Response.builder()
                    .status(HttpStatus.OK.value())
                    .message("Prospect successfully registered")
                    .user(userDto)
                    .build();
        } catch (Exception e) {
            log.error("Failed to register prospect", e);
            return Response.builder()
                    .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .message("Failed to register prospect: " + e.getMessage())
                    .build();
        }
    }

    public List<ProspectSelection> getAllProspects() {
        return prospectSelectionRepo.findAll();
    }

    public List<ProspectSelection> getAssignedProspects(Long agentId) {
        return prospectSelectionRepo.findByAssignedAgentId(agentId);
    }

    private User findAgentWithLeastProspects(List<User> agents) {
        User leastAssignedAgent = null;
        int minProspects = Integer.MAX_VALUE;

        for (User agent : agents) {
            int prospectsCount = agent.getAssignedProspects().size();
            if (prospectsCount < minProspects) {
                minProspects = prospectsCount;
                leastAssignedAgent = agent;
            }
        }

        return leastAssignedAgent;
    }

    public Response getUsersAndAgentsAssigned() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName(); // Récupère l'email de l'utilisateur connecté
        Optional<User> currentUserOpt = userRepo.findByEmail(email);

        if (!currentUserOpt.isPresent()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("User not found")
                    .build();
        }

        User currentUser = currentUserOpt.get();

        if (currentUser.getRole() == UserRole.AGENT) {
            // Récupérer les utilisateurs assignés à cet agent
            List<User> assignedUsers = userRepo.findByAgent(currentUser);
            List<UserDto> userDtos = assignedUsers.stream()
                    .map(user -> new UserDto(user))
                    .collect(Collectors.toList());

            return Response.builder()
                    .status(HttpStatus.OK.value())
                    .message("Assigned users retrieved successfully")
                    .users(userDtos)  // Nous renvoyons la liste des utilisateurs
                    .build();
        } else if (currentUser.getRole() == UserRole.USER) {
            // Récupérer l'agent assigné à cet utilisateur
            User assignedAgent = currentUser.getAgent();
            UserDto agentDto = new UserDto(assignedAgent);

            return Response.builder()
                    .status(HttpStatus.OK.value())
                    .message("Assigned agent retrieved successfully")
                    .user(agentDto)  // Nous renvoyons l'agent
                    .build();
        }

        return Response.builder()
                .status(HttpStatus.FORBIDDEN.value())
                .message("Invalid role")
                .build();
    }

    @Override
    public Response loginUser(LoginRequest loginRequest) {

        User user = userRepo.findByEmail(loginRequest.getEmail()).orElseThrow(() -> new NotFoundException("Email not found"));
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Password does not match");
        }
        if (!user.isEnabled()) {
            throw new IllegalStateException("Account not activated. Please check your email for the activation link.");
        }

        String token = jwtUtils.generateToken(user);

        return Response.builder()
                .status(200)
                .message("User Successfully Logged In")
                .token(token)
                .expirationTime("6 Month")
                .role(user.getRole().name())
                .build();
    }

    @Override
    public Response getAllUsers() {

        List<User> users = userRepo.findAll();
        List<UserDto> userDtos = users.stream()
                .map(entityDtoMapper::mapUserToDtoBasic)
                .toList();

        return Response.builder()
                .status(200)
                .userList(userDtos)
                .build();
    }


    @Override
    public User getLoginUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        log.info("User Email is: " + email);
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User Not found"));
    }

    @Override
    public Response getUserInfo() {
        User user = getLoginUser();
        UserDto userDto = entityDtoMapper.mapUserToDtoBasic(user);

        return Response.builder()
                .status(200)
                .user(userDto)
                .build();
    }

    @Transactional
    public void activateAccount(String token) throws MessagingException {
        Token savedToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid "));
        if (LocalDateTime.now().isAfter(savedToken.getExpiresAt())) {
            sendValidationEmail(savedToken.getUser());
            throw new RuntimeException("Activation token has expired. A new token has been send to the same email address");
        }

        var user = userRepo.findById(savedToken.getUser().getId())
                .orElseThrow(() -> new UsernameNotFoundException("Not found"));
        user.setEnabled(true);
        userRepo.save(user);

        savedToken.setValidatedAt(LocalDateTime.now());
        tokenRepository.save(savedToken);
    }

    private String generateAndSaveActivationToken(User user) {
        String generatedToken = generateActivationCode(6);
        var token = Token.builder()
                .token(generatedToken)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(15))
                .user(user)
                .build();
        tokenRepository.save(token);

        return generatedToken;
    }

    private void sendValidationEmail(User user) throws MessagingException {
        var newToken = generateAndSaveActivationToken(user);

        emailService.sendEmail(
                user.getEmail(),
                user.getName(),
                EmailTemplateName.ACTIVATE_ACCOUNT,
                activationUrl,
                newToken,
                "Account activation"
        );
    }

    private String generateActivationCode(int length) {
        String characters = "0123456789";
        StringBuilder codeBuilder = new StringBuilder();

        SecureRandom secureRandom = new SecureRandom();

        for (int i = 0; i < length; i++) {
            int randomIndex = secureRandom.nextInt(characters.length());
            codeBuilder.append(characters.charAt(randomIndex));
        }

        return codeBuilder.toString();
    }


    public User findByEmail(String email) {
        Optional<User> optionalUser = userRepo.findByEmail(email);
        return optionalUser.orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    public User getUserById(Long userId) {
        return userRepo.findById(userId).orElse(null);
    }

    public void DeleteUser(Long id) {
        userRepo.deleteById(id);
    }

    public void DeleteToken(Integer id) {
        tokenRepository.deleteById(id);
    }

    public void requestPasswordReset(String email) throws MessagingException {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Email not found"));

        String resetToken = generateResetToken();
        user.setResetPasswordToken(resetToken);
        user.setResetPasswordTokenExpiry(LocalDateTime.now().plusHours(24));
        userRepo.save(user);

        String resetUrl = "http://localhost:4200/reset-password?token=" + resetToken;

        emailService.sendEmailreset(
                user.getEmail(),
                user.getName(),
                "reset-password",  // Nom du template HTML
                resetUrl,
                "Reset Your Password"
        );
    }

    private String generateResetToken() {
        return UUID.randomUUID().toString();
    }

    public void resetPassword(String token, String newPassword) {
        User user = userRepo.findByResetPasswordToken(token)
                .orElseThrow(() -> new NotFoundException("Invalid reset token"));

        if (user.getResetPasswordTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Reset token has expired");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetPasswordToken(null);
        user.setResetPasswordTokenExpiry(null);
        userRepo.save(user);
    }
}


