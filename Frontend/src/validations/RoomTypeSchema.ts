import * as Yup from "yup";

export const RoomTypeSchema = Yup.object().shape({
    name: Yup.string()
        .required("Name is required")
        .matches(/^[A-Za-z0-9- ]+$/, "Name must contain only letters, numbers, hyphens and spaces")
        .min(3, "Name must be at least 3 characters")
        .max(100, "Name cannot exceed 100 characters"),

    maxOccupancy: Yup.number()
        .required("Max occupancy is required")
        .min(1, "Max occupancy must be at least 1")
        .integer("Max occupancy must be a whole number"),

    bedCount: Yup.number()
        .required("Bed count is required")
        .min(1, "Bed count must be at least 1")
        .integer("Bed count must be a whole number"),

    bedType: Yup.number()
        .required("Bed type is required")
        .oneOf([0, 1, 2, 3, 4, 5], "Invalid bed type"),

    basePrice: Yup.number()
        .required("Base price is required")
        .min(0, "Base price cannot be negative")
        .typeError("Base price must be a number"),

    sizeSqft: Yup.number()
        .required("Size is required")
        .min(0, "Size cannot be negative")
        .typeError("Size must be a number"),
});

