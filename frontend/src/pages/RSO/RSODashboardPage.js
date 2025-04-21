import React from 'react';
import Navbar from '../../components/Navbar';
import RSODashboard from '../../components/RSO/RSODashboard';

const RSODashboardPage = () =>
{
    return(
        <div id="inner-page-container">
            <div id="Navbar">
                <Navbar/>
            </div>
            <div id="admin-dashboard">
                <RSODashboard/>
            </div>
        </div>
    );
};
export default RSODashboardPage;
