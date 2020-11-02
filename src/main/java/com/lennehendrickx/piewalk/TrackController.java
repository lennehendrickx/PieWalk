package com.lennehendrickx.piewalk;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@RestController
@RequestMapping(path = "/track", produces = APPLICATION_JSON_VALUE)
public class TrackController {


    @GetMapping("/load")
    Resource load(@RequestParam("path") String path) {
        return new FileSystemResource(path);
    }

    @GetMapping
    public Flux<String> tracks() {
        return Flux.just("track1", "track2");
    }

}
