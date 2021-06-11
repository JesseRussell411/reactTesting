import React from "react";

const Tdiv = ({ children, ...tableProps }) => {
    return (
        <table {...tableProps}>
            <tbody>
                <tr>
                    <td>{children}</td>
                </tr>
            </tbody>
        </table>
    );
};

export default Tdiv;
