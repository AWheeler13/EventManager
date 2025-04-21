import React from 'react';
import Navbar from '../../components/Navbar';
import StdEvents from '../../components/Std/StdEvents';

const StdEventsPage = () =>
{
    return(
        <div id="inner-page-container">
            <div id="Navbar">
                <Navbar/>
            </div>
            <div>
                <StdEvents/>
            </div>
        </div>
    );
};
export default StdEventsPage;
