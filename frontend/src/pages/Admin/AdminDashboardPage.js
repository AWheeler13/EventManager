import React from 'react';
import Navbar from '../../components/Navbar';
import AdminDashboard from '../../components/Admin/AdminDashboard';

const AdminDashboardPage = () =>
{
    return(
        <div id="inner-page-container">
            <div id="Navbar">
                <Navbar/>
            </div>
            <div id="admin-dashboard">
                <AdminDashboard/>
            </div>
        </div>
    );
};
export default AdminDashboardPage;
