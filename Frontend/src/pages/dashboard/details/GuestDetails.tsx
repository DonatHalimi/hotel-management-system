import React from "react";
import { InputText } from "primereact/inputtext";
import DetailsSidebar from "../../../components/layout/DetailsSidebar";

type GuestDetailsProps = {
    visible: boolean;
    onHide: () => void;
    guest: any | null;
    onEdit: (guest: any) => void;
    onDelete: (guest: any) => Promise<void>;
};

const GuestDetails: React.FC<GuestDetailsProps> = ({
    visible,
    onHide,
    guest,
    onEdit,
    onDelete
}) => {
    return (
        <DetailsSidebar
            visible={visible}
            onHide={onHide}
            title="Guest Details"
            onEdit={() => onEdit(guest)}
            onDelete={() => onDelete(guest)}
        >
            <div>
                <label className="block text-sm font-medium mb-1">Guest ID</label>
                <InputText
                    value={guest?.guestID || "—"}
                    readOnly
                    className="w-full"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">ID Number</label>
                <InputText
                    value={guest?.idNumber || "—"}
                    readOnly
                    className="w-full"
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium mb-1">First Name</label>
                    <InputText
                        value={guest?.firstName || "—"}
                        readOnly
                        className="w-full"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Last Name</label>
                    <InputText
                        value={guest?.lastName || "—"}
                        readOnly
                        className="w-full"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <InputText
                        value={guest?.email || "—"}
                        readOnly
                        className="w-full"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                    <InputText
                        value={guest?.phoneNumber || "—"}
                        readOnly
                        className="w-full"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium mb-1">Country</label>
                    <InputText
                        value={guest?.country || "—"}
                        readOnly
                        className="w-full"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <InputText
                        value={guest?.city || "—"}
                        readOnly
                        className="w-full"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Created At</label>
                <InputText
                    value={guest?.createdAt ? new Date(guest.createdAt).toLocaleString() : "—"}
                    readOnly
                    className="w-full"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Updated At</label>
                <InputText
                    value={guest?.updatedAt ? new Date(guest.updatedAt).toLocaleString() : "—"}
                    readOnly
                    className="w-full"
                />
            </div>
        </DetailsSidebar>
    );
};

export default GuestDetails;