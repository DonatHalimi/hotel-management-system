import * as Yup from 'yup';
import { RoomConstants } from './constants/room';

export const RoomSchema = Yup.object().shape({
    roomNumber: Yup.string()
        .required("Room number is required")
        .matches(/^[A-Za-z0-9-]+$/, "Room number can only contain letters, numbers and hyphens")
        .max(RoomConstants.MAX_ROOM_NUMBER_LENGTH, `Room number cannot exceed ${RoomConstants.MAX_ROOM_NUMBER_LENGTH} characters`),

    floorNumber: Yup.number()
        .required("Floor number is required")
        .min(RoomConstants.MIN_FLOOR_NUMBER, `Floor number must be at least ${RoomConstants.MIN_FLOOR_NUMBER}`)
        .max(RoomConstants.MAX_FLOOR_NUMBER, `Floor number cannot exceed ${RoomConstants.MAX_FLOOR_NUMBER}`),

    status: Yup.number()
        .required("Room status is required")
        .oneOf([0, 1, 2, 3, 4, 5], "Invalid room status"),

    condition: Yup.number()
        .required("Room condition is required")
        .oneOf([0, 1, 2, 3], "Invalid room condition"),

    notes: Yup.string()
        .max(RoomConstants.MAX_NOTES_LENGTH, `Notes cannot exceed ${RoomConstants.MAX_NOTES_LENGTH} characters`),

    hotelID: Yup.string()
        .required("Hotel is required"),

    roomTypeID: Yup.string()
        .required("Room type is required"),

    isActive: Yup.boolean().nullable()
});