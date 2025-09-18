import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'primereact/button';

const Unauthorized: React.FC = () => (
    <div className="flex items-center justify-center h-screen">
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-2">Access denied</h2>
            <p className="mb-4">You don’t have permission to view this page.</p>
            <Link to="/">
                <Button label="Back to home" className="p-button-outlined" />
            </Link>
        </div>
    </div>
);

export default Unauthorized;

