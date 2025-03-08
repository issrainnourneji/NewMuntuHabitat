package com.muntu.muntu.Dto;


import com.muntu.muntu.Enums.TypeSimulation;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionDTO {
    private String text;
    private TypeSimulation type;
    private List<CategoryDTO> categories;

}
