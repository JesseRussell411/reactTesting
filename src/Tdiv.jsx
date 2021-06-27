import React from "react";

const Tdiv = ({ children, tableProps, tbodyProps, trProps, ...tdProps }) => {
    return (
        <table {...tableProps}>
            <tbody {...tbodyProps}>
                <tr {...trProps}>
                    <td {...tdProps}>{children}</td>
                </tr>
            </tbody>
        </table>
    );
};

export default Tdiv;
