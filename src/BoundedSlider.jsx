import { Slider } from "@material-ui/core";
import React from "react";

/**
 * Adds custom bounds to the Slider component instead of the usual 0-100.
 * @param {(number) => void} onChange Called when the value changes
*/
const BoundedSlider = ({
    lowerBound = 0,
    upperBound = 100,
    value,
    onChange,
    disabled = false,
    ...sliderProps
}) => {
    function ToPercent(scale) {
        return ((scale - lowerBound) * 100) / (upperBound - lowerBound);
    }

    function ToScale(percent) {
        return (percent * (upperBound - lowerBound)) / 100 + lowerBound;
    }
// do whatever you want!!!!!!!!!!!!!!!!
    return (
        <Slider
            disabled={disabled}
            value={ToPercent(value)}
            onChange={(event, newValue) => onChange(ToScale(newValue))}
            {...sliderProps}
        />
    );
};

export default BoundedSlider;
