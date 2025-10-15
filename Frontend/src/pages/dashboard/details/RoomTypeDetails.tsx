import React from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { ToggleButton } from "primereact/togglebutton";
import DetailsSidebar from "../../../components/layout/DetailsSidebar";

type RoomTypeDetailsProps = {
    visible: boolean;
    onHide: () => void;
    roomType: any | null;
    onEdit: (roomType: any) => void;
    onDelete: (roomType: any) => Promise<void>;
};

const BedTypeLabels: Record<number, string> = {
    0: "Single",
    1: "Double",
    2: "Queen",
    3: "King",
    4: "Twin",
    5: "Bunk",
};

const RoomTypeDetails: React.FC<RoomTypeDetailsProps> = ({
    visible,
    onHide,
    roomType,
    onEdit,
    onDelete,
}) => {
    return (
        <DetailsSidebar
            visible={visible}
            onHide={onHide}
            title="Room Type Details"
            onEdit={() => onEdit(roomType)}
            onDelete={() => onDelete(roomType)}
        >
            <div>
                <label className="block text-sm font-medium mb-1">Room Type ID</label>
                <InputText
                    value={roomType?.roomTypeID || "—"}
                    readOnly
                    className="w-full"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <InputText
                    value={roomType?.name || "—"}
                    readOnly
                    className="w-full"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <InputTextarea
                    value={roomType?.description || "—"}
                    readOnly
                    autoResize
                    rows={3}
                    className="w-full"
                />
            </div>

            <div className="flex flex-row items-center space-x-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Max Occupancy</label>
                    <InputText
                        value={roomType?.maxOccupancy ?? "—"}
                        readOnly
                        className="w-full"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Bed Count</label>
                    <InputText
                        value={roomType?.bedCount ?? "—"}
                        readOnly
                        className="w-full"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Bed Type</label>
                <InputText
                    value={typeof roomType?.bedType === "number" ? BedTypeLabels[roomType.bedType] ?? "—" : "—"}
                    readOnly
                    className="w-full"
                />
            </div>

            <div className="flex flex-row items-center space-x-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Base Price (€)</label>
                    <InputText
                        value={roomType?.basePrice != null ? `${roomType.basePrice.toFixed(2)}` : "—"}
                        readOnly
                        className="w-full"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Size (sqft)</label>
                    <InputText
                        value={roomType?.sizeSqft ?? "—"}
                        readOnly
                        className="w-full"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
                {[
                    ["Has Balcony", roomType?.hasBalcony],
                    ["Has Kitchen", roomType?.hasKitchen],
                    ["Air Conditioning", roomType?.hasAirConditioning],
                    ["Wi-Fi", roomType?.hasWifi],
                    ["Smoking Allowed", roomType?.isSmokingAllowed],
                ].map(([label, value]) => (
                    <div key={label}>
                        <label className="block text-sm font-medium mb-1">{label}</label>
                        <ToggleButton
                            checked={!!value}
                            onLabel="Yes"
                            offLabel="No"
                            readOnly
                            className="w-full"
                        />
                    </div>
                ))}
            </div>

            <div className="mt-3">
                <ToggleButton
                    checked={roomType?.isActive}
                    onLabel="Active"
                    offLabel="Inactive"
                    readOnly
                    className="w-full"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Created At</label>
                <InputText
                    value={roomType?.createdAt ? new Date(roomType.createdAt).toLocaleString() : "—"}
                    readOnly
                    className="w-full"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Updated At</label>
                <InputText
                    value={roomType?.updatedAt ? new Date(roomType.updatedAt).toLocaleString() : "—"}
                    readOnly
                    className="w-full"
                />
            </div>
        </DetailsSidebar>
    );
};

export default RoomTypeDetails;