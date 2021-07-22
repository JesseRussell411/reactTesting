import { Slider } from "@material-ui/core";
import React from "react";

const BoundedSlider = ({
    lowerBound = 0,
    upperBound = 100,
    value,
    onChange,
    ...sliderProps
}) => {
    function ToPercent(scale) {
        return ((value - lowerBound) * 100) / (upperBound - lowerBound);
    }

    function ToScale(percent) {
        return (percent * (upperBound - lowerBound)) / 100 + lowerBound;
    }

    return (
        <Slider
            value={ToPercent(value)}
            onChange={(event, newValue) => onChange(event, ToScale(newValue))}
            {...sliderProps}
        />
    );
};

export default BoundedSlider;
