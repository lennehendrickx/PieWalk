package com.lennehendrickx.piewalk;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@RestController
@RequestMapping(path = "/playlist", produces = APPLICATION_JSON_VALUE)
public class PlaylistController {

    @Value("${BASE_PATH:/Users/lennehendrickx/Documents/karaoke-version-lijst}")
    private Path basePath;

    @GetMapping
    Flux<Song> playlist() {
        return Flux.fromStream(list(basePath, Files::isDirectory).map(this::toSong));
    }

    @GetMapping("/{song}/{track}")
    Resource load(@PathVariable("song") String song, @PathVariable("track") String track) {
        return new FileSystemResource(basePath.resolve(song).resolve(track));
    }

    private Song toSong(Path songPath) {
        var name = songPath.getFileName().toString();
        var tracks = list(songPath, Files::isRegularFile).map(Path::getFileName).map(Path::toString).map(Track::new).collect(Collectors.toList());
        return new Song(name, tracks);
    }

    private static Stream<Path> list(Path path, Predicate<Path> predicate) {
        try {
            return Files.list(path).filter(predicate);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
