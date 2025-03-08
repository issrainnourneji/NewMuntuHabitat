package com.muntu.muntu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MuntuApplication {

    public static void main(String[] args) {
        SpringApplication.run(MuntuApplication.class, args);
    }

}
