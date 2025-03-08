package com.muntu.muntu.Entity.Simulation;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name="categorie")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Categorie {
    @Id
    @GeneratedValue
    private Long id;
    private String content;
    private int price;
    private String title;
    private String imageUrl;
    private String description;
    private String descriptionTitle;
    private final LocalDateTime createdAt = LocalDateTime.now();

    public Categorie(String content, int price, String title,String imageUrl, String description, String descriptionTitle) {
        this.content = content;
        this.price = price;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.descriptionTitle = descriptionTitle;

    }
}
