import { Button, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { useState } from "react";
import BoundedSlider from "./BoundedSlider";

const useStyles = makeStyles(() => ({
    main: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        "& > :nth-last-child(n + 2)": {
            marginRight: "10px",
        },
    },
    boundary: {},
    upperBound: {},
    lowerBound: {},
    slider: {
        margin: "0px",
        flexGrow: 1,
    },
    valueField: {
        width: "5ch",
    },
}));

const DynamicSlider = ({
    defaultLowerBound = 0,
    defaultUpperBound = 100,
    hardLowerBound,
    hardUpperBound,
    defaultValue = 50,
    onChange = () => {},
    style,
    ...boundedSliderProps
}) => {
    const classes = useStyles();
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
        <div className={classes.main} style={style}>
            <div className={`${classes.boundary} ${classes.lowerBound}}`}>
                {lowerBound}
            </div>
            <BoundedSlider
                className={classes.slider}
                lowerBound={lowerBound}
                upperBound={upperBound}
                value={value}
                onChange={handleSliderChange}
                {...boundedSliderProps}
            />
            <div className={`${classes.boundary} ${classes.upperBound}}`}>
                {upperBound}
            </div>
            <TextField
                className={classes.valueField}
                value={textFieldValue}
                onChange={handleTextFieldChange}
                onBlur={handleTextFieldBlur}
                onKeyPress={(event) => {
                    if (event.key === "Enter") {
                        handleTextFieldSubmit(event);
                    }
                }}
            ></TextField>
            <Button className={classes.resetButton} onClick={resetToDefault} variant={"contained"}>
                Reset
            </Button>
        </div>
    );
};

export default DynamicSlider;
