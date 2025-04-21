import React from 'react';
import Navbar from '../../components/Navbar';
import RSOSettings from '../../components/RSO/RSOSettings';

const RSOSettingsPage = () =>
{
    return(
        <div id="inner-page-container">
            <div id="Navbar">
                <Navbar/>
            </div>
            <div id="admin-dashboard">
                <RSOSettings/>
            </div>
        </div>
    );
};
export default RSOSettingsPage;