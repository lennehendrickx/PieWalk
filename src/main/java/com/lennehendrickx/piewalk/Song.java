package com.lennehendrickx.piewalk;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.Optional;

import static java.util.Optional.ofNullable;

public class Song {

    private final String name;
    private final String src;
    private final List<Track> tracks;
    private final Metadata metadata;

    @JsonCreator
    public Song(@JsonProperty("name") String name,
                @JsonProperty("src") String src,
                @JsonProperty("tracks") List<Track> tracks,
                @JsonProperty("metadata") Metadata metadata) {
        this.name = name;
        this.src = src;
        this.tracks = tracks;
        this.metadata = metadata;
    }

    public String getName() {
        return name;
    }

    public String getSrc() {
        return src;
    }

    public List<Track> getTracks() {
        return tracks;
    }

    public Optional<Metadata> getMetadata() {
        return ofNullable(metadata);
    }
}
