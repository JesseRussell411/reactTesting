import React from "react";

const Tdiv = ({children, ...tableProps}) => {
    return(
        <table >
            <tr>
                <td{...tableProps}>
                    {children}
                </td>
            </tr>
        </table>
    );
}

export default Tdiv;