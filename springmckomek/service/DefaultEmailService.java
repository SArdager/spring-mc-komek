package kz.kdlolymp.springmckomek.service;

import kz.kdlolymp.springmckomek.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.File;
import java.io.FileNotFoundException;
import java.util.List;

@Service
public class DefaultEmailService implements EmailService {
    @Autowired
    public JavaMailSender emailSender;
    @Autowired
    public UserService userService;

    @Override
    public void sendSimpleEmail(String toAddress, String subject, String message) throws MessagingException{
        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        simpleMailMessage.setTo(toAddress);
        simpleMailMessage.setSubject(subject);
        simpleMailMessage.setText(replaceBr(message));
        simpleMailMessage.setFrom("komek@kdlolymp.kz");
        emailSender.send(simpleMailMessage);
    }

    private String replaceBr(String message) {
        message.replaceAll("<br>", "\n");
        return message;
    }

    @Override
    public void sendEmailWithAttachment(String toAddress, String subject, String message, String attachment) throws MessagingException, FileNotFoundException {
        MimeMessage mimeMessage = emailSender.createMimeMessage();
        MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage, true);
        messageHelper.setTo(toAddress);
        messageHelper.setSubject(subject);
        messageHelper.setText(message);
        messageHelper.setFrom("komek@kdlolymp.kz");
        FileSystemResource file = new FileSystemResource(ResourceUtils.getFile(attachment));
        messageHelper.addAttachment("Purchase Order", file);
        emailSender.send(mimeMessage);
    }
    public void sendEmailWithMultiAttachment(String toAddress, String subject, String message, File[] attachments) {
        MimeMessage mimeMessage = emailSender.createMimeMessage();
        MimeMessageHelper messageHelper;
        try {
            messageHelper = new MimeMessageHelper(mimeMessage, true);
            messageHelper.setTo(toAddress);
            messageHelper.setSubject(subject);
            messageHelper.setText(message);
            messageHelper.setFrom("komek@kdlolymp.kz");
            for(File file : attachments){
                FileSystemResource fsr = new FileSystemResource(file);
                messageHelper.addAttachment(file.getName(), fsr);
            }
            emailSender.send(mimeMessage);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    public void sendMessageToAdmin(String message) {
        List<User> admins = userService.getAdmins();
        try {
            for (User user: admins) {
                sendSimpleEmail(user.getEmail(), "ВАЖНО: Системное предупреждение", message);
            }
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }
    public boolean sendTemporaryPassword(String userName, String toAddress, String password) {
        String subject = "Временный пароль";
        String message = "Уважаемая(ый) " + userName + "!\nМы получили запрос на отправку разового пароля для вашей учетной записи.\nВаш разовый пароль:   " +
                password + " \nПосле входа по разовому паролю вам необходимо будет установить новый пароль.\n" +
                "Если вы не запрашивали разовый пароль, игнорируйте это сообщение.\n\n" +
                "Не следует отвечать на это сообщение. \n\nС уважением,\nСлужба поддержки контакт-центра";
        try {
            sendSimpleEmail(toAddress, subject, message);
            return true;
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }
    public boolean sendNewUserMessage(String userName, String login, String toAddress, String password) {
        String subject = "Регистрация в информационной системе контакт-центра";
        String message = "Уважамый(ая) " + userName + "! \nВы зарегистрированы в информационной системе контакт-центра.\n" +
                "Для входа в систему зайдите в браузере на адрес: https://komek.kdlolymp.kz:8443/mc-komek/ и авторизуйтесь \n           по логину: " +
                login + " \n            и паролю: " + password + " \nПосле входа по разовому паролю вам необходимо будет установить новый пароль." +
                "\nНе следует отвечать на это сообщение. \n\nС уважением,\nСлужба поддержки контакт-центра";
        try {
            sendSimpleEmail(toAddress, subject, message);
            return true;
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }
    public boolean sendNewLoginMessage(String userName, String login, String toAddress, String password) {
        String subject = "Изменение логина в информационной системе контакт-центра";
        String message = "Уважамый(ая) " + userName + "! \nВам изменен логин для входа в информационную систему контакт-центра.\n" +
                "Для входа в систему зайдите в браузере на адрес: https://komek.kdlolymp.kz:8443/mc-komek/ и авторизуйтесь по новому логину\n           по логину: " +
                login + " \n            и паролю: " + password + " \nАвторизация по ранее высланному логину и паролю не возможна.\nПосле входа по разовому паролю вам необходимо будет установить новый пароль." +
                "\nНе следует отвечать на это сообщение. \n\nС уважением,\nСлужба поддержки контакт-центра";
        try {
            sendSimpleEmail(toAddress, subject, message);
            return true;
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }
    public boolean sendNewEmailMessage(String userName, String toAddress, String newAddress) {
        String subject = "Изменение логина в информационной системе контакт-центра";
        String message = "Уважамый(ая) " + userName + "! \nВам изменен адрес электронной почты, на который в дальнейшем в информационной системе контакт-центра будут отправляться сообщения.\n" +
                "Новый почтовый адрес:  " + newAddress +
                "\nНе следует отвечать на это сообщение. \n\nС уважением,\nСлужба поддержки системы контакт-центра";
        try {
            sendSimpleEmail(toAddress, subject, message);
            return true;
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }

}
