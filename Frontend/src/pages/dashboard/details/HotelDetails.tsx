import React from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Chip } from "primereact/chip";
import DetailsSidebar from "../../../components/layout/DetailsSidebar";

type HotelDetailsProps = {
    visible: boolean;
    onHide: () => void;
    hotel: any | null;
    onEdit: (hotel: any) => void;
    onDelete: (hotel: any) => Promise<void>;
};

const HotelDetails: React.FC<HotelDetailsProps> = ({
    visible,
    onHide,
    hotel,
    onEdit,
    onDelete
}) => {
    const amenities = [
        { label: "Wi-Fi", key: "hasWifi" },
        { label: "Pool", key: "hasPool" },
        { label: "Parking", key: "hasParking" },
        { label: "Spa", key: "hasSpa" },
        { label: "Gym", key: "hasGym" },
        { label: "Pet Friendly", key: "petFriendly" },
    ].filter((a) => hotel?.[a.key]);

    return (
        <DetailsSidebar
            visible={visible}
            onHide={onHide}
            title="Hotel Details"
            onEdit={() => onEdit(hotel)}
            onDelete={() => onDelete(hotel)}
        >
            <div>
                <label className="block text-sm font-medium mb-1">
                    Hotel ID
                </label>
                <InputText
                    value={hotel?.hotelID || "—"}
                    readOnly
                    className="w-full"
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <InputText
                        value={hotel?.city || "—"}
                        readOnly
                        className="w-full"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Country</label>
                    <InputText
                        value={hotel?.country || "—"}
                        readOnly
                        className="w-full"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <InputText
                        value={hotel?.name || "—"}
                        readOnly
                        className="w-full"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <InputText
                        value={hotel?.email || "—"}
                        readOnly
                        className="w-full"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <InputTextarea
                    value={hotel?.description || "—"}
                    readOnly
                    rows={4}
                    className="w-full"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <InputText
                    value={hotel?.phoneNumber || "—"}
                    readOnly
                    className="w-full"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Amenities</label>
                {amenities.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {amenities.map((a) => (
                            <Chip key={a.key} label={a.label} className="bg-blue-50 text-blue-700" />
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">No amenities listed</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Created At</label>
                <InputText
                    value={hotel?.createdAt ? new Date(hotel.createdAt).toLocaleString() : "—"}
                    readOnly
                    className="w-full"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Updated At</label>
                <InputText
                    value={hotel?.updatedAt ? new Date(hotel.updatedAt).toLocaleString() : "—"}
                    readOnly
                    className="w-full"
                />
            </div>
        </DetailsSidebar>
    );
};

export default HotelDetails;
