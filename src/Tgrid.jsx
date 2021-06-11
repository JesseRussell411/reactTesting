// import React from "react";

/**
 * returns the given matrix (2d array of rows) transposed without modifying the original matrix.
 * @param {any[][]} matrix 2s array of rows
 * @returns {any[][]}
 */
function transpose(matrix) {
    // there is a better way of doing this in-place.
    if (matrix.length === 0) return [];

    const result = [];
    for (let i = 0; i < matrix[0].length; ++i) {
        let row = [];
        for (let j = 0; j < matrix.length; ++j) {
            if (matrix[j] !== undefined && matrix[j][i] !== undefined) {
                row.push(matrix[j][i]);
            }
        }
        result.push(row);
    }

    return result;
}

/**
 * Chunks the given list of items by the given chunk size into a 2d array.
 * @param {any[]} items
 * @param {number} chunkSize
 * @returns any[][]
 */
function chunkBySize(items, chunkSize) {
    chunkSize = Math.min(items.length, chunkSize);
    const chunks = [];
    let chunk = [];
    for (let i = 0; i < items.length; ++i) {
        chunk.push(items[i]);
        if (chunk.length === chunkSize || i + 1 === items.length) {
            chunks.push(chunk);
            chunk = [];
        }
    }

    return chunks;
}

/**
 * Chunks the given list of items by the given chunk count into a 2d array.
 * @param {any[]} items
 * @param {number} chunkCount
 * @returns any[][]
 */
function chunkByCount(items, chunkCount) {
    chunkCount = Math.min(items.length, chunkCount);

    const chunkSize = Math.trunc(items.length / chunkCount);
    let remainder = items.length % chunkCount;
    const chunks = [];
    let chunk = [];
    for (let i = 0; i < items.length; ++i) {
        chunk.push(items[i]);
        if (chunk.length === chunkSize || i + 1 === items.length) {
            if (remainder > 0) {
                chunk.push(items[++i]);
                --remainder;
            }

            chunks.push(chunk);
            chunk = [];
        }
    }

    return chunks;
}

/**
 * Table based grid for easier table layouts.
 * @param {number} params.columns Number of columns. Cannot be combined with rows.
 * @param {number} params.rows Number of rows. Cannot be combined with columns.
 * @param {number} params.columnWise Layout items top to bottom instead of left to right.
 * @param {number} params.tableProps The rest of the props, which go to the table that is generated.
 * @returns
 */
const Tgrid = ({
    columns,
    rows,
    columnWise = false,
    children,
    ...tableProps
}) => {
    // make sure items is an array.
    const items = children instanceof Array ? children : [children];

    // make sure there are valid columns or rows
    if (rows !== undefined) {
        rows = Math.trunc(rows);
    } else if (columns !== undefined) {
        columns = Math.trunc(columns);
    } else {
        columns = 1;
    }

    // returns a <tr> full of <td>s containing the given array of items.
    function makeRow(items) {
        return (
            <tr>
                {items.map((i) => (
                    <td>{i}</td>
                ))}
            </tr>
        );
    }

    // returns the given matrix (2d array of rows) as a list of <tr>s
    function makeRows(matrix) {
        return matrix.map((r, i) => makeRow(r, i));
    }

    return (
        <table {...tableProps}>
            <tbody>
                {(() => {
                    if (columnWise) {
                        if (rows !== undefined) {
                            return makeRows(
                                transpose(chunkBySize(items, rows))
                            );
                        } else if (columns !== undefined) {
                            return makeRows(
                                transpose(chunkByCount(items, columns))
                            );
                        }
                    } else {
                        if (columns !== undefined) {
                            return makeRows(chunkBySize(items, columns));
                        } else if (rows !== undefined) {
                            return makeRows(chunkByCount(items, rows));
                        }
                    }
                })()}
            </tbody>
        </table>
    );
};
export default Tgrid;

// VVVVV initial prototype VVVVV very good👌

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
