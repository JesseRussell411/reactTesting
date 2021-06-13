import React from "react";
import Tr from "./Tr";

const Table = ({ children, tdProps={}, ...otherProps }) => {
    let items = children instanceof Array ? children : [...children];
    const headRows = [];
    const bodyRows = [];
    const footRows = [];

    let index = 0;
    for (const item of items) {
        if (typeof item === "object") {
            let item_children =
                item.props.children instanceof Array
                    ? item.props.children
                    : [item.props.children];

            switch (item.type) {
                case "thead":
                    headRows.push(...item_children);
                    break;
                case "tfoot":
                    footRows.push(...item_children);
                    break;
                case "tbody":
                    bodyRows.push(...item_children);
                    break;
                case Tr:
                    bodyRows.push(item);
                    break;
                case "tr":
                    bodyRows.push(item);
                    break;
                default:
                    bodyRows.push(<Tr key={index} tdProps={tdProps}>{item}</Tr>);
            }
        } else {
            bodyRows.push(item);
        }
        ++index;
    }

    return (
        <table {...otherProps}>
            {headRows.length > 0 ? <thead>{headRows}</thead> : undefined}
            {bodyRows.length > 0 ? <tbody>{bodyRows}</tbody> : undefined}
            {footRows.length > 0 ? <tfoot>{footRows}</tfoot> : undefined}
        </table>
    );
};

export default Table;
