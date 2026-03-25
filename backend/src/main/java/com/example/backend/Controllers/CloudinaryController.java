package com.example.backend.Controllers;

import com.example.backend.DTO.Response.ApiResponse;
import com.example.backend.DTO.Response.CloudinaryResponse;
import com.example.backend.Service.CloudinaryService;
import com.example.backend.util.FileUploadUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/image")
public class CloudinaryController {
    @Autowired
    private CloudinaryService cloudinaryService;

    @PostMapping("/upload")
    public ApiResponse<CloudinaryResponse> uploadImage(@RequestParam("file")MultipartFile file, @RequestParam("name") String name){
        FileUploadUtil.assertAllowed(file, FileUploadUtil.IMAGE_PATTERN);
        String filename = FileUploadUtil.getFileName(name);
        CloudinaryResponse cloudinaryResponse = cloudinaryService.uploadfile(file,filename);

        ApiResponse<CloudinaryResponse> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Upload thành công");
        response.setResult(cloudinaryResponse);

        return response;

    }
}
