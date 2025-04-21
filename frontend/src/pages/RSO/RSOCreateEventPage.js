import React from 'react';
import Navbar from '../../components/Navbar';
import RSOCreateEvent from '../../components/RSO/RSOCreateEvent';

const RSOCreateEventPage = () =>
{
    return(
        <div id="inner-page-container">
            <div id="Navbar">
                <Navbar/>
            </div>
            <div>
                <RSOCreateEvent/>
            </div>
        </div>
    );
};
export default RSOCreateEventPage;