package com.muntu.muntu.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDTO {
    private String content;
    private int price;
    private String title;
    private String description;
    private String descriptionTitle;
    private MultipartFile image;
}
