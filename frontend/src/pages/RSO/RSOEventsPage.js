import React from 'react';
import Navbar from '../../components/Navbar';
import RSOEvents from '../../components/RSO/RSOEvents';

const RSOEventsPage = () =>
{
    return(
        <div id="inner-page-container">
            <div id="Navbar">
                <Navbar/>
            </div>
            <div>
                <RSOEvents/>
            </div>
        </div>
    );
};
export default RSOEventsPage;
