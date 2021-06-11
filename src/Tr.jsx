import React from "react";

const Tr = ({ children, detectTd = true, ...otherProps }) => {
    const items = children instanceof Array ? children : [children];
    return (
        <tr {...otherProps}>
            {items.map((i) =>
                detectTd &&
                typeof i === "object" &&
                ["td", "th"].includes(i.type) ? (
                    i
                ) : (
                    <td>{i}</td>
                )
            )}
        </tr>
    );
};

export default Tr;