package com.lennehendrickx.piewalk;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Optional;

import static java.util.Optional.ofNullable;

class Metadata {
    private final String title;
    private final String genre;
    private final String composer;
    private final String album;
    private final String releaseDate;
    private final String artist;
    private final String duration;

    @JsonCreator
    public Metadata(@JsonProperty("title") String title,
                    @JsonProperty("genre") String genre,
                    @JsonProperty("composer") String composer,
                    @JsonProperty("album") String album,
                    @JsonProperty("releaseDate") String releaseDate,
                    @JsonProperty("artist") String artist,
                    @JsonProperty("duration") String duration) {
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
