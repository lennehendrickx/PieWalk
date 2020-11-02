package com.lennehendrickx.piewalk;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.reactive.config.EnableWebFlux;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Flux;

import static org.springframework.web.reactive.function.server.RouterFunctions.resources;

@SpringBootApplication
public class PiewalkApplication {

    public static void main(String[] args) {
        SpringApplication.run(PiewalkApplication.class, args);
    }

    @Bean
    RouterFunction<ServerResponse> clientRouter(){
        return RouterFunctions.resources("/**", new FileSystemResource("./client/build/"));
    }

}
