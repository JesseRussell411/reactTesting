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
const Tdiv = (_a) => {
    var { children, tableProps, tbodyProps, trProps } = _a, tdProps = __rest(_a, ["children", "tableProps", "tbodyProps", "trProps"]);
    return (_jsx("table", Object.assign({}, tableProps, { children: _jsx("tbody", Object.assign({}, tbodyProps, { children: _jsx("tr", Object.assign({}, trProps, { children: _jsx("td", Object.assign({}, tdProps, { children: children }), void 0) }), void 0) }), void 0) }), void 0));
};
export default Tdiv;
