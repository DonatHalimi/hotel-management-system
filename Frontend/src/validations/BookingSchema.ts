import * as Yup from "yup";
import { BookingConstants } from "./constants/booking";

export const BookingSchema = Yup.object().shape({
    guestID: Yup.string().required("Guest is required"),
    
    roomID: Yup.string().required("Room is required"),

    checkInDate: Yup.date()
        .typeError("Check-in date is required")
        .required("Check-in date is required"),

    checkOutDate: Yup.date()
        .typeError("Check-out date is required")
        .required("Check-out date is required")
        .min(Yup.ref("checkInDate"), "Check-out must be after check-in"),

    numberOfGuests: Yup.number()
        .integer("Must be a whole number")
        .min(BookingConstants.MIN_NUMBER_OF_GUESTS, `At least ${BookingConstants.MIN_NUMBER_OF_GUESTS} guest is required`)
        .max(BookingConstants.MAX_NUMBER_OF_GUESTS, `At most ${BookingConstants.MAX_NUMBER_OF_GUESTS} guests are allowed`)
        .required("Number of guests is required"),

    totalPrice: Yup.number()
        .min(BookingConstants.MIN_TOTAL_PRICE, "Price cannot be negative")
        .required("Total price is required"),

    status: Yup.number()
        .oneOf(BookingConstants.VALID_STATUS, "Invalid status")
        .required("Status is required"),

    cancellationReason: Yup.string().when("status", {
        is: 4,
        then: (schema) => schema.required("Cancellation reason is required"),
        otherwise: (schema) => schema.notRequired(),
    }),
});
