package com.lennehendrickx.piewalk;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.function.Predicate;

import static java.util.Comparator.comparing;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static reactor.core.publisher.Flux.fromStream;

@RestController
@CrossOrigin
@RequestMapping(path = "/song", produces = APPLICATION_JSON_VALUE)
public class SongController {

    @Value("${BASE_PATH:/Users/lennehendrickx/Documents/karaoke-version-lijst}")
    private Path basePath;

    @GetMapping
    Flux<Song> song() {
        return list(basePath, Files::isDirectory)
                .flatMap(this::toSong)
                .sort(comparing(Song::getName));
    }

    @GetMapping("/{song}/{track}")
    Resource load(@PathVariable("song") String song, @PathVariable("track") String track) {
        return new FileSystemResource(basePath.resolve(song).resolve(track));
    }

    private Mono<Song> toSong(Path songPath) {
        return Mono.just(songPath)
                .zipWith(getTracks(songPath).collectList())
                .map(songWithTracks -> {
                    var song = songWithTracks.getT1();
                    var tracks = songWithTracks.getT2();
                    var name = toName(song.getFileName().toString());
                    var path = basePath.relativize(song).toString();
                    return new Song(name, path, tracks);
                });
    }

    private Flux<Track> getTracks(Path songPath) {
        return list(songPath, Files::isRegularFile)
                .map(this::toTrack)
                .sort(comparing(Track::getName));
    }

    private Track toTrack(Path trackPath) {
        var name = toName(trackPath.getFileName().toString());
        var path = basePath.relativize(trackPath).toString();
        return new Track(name, path);
    }

    private static Flux<Path> list(Path path, Predicate<Path> predicate) {
        try {
            return fromStream(Files.list(path)).filter(predicate);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private static String toName(String path) {
        return path.replaceAll("_", " ");
    }
}
