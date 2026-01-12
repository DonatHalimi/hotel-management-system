import * as Yup from "yup";
import { RoomTypeConstants } from "./constants/roomType";

export const RoomTypeSchema = Yup.object().shape({
    name: Yup.string()
        .required("Name is required")
        .matches(/^[A-Za-z0-9- ]+$/, "Name must contain only letters, numbers, hyphens and spaces")
        .min(RoomTypeConstants.NAME_MIN_LENGTH, `Name must be at least ${RoomTypeConstants.NAME_MIN_LENGTH} characters`)
        .max(RoomTypeConstants.NAME_MAX_LENGTH, `Name cannot exceed ${RoomTypeConstants.NAME_MAX_LENGTH} characters`),

    maxOccupancy: Yup.number()
        .required("Max occupancy is required")
        .min(RoomTypeConstants.MIN_MAX_OCCUPANCY, `Max occupancy must be at least ${RoomTypeConstants.MIN_MAX_OCCUPANCY}`)
        .integer("Max occupancy must be a whole number"),

    bedCount: Yup.number()
        .required("Bed count is required")
        .min(RoomTypeConstants.MIN_BED_COUNT, `Bed count must be at least ${RoomTypeConstants.MIN_BED_COUNT}`)
        .integer("Bed count must be a whole number"),

    bedType: Yup.number()
        .required("Bed type is required")
        .oneOf(RoomTypeConstants.VALID_BED_TYPE, "Invalid bed type"),

    basePrice: Yup.number()
        .required("Base price is required")
        .min(RoomTypeConstants.MIN_BASE_PRICE, "Base price cannot be negative")
        .typeError("Base price must be a number"),

    sizeSqft: Yup.number()
        .required("Size is required")
        .min(RoomTypeConstants.MIN_SIZE_SQFT, "Size cannot be negative")
        .typeError("Size must be a number"),
});