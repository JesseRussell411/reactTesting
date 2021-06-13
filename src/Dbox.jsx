import react from "react"

const Dbox = ({children, ...style}) => {
    return (
        <div style={{...style}}>
            {children}
        </div>
    );

}

export default Dbox;