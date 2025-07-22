package com.example.hotelbookingserver.configs;

import java.util.HashMap;
import java.util.Map;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.cloudinary.Cloudinary;

@Configuration
public class CloudinaryConfig {
    @Bean
    public Cloudinary getCloudinary() {
        Map config = new HashMap();
        config.put("cloud_name", "dortxje8z");
        config.put("api_key", "473175333629267");
        config.put("api_secret", "C3Fx0b2adQtHMMBuBuUGKs34S7w");
        config.put("secure", true);
        return new Cloudinary(config);
    }
}
