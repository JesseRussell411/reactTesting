import { jsx as _jsx } from "react/jsx-runtime";
const Tflex = ({ children }) => {
    const items = children instanceof Array ? children : [children];
    const rows = [];
    const data = [];
    for (item of items) {
        switch (item.type) {
            case "tr":
                rows.push;
        }
    }
    return (_jsx("table", { children: _jsx("tbody", { children: _jsx("tr", { children: children }, void 0) }, void 0) }, void 0));
};
