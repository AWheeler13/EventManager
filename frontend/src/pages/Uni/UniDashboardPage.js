import React from 'react';
import Navbar from '../../components/Navbar';
import UniDashboard from '../../components/Uni/UniDashboard';

const UniDashboardPage = () =>
{
    return(
        <div id="inner-page-container">
            <div id="Navbar">
                <Navbar/>
            </div>
            <div id="admin-dashboard">
                <UniDashboard/>
            </div>
        </div>
    );
};
export default UniDashboardPage;
