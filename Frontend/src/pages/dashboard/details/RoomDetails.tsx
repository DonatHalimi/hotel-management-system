import React from "react";
import { InputText } from "primereact/inputtext";
import { RoomCondition, RoomStatus } from "../tables/RoomTable";
import { InputTextarea } from "primereact/inputtextarea";
import { ToggleButton } from "primereact/togglebutton";
import DetailsSidebar from "../../../components/layout/DetailsSidebar";

type RoomDetailsProps = {
    visible: boolean;
    onHide: () => void;
    room: any | null;
    onEdit: (room: any) => void;
    onDelete: (room: any) => Promise<void>;
};

const RoomDetails: React.FC<RoomDetailsProps> = ({
    visible,
    onHide,
    room,
    onEdit,
    onDelete,
}) => {
    return (
        <DetailsSidebar
            visible={visible}
            onHide={onHide}
            title="Room Details"
            onEdit={() => onEdit(room)}
            onDelete={() => onDelete(room)}
        >
            <div>
                <label className="block text-sm font-medium mb-1">Room ID</label>
                <InputText
                    value={room?.roomID || "—"}
                    readOnly
                    className="w-full"
                />
            </div>

            <div className="flex flex-row items-center space-x-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Room Number</label>
                    <InputText
                        value={room?.roomNumber || "—"}
                        readOnly
                        className="w-full"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Floor Number</label>
                    <InputText
                        value={room?.floorNumber || "—"}
                        readOnly
                        className="w-full"
                    />
                </div>
            </div>

            <div className="flex flex-row items-center space-x-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <InputText
                        value={room ? RoomStatus[room.status] : "—"}
                        readOnly
                        className="w-full"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Condition</label>
                    <InputText
                        value={room ? RoomCondition[room.condition] : "—"}
                        readOnly
                        className="w-full"
                    />
                </div>
            </div>

            <div className="flex flex-row items-center space-x-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Hotel</label>
                    <InputText
                        value={room ? room.hotelName : "-"}
                        readOnly
                        className="w-full"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Room Type</label>
                    <InputText
                        value={room ? room.roomTypeName : "-"}
                        readOnly
                        className="w-full"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <InputTextarea
                    value={room?.notes || "—"}
                    readOnly
                    autoResize
                    rows={4}
                    className="w-full"
                />
            </div>

            <div>
                <ToggleButton
                    checked={room?.isActive}
                    onLabel="Active"
                    offLabel="Inactive"
                    readOnly
                    className="w-full"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Created At</label>
                <InputText
                    value={room?.createdAt ? new Date(room.createdAt).toLocaleString() : "—"}
                    readOnly
                    className="w-full"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Updated At</label>
                <InputText
                    value={room?.updatedAt ? new Date(room.updatedAt).toLocaleString() : "—"}
                    readOnly
                    className="w-full"
                />
            </div>
        </DetailsSidebar>
    );
};

export default RoomDetails;