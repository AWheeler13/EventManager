import React from 'react';
import Navbar from '../../components/Navbar';
import UniSettings from '../../components/Uni/UniSettings';

const UniSettingsPage = () =>
{
    return(
        <div id="inner-page-container">
            <div id="Navbar">
                <Navbar/>
            </div>
            <div id="admin-dashboard">
                <UniSettings/>
            </div>
        </div>
    );
};
export default UniSettingsPage;