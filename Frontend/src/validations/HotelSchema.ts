import * as Yup from 'yup';
import { HotelConstants } from './constants/hotel';

export const HotelSchema = Yup.object().shape({
    name: Yup.string()
        .required("Hotel name is required")
        .matches(/^[A-Z][a-zA-Z]{2,}$/, "Hotel name must start with a capital letter and be at least 3 letters long")
        .max(HotelConstants.MAX_NAME_LENGTH, `Hotel name cannot exceed ${HotelConstants.MAX_NAME_LENGTH} characters`),

    description: Yup.string()
        .max(HotelConstants.MAX_DESCRIPTION_LENGTH, `Description cannot exceed ${HotelConstants.MAX_DESCRIPTION_LENGTH} characters`),

    email: Yup.string()
        .required("Email is required")
        .email("Invalid email format")
        .max(HotelConstants.MAX_EMAIL_LENGTH, `Email cannot exceed ${HotelConstants.MAX_EMAIL_LENGTH} characters`),

    phoneNumber: Yup.string()
        .required("Phone number is required")
        .matches(/^(043|044|045|048|049)\d{6}$/, "Phone number must start with 043, 044, 045, 048, or 049 and be followed by 6 digits")
        .max(HotelConstants.MAX_PHONE_NUMBER_LENGTH, `Phone number cannot exceed ${HotelConstants.MAX_PHONE_NUMBER_LENGTH} characters`),

    city: Yup.string()
        .required("City is required")
        .matches(/^[A-Z][a-zA-Z]{2,}$/, "City must start with a capital letter and be at least 3 letters long")
        .max(HotelConstants.MAX_CITY_LENGTH, `City cannot exceed ${HotelConstants.MAX_CITY_LENGTH} characters`),

    country: Yup.string()
        .required("Country is required")
        .matches(/^[A-Z][a-zA-Z]{2,}$/, "Country must start with a capital letter and be at least 3 letters long")
        .max(HotelConstants.MAX_COUNTRY_LENGTH, `Country cannot exceed ${HotelConstants.MAX_COUNTRY_LENGTH} characters`),
});