package kz.kdlolymp.springmckomek.controller;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import kz.kdlolymp.springmckomek.controller.serializers.UserSerializer;
import kz.kdlolymp.springmckomek.entity.*;
import kz.kdlolymp.springmckomek.entity.User;
import kz.kdlolymp.springmckomek.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Controller
public class AdminController {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Autowired
    private UserService userService;
    @Autowired
    private CityService cityService;
    @Autowired
    private KnowledgeService knowledgeService;
    @Autowired
    private SpecialityService specialityService;
    @Autowired
    private ServicesService servicesService;
    @Autowired
    private DefaultEmailService emailService;

    private Gson gson = new Gson();
    private String message = "";

    @RequestMapping("/worker")
    public String viewWorkPage(Model model) {
        User user = getUserFromAuthentication();
        if (user!=null) {
            List<City> cities = cityService.getAll(true);
            List<Knowledge> knowledgeList = knowledgeService.getAll();
            List<Speciality> specialities = specialityService.getAllSpecialities(true);
            List<Services> servicesList = servicesService.getAllServices(true);
            model.addAttribute("user", user);
            model.addAttribute("cities", cities);
            model.addAttribute("knowledgeList", knowledgeList);
            model.addAttribute("specialities", specialities);
            model.addAttribute("servicesList", servicesList);
            return "worker";
        } else {
            return "redirect: login";
        }
    }

    @RequestMapping("/editor")
    public String viewEditorPage(Model model) {
        User user = getUserFromAuthentication();
        if (user!=null) {
            List<City> cities = cityService.getAll(false);
            List<Knowledge> knowledgeList = knowledgeService.getAll();
            List<Speciality> specialities = specialityService.getAllSpecialities(false);
            List<Services> servicesList = servicesService.getAllServices(false);
            model.addAttribute("user", user);
            model.addAttribute("cities", cities);
            model.addAttribute("knowledgeList", knowledgeList);
            model.addAttribute("specialities", specialities);
            model.addAttribute("servicesList", servicesList);
            if(user.isEditor() || user.getRole() == "ADMIN"){
                return "editor";
            } else {
                return "redirect: worker";
            }
        } else {
            return "redirect: login";
        }
    }

    @RequestMapping("/admin")
    public String viewAdminPage(Model model) {
        User user = getUserFromAuthentication();
        if (user != null && user.getRole() == "ADMIN") {
            model.addAttribute("user", user);
            return "admin";
        } else {
            return "redirect: ../login";
        }
    }

    private User getUserFromAuthentication() {
        String username = "";
        SecurityContext securityContext = SecurityContextHolder.getContext();
        Authentication authentication = securityContext.getAuthentication();
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        return userService.findByUsername(username);
    }


    @RequestMapping("/change-password")
    public String viewChangePassword(Model model) {
        User user = getUserFromAuthentication();
        if (user != null) {
            model.addAttribute("user", user);
            return "change-password";
        } else {
            return "redirect: ../login";
        }
    }

    @PostMapping("/admin/add-user")
    public void addUser(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        User userForm = new User();
        userForm.setUsername(req.getParameter("username").trim());
        userForm.setUserSurname(req.getParameter("userSurname").trim());
        userForm.setUserFirstname(req.getParameter("userFirstname").trim());
        userForm.setPosition(req.getParameter("position").trim());
        String email = req.getParameter("email").trim();
        userForm.setEmail(email);
        userForm.setRole(req.getParameter("role"));
        userForm.setEditor(Boolean.parseBoolean(req.getParameter("editor")));
        TemporaryPasswordGenerator generator = new TemporaryPasswordGenerator();
        String password = generator.generateTemporaryPassword();
        userForm.setPassword(password);
        userForm.setEnabled(true);
        userForm.setTemporary(true);
        if (userService.addNewUser(userForm)) {
            User user = userService.findByUsername(userForm.getUsername());
            if (emailService.sendNewUserMessage(user.getUserSurname() + " " + user.getUserFirstname(),
                    user.getUsername(), email, password)) {
                message = "Пользователь " + user.getUserSurname() + " " + user.getUserFirstname() + " добавлен." +
                        "<br>Сообщение о регистрации с разовым паролем выслано на адрес электронной почты пользователя.";
            } else {
                message = "Пользователь зарегистрирован в системе, но сообщение о регистрации с разовым паролем НЕ БЫЛО ВЫСЛАНО на адрес электронной почты пользователя из-за сбоя работы почтового сервера.";
            }
        } else {
            message = "Пользователь с логином " + userForm.getUsername() + " уже имеется.";
        }
        resp.setContentType("text");
        resp.setCharacterEncoding("UTF-8");
        resp.getWriter().print(message);
        resp.getWriter().flush();
        resp.getWriter().close();
    }

    @PostMapping("/admin/search-user")
    public void searchUser(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        String text = req.getParameter("text").trim() + "%";
        List<User> usersList = userService.getUsersByPartUsername(text);
        List<User> users = new ArrayList<>();
        if (usersList.size() > 0) {
            for (User userFromList : usersList) {
                User user = new User();
                user.setId(userFromList.getId());
                user.setUsername(userFromList.getUsername());
                user.setUserFirstname(userFromList.getUserFirstname());
                user.setUserSurname(userFromList.getUserSurname());
                user.setPosition(userFromList.getPosition());
                user.setRole(userFromList.getRole());
                user.setEditor(userFromList.isEditor());
                user.setEnabled(userFromList.isEnabled());
                users.add(user);
            }
        }
        GsonBuilder builder = new GsonBuilder();
        builder.registerTypeAdapter(User.class, new UserSerializer());
        resp.setContentType("json");
        resp.setCharacterEncoding("UTF-8");
        resp.getWriter().print(builder.create().toJson(users));
        resp.getWriter().flush();
        resp.getWriter().close();
    }


