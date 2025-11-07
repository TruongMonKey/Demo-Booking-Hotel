package com.example.hotelbookingserver.services.impl;

import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

public interface IImageService {

    Map uploadImage(MultipartFile file);

}
