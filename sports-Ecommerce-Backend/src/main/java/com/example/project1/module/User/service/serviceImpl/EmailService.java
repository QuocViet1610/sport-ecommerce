package com.example.project1.module.User.service.serviceImpl;

import com.example.project1.expection.ValidateException;
import com.example.project1.model.enity.User.UserVerification;
import com.example.project1.module.User.repository.UserVerificationRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmailService {
    JavaMailSender mailSender;
    UserVerificationRepository verificationRepository;
    private static final int OTP_LENGTH = 6;
    private static final int OTP_EXPIRATION_MINUTES = 5;


    public void sendVerificationEmail(String email, String verificationCode) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(email);
            helper.setSubject("Xác nhận tài khoản");
            helper.setText("Mã xác nhận của bạn là: <b>" + verificationCode + "</b>", true);
            helper.setFrom("vietddls06@gmail.com");
            mailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    public String generateVerificationCode() {
        return String.format("%06d", new Random().nextInt(999999));
    }

    // Tính thời gian hết hạn của OTP (5 phút)

    public LocalDateTime getExpiryTime() {
        return LocalDateTime.now().plusMinutes(OTP_EXPIRATION_MINUTES);
    }

}
