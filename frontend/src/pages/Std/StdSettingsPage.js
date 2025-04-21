import React from 'react';
import Navbar from '../../components/Navbar';
import StdSettings from '../../components/Std/StdSettings';

const StdSettingsPage = () =>
{
    return(
        <div id="inner-page-container">
            <div id="Navbar">
                <Navbar/>
            </div>
            <div id="admin-dashboard">
                <StdSettings/>
            </div>
        </div>
    );
};
export default StdSettingsPage;