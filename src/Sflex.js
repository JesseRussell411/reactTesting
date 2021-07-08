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
const Sflex = (_a) => {
    var { children, spanProps } = _a, otherProps = __rest(_a, ["children", "spanProps"]);
    const items = children instanceof Array ? children : [children];
    return (_jsx("div", Object.assign({}, otherProps, { children: items.map((i, index) => typeof i === "object" && i.type === "span" ? (i) : (_jsx("span", Object.assign({}, spanProps, { children: i }), index))) }), void 0));
};
export default Sflex;
