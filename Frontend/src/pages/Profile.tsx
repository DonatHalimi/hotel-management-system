import { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { getCurrentUser } from "../services/authServices";
import { updateCurrentUser } from "../services/userServices";
import EditUserDialog from "./dashboard/dialogs/EditUserDialog";
import { useToast } from "../contexts/ToastContext";

const Profile = () => {
    const [user, setUser] = useState<any>(null);
    const [editOpen, setEditOpen] = useState(false);
    const { toast } = useToast();

    const fetchUser = async () => {
        try {
            const res = await getCurrentUser();
            setUser(res.data);
        } catch {
            toast({ severity: "error", summary: "Error", detail: "Failed to load user", });
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleUpdate = async (values: any) => {
        try {
            await updateCurrentUser(values);
            toast({ severity: "success", summary: "Success", detail: "Profile updated", });

            setEditOpen(false);
            fetchUser();
        } catch (err: any) {
            const msg =
                err?.response?.data?.Error ||
                err?.response?.data?.message ||
                "Update failed";

            toast({ severity: "error", summary: "Error", detail: String(msg), });
        }
    };

    return (
        <div className="max-w-5xl mx-auto mt-20 px-4">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900">Your Profile</h1>
                    <p className="text-gray-500 mt-1">
                        Manage your personal information and account settings.
                    </p>
                </div>

                <Button
                    label="Edit Profile"
                    icon="pi pi-user-edit"
                    onClick={() => setEditOpen(true)}
                    className="p-button-primary"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="shadow-md rounded-xl p-6 relative overflow-hidden">
                    <div className="text-center relative z-10">
                        <Avatar
                            image={user?.profilePicture || undefined}
                            icon={!user?.profilePicture ? "pi pi-user" : undefined}
                            size="xlarge"
                            shape="circle"
                        />

                        <h2 className="text-2xl font-semibold">
                            {`${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
                                "User"}
                        </h2>
                        <p className="text-gray-500">{user?.email}</p>
                    </div>
                </Card>

                <Card
                    title="Personal Information"
                    className="shadow-md rounded-xl p-1 lg:col-span-2"
                >
                    <div className="grid grid-cols-2 gap-6 py-2">
                        <div>
                            <label className="font-medium text-gray-700 text-sm">
                                First Name
                            </label>
                            <p className="text-lg font-semibold text-gray-900">
                                {user?.firstName}
                            </p>
                        </div>

                        <div>
                            <label className="font-medium text-gray-700 text-sm">
                                Last Name
                            </label>
                            <p className="text-lg font-semibold text-gray-900">
                                {user?.lastName}
                            </p>
                        </div>

                        <div>
                            <label className="font-medium text-gray-700 text-sm">
                                Email
                            </label>
                            <p className="text-lg font-semibold text-gray-900">
                                {user?.email}
                            </p>
                        </div>

                        <div>
                            <label className="font-medium text-gray-700 text-sm">
                                Phone
                            </label>
                            <p className="text-lg font-semibold text-gray-900">
                                {user?.phoneNumber || "Not provided"}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            <EditUserDialog
                visible={editOpen}
                onHide={() => setEditOpen(false)}
                user={user}
                onSubmit={handleUpdate}
            />
        </div>
    );
};

export default Profile;