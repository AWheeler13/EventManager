import React from 'react';
import Navbar from '../../components/Navbar';
import AdminSettings from '../../components/Admin/AdminSettings';

const AdminSettingsPage = () =>
{
    return(
        <div id="inner-page-container">
            <div id="Navbar">
                <Navbar/>
            </div>
            <div id="admin-dashboard">
                <AdminSettings/>
            </div>
        </div>
    );
};
export default AdminSettingsPage;