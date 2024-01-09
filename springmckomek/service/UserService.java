package kz.kdlolymp.springmckomek.service;

import kz.kdlolymp.springmckomek.entity.User;
import kz.kdlolymp.springmckomek.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;

@Component
@Service
public class UserService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;
    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
    @Autowired
    private EntityManager manager;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username);
        if(user != null && user.isEnabled()){
            UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                    .username(user.getUsername())
                    .password(user.getPassword())
                    .roles(user.getRole())
                    .build();
            return userDetails;
        } else {
            throw new UsernameNotFoundException("User: " + username + " - not found");
        }
    }

    public User findUserById(Long userId){
        return userRepository.findUserById(userId);
    }
    public User findByUsername(String username){
        return userRepository.findByUsername(username);
    }

    public List<User> getDoubleUsers(){
        List<User> users = manager.createQuery("SELECT u FROM User u", User.class).getResultList();
        List<User> doubleUsers = new ArrayList<>();
        for(int i=0; i<users.size(); i++){
            boolean isExist = false;
            User user = users.get(i);
            String userSurname = user.getUserSurname();
            if(doubleUsers!=null && doubleUsers.size()>0){
                for(int j=0; j<doubleUsers.size(); j++){
                    if(doubleUsers.get(j).getUserSurname().equals(userSurname)){
                        isExist = true;
                    }
                }
            }
            List<User> newDoubleUsers = new ArrayList<>();
            if(!isExist){
                newDoubleUsers = manager.createQuery("SELECT u FROM User u WHERE u.userSurname = '" + userSurname + "'", User.class).getResultList();
            }
            if(newDoubleUsers.size()>1){
                for(User newUser : newDoubleUsers){
                    doubleUsers.add(newUser);
                }
            }
        }
        return doubleUsers;
    };

    public boolean saveUser(User user){
        userRepository.save(user);
        return true;
    }
    public boolean addNewUser(User user){
        User userFromDB = userRepository.findByUsername(user.getUsername());
        if(userFromDB!= null){
            return false;
        }
        user.setPassword(passwordEncoder().encode(user.getPassword()));
        userRepository.save(user);
        return true;
    }

    public boolean changePassword(User user){
        String password = user.getPassword();
        user.setPassword(passwordEncoder().encode(password));
        userRepository.save(user);
        return true;
    }
    public List<User> getAll() {
        return userRepository.findAll();
    }
    public List<User> getAdmins() {
        return manager.createQuery("SELECT u FROM User u WHERE u.role = :paramRole", User.class)
                .setParameter("paramRole", "ADMIN").setMaxResults(10).getResultList();
    }

    public List<User> getUsersByPartUsername(String text) {
        return manager.createQuery("SELECT u FROM User u WHERE u.userSurname LIKE :text ORDER BY u.userSurname ASC", User.class)
                .setParameter("text", text).setMaxResults(200).getResultList();
    }

    public List<User> getAllByPartName(String surname, String name) {
        if(surname.length() > 0 && name.length() > 0){
            return manager.createQuery("SELECT u FROM User u WHERE u.userSurname LIKE :surname AND u.userFirstname LIKE :name ORDER BY u.userSurname ASC", User.class)
                    .setParameter("surname", surname).setParameter("name", name).setMaxResults(200).getResultList();
        } else if(surname.length() > 0 && name.length() == 0){
            return getUsersByPartUsername(surname);
        } else {
            return manager.createQuery("SELECT u FROM User u WHERE u.userFirstname LIKE :text ORDER BY u.userSurname ASC", User.class)
                    .setParameter("text", name).setMaxResults(20).getResultList();
        }
    }


}
