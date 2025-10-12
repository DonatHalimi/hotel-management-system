import React from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import DetailsSidebar from "../../../components/layout/DetailsSidebar";

type RoleDetailsProps = {
    visible: boolean;
    onHide: () => void;
    role: any | null;
    onEdit: (role: any) => void;
    onDelete: (role: any) => Promise<void>;
};

const RoleDetails: React.FC<RoleDetailsProps> = ({
    visible,
    onHide,
    role,
    onEdit,
    onDelete,
}) => {
    return (
        <DetailsSidebar
            visible={visible}
            onHide={onHide}
            title="Role Details"
            onEdit={() => onEdit(role)}
            onDelete={() => onDelete(role)}
        >
            <div>
                <label className="block text-sm font-medium mb-1">Role ID</label>
                <InputText
                    value={role?.roleID || "—"}
                    readOnly
                    className="w-full"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <InputText
                    value={role?.name || "—"}
                    readOnly
                    className="w-full"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <InputTextarea
                    value={role?.description || "—"}
                    readOnly
                    rows={4}
                    className="w-full"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Created At</label>
                <InputText
                    value={role?.createdAt ? new Date(role.createdAt).toLocaleString() : "—"}
                    readOnly
                    className="w-full"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Updated At</label>
                <InputText
                    value={role?.updatedAt ? new Date(role.updatedAt).toLocaleString() : "—"}
                    readOnly
                    className="w-full"
                />
            </div>
        </DetailsSidebar>
    );
};

export default RoleDetails;
