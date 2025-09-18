import { useEffect, useState } from "react";
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { getCurrentUser } from "../services/authServices";

interface User {
    firstName?: string;
    lastName?: string;
    email?: string;
    profilePicture?: string;
    phoneNumber?: string;
}

const Profile = () => {
    const [user, setUser] = useState<User | null>(null);

    const getUserDetails = async () => {
        try {
            const res = await getCurrentUser();
            setUser(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getUserDetails();
    }, []);

    return (
        <div className="max-w-6xl mx-auto mt-20">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                    <Card className="shadow-sm">
                        <div className="text-center">
                            <Avatar
                                image={user?.profilePicture}
                                icon={!user?.profilePicture ? "pi pi-user" : undefined}
                                size="xlarge"
                                shape="circle"
                                className="bg-blue-500 text-white mb-4"
                            />
                            <h2 className="text-xl font-semibold text-gray-900">
                                {user?.firstName && user?.lastName
                                    ? `${user.firstName} ${user.lastName}`
                                    : 'User Name'
                                }
                            </h2>
                            <p className="text-gray-500 mb-4">{user?.email}</p>
                            <Button
                                label="Edit Profile"
                                icon="pi pi-pencil"
                                className="p-button-outlined"
                                size="small"
                            />
                        </div>
                    </Card>
                </div>

                {/* Details Card */}
                <div className="lg:col-span-2">
                    <Card title="Personal Information" className="shadow-sm">
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        First Name
                                    </label>
                                    <p className="text-gray-900">{user?.firstName}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Last Name
                                    </label>
                                    <p className="text-gray-900">{user?.lastName}</p>
                                </div>
                            </div>

                            <Divider />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address
                                    </label>
                                    <p className="text-gray-900">{user?.email}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number
                                    </label>
                                    <p className="text-gray-900">{user?.phoneNumber || 'Not provided'}</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Profile;
