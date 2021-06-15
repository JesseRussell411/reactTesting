import React from "react";

const Tflex=({children}) => {
    const items = children instanceof Array ? children : [children];
    const rows = [];
    const data = [];
    for(item of items){
        switch(item.type){
            case "tr":
                rows.push
        }
    }

    return(
        <table>
            <tbody>
                <tr>
                    {children}
                </tr>
            </tbody>
        </table>
    );
}