    @PostMapping("/admin/edit-user")
    public void editUser(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        Long id = Long.parseLong(req.getParameter("id"));
        String userSurname = req.getParameter("userSurname");
        String userFirstname = req.getParameter("userFirstname");
        String position = req.getParameter("position");
        String email = req.getParameter("email");
        String username = req.getParameter("username");
        String role = req.getParameter("role");
        boolean editor = Boolean.parseBoolean(req.getParameter("editor"));
        User user = userService.findUserById(id);
        user.setUserSurname(userSurname);
        user.setUserFirstname(userFirstname);
        user.setPosition(position);
        user.setEmail(email);
        user.setUsername(username);
        user.setEditor(editor);
        user.setRole(role);
        if (userService.saveUser(user)) {
            message = "Данные пользователя " + user.getUserSurname() + " " + user.getUserFirstname() + " изменены.";
        } else {
            message = "Ошибка редактирования пользователя";
        }
        resp.setContentType("text");
        resp.setCharacterEncoding("UTF-8");
        resp.getWriter().print(message);
        resp.getWriter().flush();
        resp.getWriter().close();
    }

    @PostMapping("/admin/del-user")
    public void deleteUser(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        Long id = Long.parseLong(req.getParameter("id"));
        User user = userService.findUserById(id);
        user.setEnabled(false);
        if (userService.saveUser(user)) {
            message = "Пользователю " + user.getUserSurname() + " " + user.getUserFirstname() + " закрыт доступ к базе данных.";
        } else {
            message = "Ошибка удаления пользователя";
        }
        resp.setContentType("text");
        resp.setCharacterEncoding("UTF-8");
        resp.getWriter().print(message);
        resp.getWriter().flush();
        resp.getWriter().close();
    }

    @PostMapping("/admin/remove-user")
    public void removeUser(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        Long id = Long.parseLong(req.getParameter("id"));
        User user = userService.findUserById(id);
        user.setEnabled(false);
        if (userService.saveUser(user)) {
            message = "Пользователю " + user.getUserSurname() + " " + user.getUserFirstname() + " открыт доступ к просмотру записей в базе данных.";
        } else {
            message = "Ошибка восстановления пользователя";
        }
        resp.setContentType("text");
        resp.setCharacterEncoding("UTF-8");
        resp.getWriter().print(message);
        resp.getWriter().flush();
        resp.getWriter().close();
    }

    @PostMapping("/change-password/change")
    public String changePassword(HttpServletRequest req, HttpServletResponse resp, Model model) {
        String password = req.getParameter("password");
        String username = "";
        SecurityContext securityContext = SecurityContextHolder.getContext();
        Authentication authentication = securityContext.getAuthentication();
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        User user = userService.findByUsername(username);
        user.setPassword(password);
        user.setTemporary(false);
        if (userService.changePassword(user)) {
            return "redirect: ../worker";
        } else {
            model.addAttribute("errorChange", "Ошибка смены пароля пользователя");
            return "change-password";
        }

    }

    @PostMapping("/forget-password")
    public void forgetPassword(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        String username = req.getParameter("username");
        User user = userService.findByUsername(username);
        if (user != null && user.isEnabled()) {
            TemporaryPasswordGenerator generator = new TemporaryPasswordGenerator();
            String password = generator.generateTemporaryPassword();
            user.setPassword(password);
            user.setTemporary(true);
            String userName = user.getUserSurname() + user.getUserFirstname();
            if (userService.changePassword(user)) {
                message = "Временный пароль отправлен на ваш адрес электронной почты, указанный при регистрации.";
                String toAddress = user.getEmail();
                Thread sendMessage = new Thread(new Runnable() {
                    @Override
                    public void run() {
                        emailService.sendTemporaryPassword(userName, toAddress, password);
                    }
                });
                sendMessage.start();
            } else {
                message = "Ошибка сброса пароля. <br>Сервер не доступен. Повторите позднее.";
            }
        } else {
            message = "";
        }
        resp.setContentType("text");
        resp.setCharacterEncoding("UTF-8");
        resp.getWriter().print(message);
        resp.getWriter().flush();
        resp.getWriter().close();
    }

    @PostMapping("/admin/search-users")
    public void searchDepartmentUsers(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        String userSurname = req.getParameter("userSurname");
        String userFirstname = req.getParameter("userFirstname");
        List<User> users = new ArrayList<>();
        if(userSurname.length()>0 || userFirstname.length()>0){
            users = userService.getAllByPartName(userSurname, userFirstname);
        } else {
            users = userService.getAll();
        }
        GsonBuilder builder = new GsonBuilder();
        builder.registerTypeAdapter(User.class, new UserSerializer());
        resp.setContentType("json");
        resp.setCharacterEncoding("UTF-8");
        resp.getWriter().print(builder.create().toJson(users));
        resp.getWriter().flush();
        resp.getWriter().close();
    }


}
