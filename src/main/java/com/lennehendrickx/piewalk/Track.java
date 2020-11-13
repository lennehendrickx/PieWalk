package com.lennehendrickx.piewalk;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Track {

    private final String name;
    private final String path;

    @JsonCreator
    public Track(@JsonProperty("name") String name,
                 @JsonProperty("path") String path) {
        this.name = name;
        this.path = path;
    }

    public String getName() {
        return name;
    }

    public String getPath() {
        return path;
    }
}
