package com.nichenetwork.nichenetwork_backend.security.auth;

import com.nichenetwork.nichenetwork_backend.email.EmailService;
import com.nichenetwork.nichenetwork_backend.exceptions.BadRequestException;
import com.nichenetwork.nichenetwork_backend.user.User;
import com.nichenetwork.nichenetwork_backend.user.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Optional;
import java.util.Set;

@Service
public class AppUserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AppUserRepository appUserRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private EmailService emailService;

    public User registerUser(String username, String password, String email, String firstName, String lastName, Set<Role> roles) throws MessagingException {
        if (appUserRepository.existsByUsername(username)) {
            throw new EntityExistsException("Username già in uso");
        }
        if (appUserRepository.existsByEmail(email)) {
            throw new EntityExistsException("Email gia' in uso");
        }

        if(email == null) {
            throw new BadRequestException("Email non valida");
        }

        if(password.length() < 8) {
            throw new BadRequestException("La password deve avere almeno 8 caratteri");
        }

        if (roles == null || roles.isEmpty()) {
            throw new BadRequestException("Almeno un ruolo deve essere assegnato");
        }

        AppUser appUser = new AppUser();
        appUser.setUsername(username);
        appUser.setPassword(passwordEncoder.encode(password));
        appUser.setEmail(email);
        appUser.setRoles(roles);
        appUserRepository.save(appUser);

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setBio(null);
        user.setAvatar(null);

        userRepository.save(user);

        emailService.sendEmail(email, firstName);

        return user;
    }

    public Optional<AppUser> findByUsername(String username) {
        return appUserRepository.findByUsername(username);
    }

    public String authenticateUser(String username, String password)  {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            return jwtTokenUtil.generateToken(userDetails);
        } catch (AuthenticationException e) {
            throw new SecurityException("Credenziali non valide", e);
        }
    }


    public AppUser loadUserByUsername(String username)  {
        AppUser appUser = appUserRepository.findByUsername(username)
            .orElseThrow(() -> new EntityNotFoundException("Utente non trovato con username: " + username));


        return appUser;
    }


    //crea un admin
    @Transactional
    public ResponseEntity<String> createAdminUser(AdminUserRequest request) {
        AppUser appUser = new AppUser();
        appUser.setUsername(request.getUsername());
        appUser.setPassword(passwordEncoder.encode(request.getPassword()));
        appUser.setEmail(request.getEmail());
        appUser.setRoles(Set.of(Role.ADMIN));
        appUserRepository.save(appUser);

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setBio(null);
        user.setAvatar(null);
        userRepository.save(user);
        return ResponseEntity.ok("Admin successfully created");

    }

    //elmina un admin
    public ResponseEntity<String> deleteAdminUser(Long id) {
        appUserRepository.deleteById(id);
        return ResponseEntity.ok("Admin successfully deleted");
    }

}
