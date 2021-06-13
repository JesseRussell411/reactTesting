import React from "react";

const Tr = ({ children, detectTd = true, tdProps = {}, ...otherProps }) => {
    const items = children instanceof Array ? children : [children];
    return (
        <tr {...otherProps}>
            {items.map((i, index) =>
                detectTd &&
                typeof i === "object" &&
                ["td", "th"].includes(i.type) ? (
                    i
                ) : (
                    <td key={index} {...tdProps}>{i}</td>
                )
            )}
        </tr>
    );
};

export default Tr;