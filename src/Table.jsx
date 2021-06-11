import React from "react";

const Table = ({children, ...otherProps}) => {
    let rows = children instanceof Array ? children : [children];
    return(
        <table {...otherProps}>
            <tbody>
                {rows}
            </tbody>
        </table>
    );
}

export default Table;