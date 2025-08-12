import React, { useState, useEffect } from 'react';
import "./css/animatedBanner.css"

const AnimatedBanner = () => {
    const messages = [
        "FREE RETURNS AND FREE EXCHANGE.",
        "⚡1-DAY EXPRESS DELIVERY NOW AVAILABLE IN BANGALORE!",
        "SOLVE YOUR QUERIES FASTER THAN EVER! SEND US A 'HI' ON WHATSAPP AT 6364929121",
        "EXTRA 5% OFF AND FREE SHIPPING ON ALL ONLINE PAYMENTS*",
        "FIT PARTNERS  |  FIT PARTNERS  |  FIT PARTNERS  |  FIT PARTNERS"
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            // Fade out
            setIsVisible(false);         
            setTimeout(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
                setIsVisible(true);
            }, 300);

        }, 3000);

        return () => clearInterval(interval);
    }, [messages.length]);

    return (
        <div className="banner-container">
                <div className={`some-details ${isVisible ? 'fade-in' : 'fade-out'}`}>
                <span className="sliding-text">
                    {messages[currentIndex]}
                </span>
            </div>
        </div>
    );
};

export default AnimatedBanner;