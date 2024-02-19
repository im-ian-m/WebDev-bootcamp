import { useEffect, useLayoutEffect, useRef, useState } from 'react';

function Poster({url, altText, className}) {
    const ref = useRef();
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    useLayoutEffect(() => {
        console.log(ref.current)
        console.log(ref.current.offsetWidth)
        updateHeight()
        console.log('height:', height)
        // console.log("updated height")
        window.addEventListener("resize", updateHeight)
    }, []);

    const updateHeight = () => {
        if (ref.current) {
            console.log('width', ref.current.offsetWidth)
            console.log('height', ref.current.offsetWidth * 750 / 500)
            setWidth(ref.current.offsetWidth);
            setHeight(ref.current.offsetWidth * 750 / 500 + "px");
        }
        // console.log('height:', height)
        // console.log('width:', width)
    }

    
    return(
        <img src={url} alt={altText} className={`${className} poster`} ref={ref} style={{height: height,}} onLoad={updateHeight}/> 
    )
}

export default Poster