// import React from "react";

function transpose(matrix){
    if (matrix.length === 0) return [];

    const result = [];
    for(let i = 0; i < matrix[0].length; ++i){
        let row = [];
        for(let j = 0; j < matrix.length; ++ j){
            if (matrix[j] !== undefined && matrix[j][i] !== undefined){
                row.push(matrix[j][i]);
            }
        }
        result.push(row);
    }

    return result;
}

function chunkBySize(items, chunkSize){
    chunkSize = Math.min(items.length, chunkSize);
    const chunks = [];
    let chunk = [];
    for(let i = 0; i < items.length; ++i){
        chunk.push(items[i]);
        if (chunk.length === chunkSize || i + 1 === items.length){
            chunks.push(chunk);
            chunk = [];
        }
    }

    return chunks;
}

function chunkByCount(items, chunkCount){
    chunkCount = Math.min(items.length, chunkCount);

    const chunkSize = Math.trunc(items.length / chunkCount);
    let remainder = items.length % chunkCount;
    const chunks = [];
    let chunk = [];
    for(let i = 0; i < items.length; ++i){
        chunk.push(items[i]);
        if (chunk.length === chunkSize || i - 1 === items.length){
            if(remainder > 0){
                chunk.push(items[++i]);
                --remainder;
            }
            
            chunks.push(chunk);
            chunk = [];
        }
    }

    return chunks;
}

const Tgrid = ({columns, rows, columnWise = false, children}) => {
    const items = children instanceof Array ? children : [children];
    function makeRow(items){
        return (
        <tr>
            {items.map(i => <td>{i}</td>)}
        </tr>
        );
    }
    function makeRows(matrix){
        return matrix.map((r, i) => makeRow(r, i));
    }
return(
    <table>
        <tbody>
            {(() => {
            if (columnWise){
                if(rows !== undefined){
                    return makeRows(transpose(chunkBySize(items, rows)));
                }
                else if(columns !== undefined){
                    return makeRows(transpose(chunkByCount(items, columns)));
                }
            }
            else{
                if(columns !== undefined){
                    return makeRows(chunkBySize(items,columns));
                }
                else if (rows !== undefined){
                    return makeRows(chunkByCount(items,rows));
                }
            }
        })()}
        </tbody>
    </table>
);
}
export default Tgrid;





// import React from "react";

// const Tgrid = ({columns=1, rows=undefined, columnWise, children}) => {
//     if (!(children instanceof Array)) {return"";}

//     if (rows !== undefined){
//         columns = Math.ceil(children.length / rows)
//     }
    

//     function createRow(items, key){
//         return <tr>
//             {items.map(i => <td>{i}</td>)}
//         </tr>
//     }
//     function createRows_rowwise(children){
//         let rows = [];
//         let items = [];
//         let i = 0;
//         for(const child of children){
//             items.push(child);
//             i++;
//             if (i % columns === 0 || i === children.length){
                
//                 rows.push(createRow(items, rows.length));
//                 items = [];
//             };
//         }
//         return rows;
//     }
//     function createRows_columnwise(children){
//         const rowCount = Math.ceil(children.length / Math.min(columns, children.length));
//         const fullRowCount = Math.trunc(children.length / Math.min(columns, children.length));
//         console.log("fullrowcound: " + fullRowCount);
        
//         let columnList = [];
//         let overFlow = Math.trunc(children.length % Math.min(columns, children.length));
//         let items = [];
//         let x = 0;
//         let total = 0;
//         for(let index = 0; index < children.length; ++index){
//             items.push(children[index]);
//             ++x;
//             if (x >= fullRowCount || index+1 === children.length){
//                 x = 0;
//                 if (overFlow > 0){
//                     items.push(children[++index]);
//                     --overFlow;
//                 }
//                 columnList.push(items);
//                 items = [];
//             }
//         }
//         console.log("cl" + columnList.length);
//         console.log(columnList);

//         let rowList = [];
//         items = [];
//         for(let i = 0; i < rowCount; ++i){
//             for(let j = 0; j < columns; ++j){
//                 if(columnList[j] !== undefined && columnList[j][i] !== undefined){
//                     items.push(columnList[j][i]);
//                 }
//                 else{
//                     break;
//                 }
//             }
//             rowList.push(createRow(items, rowList.length));
//             items = [];
//         }
//         return rowList;



//         // let rowCount = Math.truncate(children.length / columns);
//         // let overFlow = Math.truncate(children.length % columns);
//         // console.log(rowCount);
//         // let rows = [];
//         // let items = [];
//         // for(let i = 0; i < rowCount; ++i){
//         //     for(let j = i; j < children.length; j += rowCount){
//         //         items.push(children[j]);
//         //     }
//         //     if (overFlow > 0){
//         //         items.push()
//         //     }
//         //     rows.push(createRow(items, rows.length));
//         //     items = [];
//         // }
//         // return rows;
//     }
    

//     return(
//     <table>
//         <tbody>
//         {columnWise ? createRows_columnwise(children) : createRows_rowwise(children)}
//         </tbody>
//     </table>
//     );
// }

// export default Tgrid;