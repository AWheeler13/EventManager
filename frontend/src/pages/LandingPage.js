import React from 'react';
import '../styles/index.css';

function LandingPage()
{
    const handleLoginClick = () => {
        window.location.href = "/Login";
    }
    const handleSignUpClick = () => {
        window.location.href = "/SignUp";
    }

    return (
        <div id="LandingPageDiv">
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
            <link href="https://fonts.googleapis.com/css2?family=Gabarito:wght@400;700&display=swap" rel="stylesheet"></link>

            <header id="landing-header">
                <h1 id="main-title">Get Engaged with Your University</h1>
                <h2 id="sub-title">University Event Manager</h2>
            </header>
            <div id="landing-button-container">
            <button id="landing-login-button" onClick={handleLoginClick}>Login</button>
            <button id="landing-signup-button" onClick={handleSignUpClick}>Sign Up</button>   
            </div>
        </div>
    );
}

export default LandingPage;