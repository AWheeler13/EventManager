import React from 'react';
import Navbar from '../../components/Navbar';
import UniEvents from '../../components/Uni/UniEvents';

const UniEventsPage = () =>
{
    return(
        <div id="inner-page-container">
            <div id="Navbar">
                <Navbar/>
            </div>
            <div>
                <UniEvents/>
            </div>
        </div>
    );
};
export default UniEventsPage;
