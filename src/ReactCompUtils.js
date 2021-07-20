import React from "react";

const ReactCompUtils = {
    getProps: (comp) => {
        if (comp instanceof Object && comp.props instanceof Object) {
            return comp.props;
        } else {
            return undefined;
        }
    },

    getChildren: (comp) => {
        const props = this.getProps(comp);
        if (props.children instanceof Object) {
            return props.children;
        } else {
            return undefined;
        }
    },
};

export default ReactCompUtils;
