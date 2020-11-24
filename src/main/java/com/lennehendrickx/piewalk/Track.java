package com.lennehendrickx.piewalk;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Track {

    private final String name;
    private final String src;

    @JsonCreator
    public Track(@JsonProperty("name") String name,
                 @JsonProperty("src") String src) {
        this.name = name;
        this.src = src;
    }

    public String getName() {
        return name;
    }

    public String getSrc() {
        return src;
    }

}
