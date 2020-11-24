package com.lennehendrickx.piewalk;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.web.bind.annotation.*;
import reactor.core.scheduler.Schedulers;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.function.Predicate;
import java.util.stream.Stream;

import static com.lennehendrickx.piewalk.Mp3Parser.parseMp3Metadata;
import static java.nio.file.Files.newInputStream;
import static java.util.Comparator.comparing;
import static java.util.stream.Collectors.toList;
import static org.springframework.util.MimeTypeUtils.APPLICATION_JSON_VALUE;
import static reactor.core.publisher.Flux.fromStream;

@RestController
@CrossOrigin
@RequestMapping(path = "/song", produces = APPLICATION_JSON_VALUE)
public class SongController {

    @Value("${BASE_PATH:/Users/lennehendrickx/Documents/karaoke-version-lijst}")
    private Path basePath;

    @GetMapping
    @Cacheable("song")
    public Collection<Song> song() {
        return fromStream(list(basePath, Files::isDirectory))
                .parallel(10)
                .runOn(Schedulers.elastic())
                .map(this::toSong)
                .sorted(comparing(Song::getName))
                .collect(toList())
                .block();
    }

    @GetMapping("/{song}/{track}")
    public Resource load(@PathVariable("song") String song, @PathVariable("track") String track) {
        return new FileSystemResource(basePath.resolve(song).resolve(track));
    }

    private Song toSong(Path songPath) {
        var tracks = getTracks(songPath);
        var name = toName(songPath.getFileName().toString());
        var path = basePath.relativize(songPath).toString();
        var metadata = firstTrackMetadata(tracks);
        return new Song(name, path, tracks, metadata.orElse(null));
    }

    private Optional<Metadata> firstTrackMetadata(List<Track> tracks) {
        return tracks
                .stream()
                .findFirst()
                .map(firstTrack -> Path.of(firstTrack.getSrc()))
                .map(trackPath -> basePath.resolve(trackPath))
                .flatMap(this::parseMetadata);
    }

    private List<Track> getTracks(Path songPath) {
        return list(songPath, Files::isRegularFile)
                .map(this::toTrack)
                .sorted(comparing(Track::getName))
                .collect(toList());
    }

    private Track toTrack(Path trackPath) {
        var name = toName(trackPath.getFileName().toString());
        var path = basePath.relativize(trackPath).toString();
        return new Track(name, path);
    }

    private Optional<Metadata> parseMetadata(Path trackPath) {
        try (var trackStream = newInputStream(trackPath)) {
            return parseMp3Metadata(trackStream)
                    .map(mp3Metadata -> new Metadata(
                            mp3Metadata.getTitle().orElse(null),
                            mp3Metadata.getGenre().orElse(null),
                            mp3Metadata.getComposer().orElse(null),
                            mp3Metadata.getAlbum().orElse(null),
                            mp3Metadata.getReleaseDate().orElse(null),
                            mp3Metadata.getArtist().orElse(null),
                            mp3Metadata.getDuration().orElse(null)
                    ));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private static Stream<Path> list(Path path, Predicate<Path> predicate) {
        try {
            return Files.list(path).filter(predicate);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private static String toName(String path) {
        return path.replaceAll("_", " ");
    }
}
