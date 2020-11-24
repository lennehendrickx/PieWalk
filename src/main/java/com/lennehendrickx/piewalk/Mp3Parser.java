package com.lennehendrickx.piewalk;

import org.apache.tika.metadata.Metadata;
import org.apache.tika.metadata.XMPDM;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.parser.ParseContext;
import org.apache.tika.sax.BodyContentHandler;
import org.slf4j.Logger;

import java.io.InputStream;
import java.util.Optional;

import static java.util.Optional.ofNullable;
import static org.apache.tika.metadata.TikaCoreProperties.TITLE;
import static org.slf4j.LoggerFactory.getLogger;

public class Mp3Parser {
    private static final Logger LOGGER = getLogger(Mp3Parser.class);

    public static Optional<Mp3Metadata> parseMp3Metadata(InputStream inputStream) {
        try {
            var metadata = new Metadata();
            var handler = new BodyContentHandler();
            var parser = new org.apache.tika.parser.mp3.Mp3Parser();
            parser.parse(inputStream, handler, metadata, new ParseContext());
            var mp3Metadata = new Mp3Metadata(
                    metadata.get(TITLE),
                    metadata.get(XMPDM.GENRE),
                    metadata.get(XMPDM.COMPOSER),
                    metadata.get(XMPDM.ALBUM),
                    metadata.get(XMPDM.RELEASE_DATE),
                    metadata.get(XMPDM.ARTIST),
                    metadata.get(XMPDM.DURATION)
            );
            return Optional.of(mp3Metadata);
        } catch (Exception e) {
            LOGGER.warn(e.getMessage());
            return Optional.empty();
        }
    }

    public static class Mp3Metadata {
        private final String title;
        private final String genre;
        private final String composer;
        private final String album;
        private final String releaseDate;
        private final String artist;
        private final String duration;

        public Mp3Metadata(String title,
                           String genre,
                           String composer,
                           String album,
                           String releaseDate,
                           String artist,
                           String duration) {
            this.title = title;
            this.genre = genre;
            this.composer = composer;
            this.album = album;
            this.releaseDate = releaseDate;
            this.artist = artist;
            this.duration = duration;
        }

        public Optional<String> getTitle() {
            return ofNullable(title);
        }

        public Optional<String> getGenre() {
            return ofNullable(genre);
        }

        public Optional<String> getComposer() {
            return ofNullable(composer);
        }

        public Optional<String> getAlbum() {
            return ofNullable(album);
        }

        public Optional<String> getReleaseDate() {
            return ofNullable(releaseDate);
        }

        public Optional<String> getArtist() {
            return ofNullable(artist);
        }

        public Optional<String> getDuration() {
            return ofNullable(duration);
        }
    }


}
