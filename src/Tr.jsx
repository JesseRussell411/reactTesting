import React from "react";

/**
 * Acts just like <tr> but will wrap elements in <td> for you.
 * @param {*} param0
 * @returns
 */
const Tr = ({
    children,
    detectTd = true,
    tdProps = {},
    injectTdProps,
    ...otherProps
}) => {
    const items = children instanceof Array ? children : [children];
    return (
        <tr {...otherProps}>
            {items.map((i, index) => {
                if (
                    detectTd &&
                    typeof i === "object" &&
                    ["td", "th"].includes(i.type)
                ) {
                    if (injectTdProps) {
                        let td = { ...i };
                        td.props = { ...td.props, ...tdProps };
                        return td;
                    } else {
                        return i;
                    }
                } else {
                    return (
                        <td key={index} {...tdProps}>
                            {i}
                        </td>
                    );
                }
            })}
        </tr>
    );
};

export default Tr;
