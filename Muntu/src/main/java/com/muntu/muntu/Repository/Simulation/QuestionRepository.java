package com.muntu.muntu.Repository.Simulation;

import com.muntu.muntu.Entity.Simulation.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface QuestionRepository extends JpaRepository<Question,Long> {
    @Transactional
    @Modifying
    @Query("UPDATE Question q SET q.text = :text WHERE q.id = :questionId")
    void updateQuestionText(@Param("questionId") Long questionId, @Param("text") String text);

    @Transactional
    @Modifying
    @Query("UPDATE Categorie c SET c.content = :content, c.price = :price WHERE c.id = :categoryId")
    void updateCategory(@Param("categoryId") Long categoryId, @Param("content") String content, @Param("price") int price);
}
