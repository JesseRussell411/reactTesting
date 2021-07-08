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
 * Acts just like <tr> but will wrap elements in <td> for you.
 * @param {*} param0
 * @returns
 */
const Tr = (_a) => {
    var { children, detectTd = true, tdProps = {}, injectTdProps } = _a, otherProps = __rest(_a, ["children", "detectTd", "tdProps", "injectTdProps"]);
    const items = children instanceof Array ? children : [children];
    return (_jsx("tr", Object.assign({}, otherProps, { children: items.map((i, index) => {
            if (detectTd &&
                typeof i === "object" &&
                ["td", "th"].includes(i.type)) {
                if (injectTdProps) {
                    let td = Object.assign({}, i);
                    td.props = Object.assign(Object.assign({}, td.props), tdProps);
                    return td;
                }
                else {
                    return i;
                }
            }
            else {
                return (_jsx("td", Object.assign({}, tdProps, { children: i }), index));
            }
        }) }), void 0));
};
export default Tr;
