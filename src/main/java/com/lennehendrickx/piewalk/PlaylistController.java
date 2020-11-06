package com.lennehendrickx.piewalk;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
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
        try (Stream<Path> songPaths = Files.list(basePath)) {
            List<Song> playlist = songPaths.filter(Files::isDirectory).map(this::toSong).collect(Collectors.toList());
            return Flux.fromIterable(playlist);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/{song}/{track}")
    Resource load(@PathVariable("song") String song, @PathVariable("track") String track) {
        return new FileSystemResource(basePath.resolve(song).resolve(track));
    }

    private Song toSong(Path songPath) {
        try(Stream<Path> trackPaths = Files.list(songPath)) {
            var name = songPath.getFileName().toString();
            var tracks = trackPaths.filter(Files::isRegularFile).map(Path::getFileName).map(Path::toString).map(Track::new).collect(Collectors.toList());
            return new Song(name, tracks);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
