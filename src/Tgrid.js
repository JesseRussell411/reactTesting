var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Guarantied to return an integer that is 1 or greater. Returns 1 on invalid input.
 * @param number
 * @returns {number} 1 <= (n is integer) < infinity
 */
function sanitizeToPositiveInteger(number) {
    if (typeof number === "number") {
        return Math.max(1, Math.abs(Math.trunc(number)));
    }
    else {
        return 1;
    }
}
/**
 * returns the given matrix (2d array of rows) transposed without modifying the original matrix.
 * @param {any[][]} matrix 2d array of rows
 * @returns {any[][]}
 */
function transpose(matrix) {
    // empty matrix is really easy
    if (matrix.length === 0)
        return [];
    // there is a better way of doing this in-place. But this will do.
    const result = [];
    // main loop
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
 * @returns {any[][]}
 */
function chunkBySize(items, chunkSize) {
    // make sure we don't try to make a chunk that's bigger than the whole list.
    chunkSize = Math.min(items.length, sanitizeToPositiveInteger(chunkSize));
    const chunks = [];
    let chunk = [];
    // main loop
    for (let i = 0; i < items.length; ++i) {
        // add the item to the new chunk
        chunk.push(items[i]);
        // if the chunk is big enough...
        if (chunk.length === chunkSize || i + 1 === items.length) {
            chunks.push(chunk);
            chunk = [];
        }
    }
    return chunks;
}
/**
 * Chunks the given list of items by the given chunk count into a 2d array. Any remainder is spread out across the first chunks.
 * @param {any[]} items
 * @param {number} chunkCount
 * @returns {any[][]}
 */
function chunkByCount(items, chunkCount) {
    // make sure we don't try to make more chunks than the list has items.
    chunkCount = Math.min(items.length, sanitizeToPositiveInteger(chunkCount));
    // The way this function works is it gets how big each chunk needs to be in order to end up with "chunkCount" chunks from items.
    const chunkSize = Math.trunc(items.length / chunkCount);
    // And the remainder
    let remainder = Math.trunc(items.length % chunkCount);
    const chunks = [];
    let chunk = [];
    // main loop
    for (let i = 0; i < items.length; ++i) {
        // add the current item to the chunk
        chunk.push(items[i]);
        // if the chunk is big enough...
        if (chunk.length === chunkSize || i + 1 === items.length) {
            // spreading out the remainder
            if (remainder > 0 && i + 1 < items.length) {
                chunk.push(items[++i]);
                --remainder;
            }
            // adding the finished new chunk to the list of chunks
            chunks.push(chunk);
            // chunk.clear()
            chunk = [];
        }
    }
    return chunks;
}
/**
 * Table based grid for easier table layouts. Just specify how many columns or rows you want
 * and the component will render into a table with its children layed out with that many columns or rows.
 * If you want the components layed out vertically, set the columnWise flag to true.
 * @param {number} [params.columns = undefined] Number of columns. Cannot be combined with rows.
 * @param {number} [params.rows = undefined] Number of rows. Cannot be combined with columns.
 * @param {boolean} [params.columnWise = false] Layout items top to bottom instead of left to right.
 * @param {object} [params.trProps = {}] Props given to every <tr> in the generated table.
 * @param {object} [params.tdProps = {}] Props given to every <td> in the generated table except <td>s passed into the table with the detectTd flag true.
 * @param {boolean} [params.detectTd = true] if true, <td> and <th> children are not wrapped in <td>s.
 * @param params.tableProps The rest of the props, which go to the table that is generated.
 * @returns
 */
const Tgrid = (_a) => {
    var { columns, rows, columnWise = false, trProps = {}, tdProps = {}, detectTd = true, injectTdProps = false, children } = _a, tableProps = __rest(_a, ["columns", "rows", "columnWise", "trProps", "tdProps", "detectTd", "injectTdProps", "children"]);
    // make sure items is an array.
    const items = children instanceof Array ? children : [children];
    // make sure there are valid columns or rows
    if (rows !== undefined) {
        rows = sanitizeToPositiveInteger(rows);
    }
    else if (columns !== undefined) {
        columns = sanitizeToPositiveInteger(columns);
    }
    else {
        rows = 1;
    }
    // returns a <tr> full of <td>s containing the given array of items.
    function makeRow(items, key) {
        if (injectTdProps && detectTd) {
            items.map((item, i) => {
                if (typeof item === "object" && item.type === "td") {
                    let td = Object.assign({}, item);
                    td.props = Object.assign(Object.assign({}, item.props), tdProps);
                    Object.preventExtensions(td);
                    Object.preventExtensions(td.props);
                    items[i] = td;
                }
            });
        }
        return (_jsx("tr", Object.assign({}, trProps, { children: items.map((i, index) => detectTd &&
                ["td", "th"].includes(typeof i === "object" ? i.type : undefined) ? (i) : (_jsx("td", Object.assign({}, tdProps, { children: i }), index))) }), key));
    }
    // returns the given matrix (2d array of rows) as a list of <tr>s
    function makeRows(matrix) {
        return matrix.map((r, i) => makeRow(r, i));
    }
    return (_jsx("table", Object.assign({}, tableProps, { children: _jsx("tbody", { children: (() => {
                if (columnWise) {
                    if (rows !== undefined) {
                        return makeRows(transpose(chunkBySize(items, rows)));
                    }
                    else if (columns !== undefined) {
                        return makeRows(transpose(chunkByCount(items, columns)));
                    }
                }
                else {
                    if (columns !== undefined) {
                        return makeRows(chunkBySize(items, columns));
                    }
                    else if (rows !== undefined) {
                        return makeRows(chunkByCount(items, rows));
                    }
                }
            })() }, void 0) }), void 0));
};
export default Tgrid;
