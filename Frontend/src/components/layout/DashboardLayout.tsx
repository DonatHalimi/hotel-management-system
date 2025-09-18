import React from 'react';
import { Outlet } from 'react-router-dom';
import AppSidebar from './Sidebar';
// import Navbar from '../navbar/Navbar';

const DashboardLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 content-with-fixed-navbar">
            <AppSidebar />

            <div className="lg:ml-64">
                {/* <Navbar /> */}

                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
