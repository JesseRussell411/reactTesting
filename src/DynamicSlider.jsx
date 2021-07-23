import { Button, TextField } from "@material-ui/core";
import React, { useState } from "react";
import BoundedSlider from "./BoundedSlider";

const DynamicSlider = ({
    defaultLowerBound = 0,
    defaultUpperBound = 100,
    hardLowerBound,
    hardUpperBound,
    defaultValue = 50,
    onChange = () => {},
    ...boundedSliderProps
}) => {
    // state:
    const [lowerBound, setLowerBound] = useState(
        filterLowerBound(defaultLowerBound)
    );
    const [upperBound, setUpperBound] = useState(
        filterUpperBound(defaultUpperBound)
    );
    const [value, setValue] = useState(() => filterNewValue(defaultValue));
    const [textFieldValue, setTextFieldValue] = useState(value);
    function resetToDefault() {
        const newValue = filterNewValue(defaultValue);
        setLowerBound(filterLowerBound(defaultLowerBound));
        setUpperBound(filterUpperBound(defaultUpperBound));
        setTextFieldValue(newValue);
        setValue(newValue);
        onChange(newValue);
    }
    // END state

    function filterLowerBound(value) {
        return hardLowerBound != undefined
            ? Math.max(value, hardLowerBound)
            : value;
    }
    function filterUpperBound(value) {
        return hardUpperBound != undefined
            ? Math.min(value, hardUpperBound)
            : value;
    }

    function filterNewValue(newValue) {
        if (hardLowerBound != undefined && newValue < hardLowerBound) {
            newValue = hardLowerBound;
        }
        if (hardUpperBound != undefined && newValue > hardUpperBound) {
            newValue = hardUpperBound;
        }

        if (newValue < lowerBound) {
            setLowerBound(newValue);
        }
        if (newValue > upperBound) {
            setUpperBound(newValue);
        }

        return newValue;
    }

    function handleValueChange(newValue) {
        if (isNaN(newValue)) {
            newValue = value;
        } else {
            newValue = filterNewValue(newValue);
        }

        setValue(newValue);
        setTextFieldValue(newValue);
        onChange(newValue);
    }

    function handleTextFieldChange(event) {
        setTextFieldValue(event.target.value);
    }
    function handleTextFieldBlur(event) {
        handleValueChange(Number(textFieldValue));
    }
    function handleTextFieldSubmit(event) {
        handleValueChange(Number(textFieldValue));
    }

    function handleSliderChange(newValue) {
        handleValueChange(newValue);
    }

    return (
        <>
            <Button onClick={resetToDefault}>Default</Button>
            {lowerBound}
            <BoundedSlider
                lowerBound={lowerBound}
                upperBound={upperBound}
                value={value}
                onChange={handleSliderChange}
                {...boundedSliderProps}
            />
            {upperBound}
            <TextField
                variant={"outlined"}
                value={textFieldValue}
                onChange={handleTextFieldChange}
                onBlur={handleTextFieldBlur}
                onKeyPress={(event) => {
                    if (event.key === "Enter") {
                        handleTextFieldSubmit(event);
                    }
                }}
            ></TextField>
        </>
    );
};

export default DynamicSlider;
