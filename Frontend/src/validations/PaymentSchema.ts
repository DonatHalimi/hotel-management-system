import * as Yup from "yup";
import { PaymentConstants } from "./constants/payment";

export const PaymentSchema = Yup.object().shape({
    bookingID: Yup.string()
        .required("Booking is required"),

    amount: Yup.number()
        .typeError("Amount must be a number")
        .min(PaymentConstants.MIN_AMOUNT, `Amount must be at least ${PaymentConstants.MIN_AMOUNT}`)
        .max(PaymentConstants.MAX_AMOUNT, `Amount cannot exceed ${PaymentConstants.MAX_AMOUNT}`)
        .required("Amount is required"),

    method: Yup.number()
        .oneOf(PaymentConstants.VALID_METHODS, "Invalid payment method")
        .required("Payment method is required"),

    status: Yup.number()
        .oneOf(PaymentConstants.VALID_STATUS, "Invalid payment status")
        .required("Payment status is required"),
});