package com.lennehendrickx.piewalk;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class Song {

    private final String name;
    private final String src;
    private final List<Track> tracks;

    @JsonCreator
    public Song(@JsonProperty("name") String name,
                @JsonProperty("src") String src,
                @JsonProperty("tracks") List<Track> tracks) {
        this.name = name;
        this.src = src;
        this.tracks = tracks;
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
}
