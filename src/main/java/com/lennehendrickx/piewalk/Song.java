package com.lennehendrickx.piewalk;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class Song {

    private final String name;
    private final String path;
    private final List<Track> tracks;

    @JsonCreator
    public Song(@JsonProperty("name") String name,
                @JsonProperty("path") String path,
                @JsonProperty("tracks") List<Track> tracks) {
        this.name = name;
        this.path = path;
        this.tracks = tracks;
    }

    public String getName() {
        return name;
    }

    public String getPath() {
        return path;
    }

    public List<Track> getTracks() {
        return tracks;
    }
}
