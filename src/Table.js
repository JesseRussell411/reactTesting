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
import Tr from "./Tr";
function getProps(comp) {
    return typeof comp === "object" && typeof comp.props === "object"
        ? comp.props
        : {};
}
function getChildren(comp) {
    const children = getProps(comp).children;
    if (children instanceof Array) {
        return children;
    }
    else if (children != null) {
        return [children];
    }
    else {
        return [];
    }
}
function getType(comp) {
    return typeof comp === "object" ? comp.type : undefined;
}
/**
 * Acts just like <table>, but will wrap elements in <tbody> for you, or even <tbody> and <tr> and <td>.
 * Example of valid use: <Table><img src="..." alt="..."/><img src="..." alt="..."/></Table> produces <table><tbody><tr><td><img src="..." alt="..."/><img src="..." alt="..."/></td></tr></tbody></table>
 */
const Table = (_a) => {
    var _b, _c, _d, _e;
    var { children, tdProps = {}, trProps = {}, tbodyProps } = _a, otherProps = __rest(_a, ["children", "tdProps", "trProps", "tbodyProps"]);
    function ensureRow(comp, key) {
        if (comp instanceof Array) {
            return comp.map((c, i) => ensureRow(c, i));
        }
        const type = getType(comp);
        const props = getProps(comp);
        return type !== Tr && type !== "tr" ? (_jsx(Tr, Object.assign({ tdProps: tdProps, tbodyprops: props.tbodyprops, theadprops: props.theadprops, tfootprops: props.tfootprops }, trProps, { children: comp }), key)) : (comp);
    }
    let items = children instanceof Array ? children : [children];
    const rowGroups = [];
    let index = 0;
    for (const item of items) {
        const item_children = getChildren(item);
        const item_type = getType(item);
        const item_props = getProps(item);
        switch (item_type) {
            case "thead":
                rowGroups.push({
                    type: "thead",
                    props: (_b = item_props.theadprops) !== null && _b !== void 0 ? _b : {},
                    children: ensureRow(item_children),
                });
                break;
            case "tfoot":
                console.log(item_children);
                rowGroups.push({
                    type: "tfoot",
                    props: (_c = item_props.tfootprops) !== null && _c !== void 0 ? _c : {},
                    children: ensureRow(item_children),
                });
                break;
            case "tbody":
                rowGroups.push({
                    type: "tbody",
                    props: (_d = item_props.tbodyprops) !== null && _d !== void 0 ? _d : {},
                    children: ensureRow(item_children),
                });
                break;
            default:
                const itemToPush = ensureRow(item, index);
                const lastRowGroup = rowGroups[rowGroups.length - 1];
                if (lastRowGroup != null &&
                    lastRowGroup.type === "open tbody") {
                    lastRowGroup.children.push(itemToPush);
                }
                else {
                    rowGroups.push({
                        type: "open tbody",
                        props: Object.assign(Object.assign({}, tbodyProps), (_e = getProps(itemToPush).tbodyProps) !== null && _e !== void 0 ? _e : {}),
                        children: [itemToPush],
                    });
                }
        }
        ++index;
    }
    return (_jsx("table", Object.assign({}, otherProps, { children: rowGroups.map((g, i) => {
            switch (g.type) {
                case "tbody":
                case "open tbody":
                    return _jsx("tbody", Object.assign({}, g.props, { children: g.children }), void 0);
                case "thead":
                    return _jsx("thead", Object.assign({}, g.props, { children: g.children }), void 0);
                case "tfoot":
                    return _jsx("tfoot", Object.assign({}, g.props, { children: g.children }), void 0);
            }
        }) }), void 0));
};
export default Table;
