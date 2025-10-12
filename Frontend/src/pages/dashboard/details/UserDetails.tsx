import React from "react";
import { InputText } from "primereact/inputtext";
import { Image } from "primereact/image";
import DetailsSidebar from "../../../components/layout/DetailsSidebar";

type UserDetailsProps = {
    visible: boolean;
    onHide: () => void;
    user: any | null;
    onEdit: (user: any) => void;
    onDelete: (user: any) => Promise<void>;
};

const UserDetails: React.FC<UserDetailsProps> = ({
    visible,
    onHide,
    user,
    onEdit,
    onDelete
}) => {
    return (
        <DetailsSidebar
            visible={visible}
            onHide={onHide}
            title="User Details"
            onEdit={() => onEdit(user)}
            onDelete={() => onDelete(user)}
        >
                <div>
                    <label className="block text-sm font-medium mb-1">User ID</label>
                    <InputText
                        value={user?.userID || "—"}
                        readOnly
                        className="w-full"
                    />
                </div>

                {user?.profilePicture && (
                    <div className="flex justify-center mb-4">
                        <Image
                            src={user.profilePicture}
                            alt={user.fullName || "User Profile"}
                            imageClassName="rounded-full border shadow-md"
                            width="120"
                            height="120"
                            preview
                        />
                    </div>
                )}

                <div className="flex flex-row items-center space-x-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">First Name</label>
                        <InputText
                            value={user?.firstName || "—"}
                            readOnly
                            className="w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Last Name</label>
                        <InputText
                            value={user?.lastName || "—"}
                            readOnly
                            className="w-full"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <InputText
                        value={user?.email || "—"}
                        readOnly
                        className="w-full"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Role</label>
                    <InputText
                        value={user?.role || "—"}
                        readOnly
                        className="w-full"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                    <InputText
                        value={user?.phoneNumber || "—"}
                        readOnly
                        className="w-full"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        Created At
                    </label>
                    <InputText
                        value={user?.createdAt
                            ? new Date(user.createdAt).toLocaleString()
                            : "—"}
                        readOnly
                        className="w-full"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        Updated At
                    </label>
                    <InputText
                        value={user?.updatedAt
                            ? new Date(user.updatedAt).toLocaleString()
                            : "—"}
                        readOnly
                        className="w-full"
                    />
                </div>
        </DetailsSidebar>
    );
};

export default UserDetails;