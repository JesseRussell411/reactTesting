import React from "react";

const Tdiv = ({ children, ...tableProps }) => {
    return (
        <table {...tableProps}>
                <tr>
                    <td>{children}</td>
                </tr>
        </table>
    );
};

export default Tdiv;
