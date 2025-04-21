import React from 'react';
import Navbar from '../../components/Navbar';
import StdDashboard from '../../components/Std/StdDashboard';

const StdDashboardPage = () =>
{
    return(
        <div id="inner-page-container">
            <div id="Navbar">
                <Navbar/>
            </div>
            <div id="admin-dashboard">
                <StdDashboard/>
            </div>
        </div>
    );
};
export default StdDashboardPage;
