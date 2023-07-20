import React, { useState, useEffect } from 'react'
import './opening.css'
const Opening = () => {



    const [opacity, setOpacity] = useState(1);

    const handleScroll = () => {
        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const opacityValue = 1 - scrollY / maxScroll; // Calculate opacity based on scroll position
        setOpacity(opacityValue >= 0 ? opacityValue : 0); // Ensure opacity is between 0 and 1
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            <div className="opening_container" style={{ opacity }}>
                <h1>SCROLL</h1>
                <h1> TO </h1>
                <h1>READ THE LETTER</h1>
            </div>
        </>
    )
}

export default Opening