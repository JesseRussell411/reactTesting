import {Dialog} from "@material-ui/core";
import {useRef, useState} from "react";



export default function NestedDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const wasOpen = isOpen;

    function Content() {
        const [on, setOn] = useState(false);

        return <div>
            {`${wasOpen}`}
            {`${isOpen}`}
            <button onClick={() => setOn(!on)}>
                turn {on ? "off" : "on"}
            </button>
        </div>
    };

    return <div>
        <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? "Close" : "Open"} Nested Dialog
        </button>
        <Dialog open={isOpen} onBackdropClick={() => setIsOpen(false)}>
            <Content/>
        </Dialog>
    </div>
}
