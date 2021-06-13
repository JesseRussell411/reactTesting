import React from "react";

const Sflex = ({ children, spanProps, ...otherProps }) => {
    const items = children instanceof Array ? children : [children];
    return (
        <div {...otherProps}>
            {items.map((i, index) =>
                typeof i === "object" && i.type === "span" ? (
                    i
                ) : (
                    <span key={index} {...spanProps}>
                        {i}
                    </span>
                )
            )}
        </div>
    );
};

export default Sflex;
