package com.lennehendrickx.piewalk;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class PiewalkApplication {

    public static void main(String[] args) {
        SpringApplication.run(PiewalkApplication.class, args);
    }

}
