import * as Yup from 'yup';
import { GuestConstants } from './constants/guest';

export const GuestSchema = Yup.object().shape({
    firstName: Yup.string()
        .required('First name is required')
        .matches(/^[A-Z][a-zA-Z]*$/, 'First name must start with a capital letter and contain only letters')
        .min(GuestConstants.FIRST_NAME_MIN_LENGTH, `First name must be at least ${GuestConstants.FIRST_NAME_MIN_LENGTH} characters`)
        .max(GuestConstants.FIRST_NAME_MAX_LENGTH, `First name cannot exceed ${GuestConstants.FIRST_NAME_MAX_LENGTH} characters`),

    lastName: Yup.string()
        .required('Last name is required')
        .matches(/^[A-Z][a-zA-Z]*$/, 'Last name must start with a capital letter and contain only letters')
        .min(GuestConstants.LAST_NAME_MIN_LENGTH, `Last name must be at least ${GuestConstants.LAST_NAME_MIN_LENGTH} characters`)
        .max(GuestConstants.LAST_NAME_MAX_LENGTH, `Last name cannot exceed ${GuestConstants.LAST_NAME_MAX_LENGTH} characters`),

    idNumber: Yup.string()
        .required('ID number is required')
        .matches(/^[0-9]{10}$/, 'ID number must be 10 numbers long'),

    email: Yup.string()
        .email('Invalid email')
        .required('Email is required')
        .max(GuestConstants.EMAIL_MAX_LENGTH, `Email cannot exceed ${GuestConstants.EMAIL_MAX_LENGTH} characters`),

    phoneNumber: Yup.string()
        .required('Phone number is required')
        .matches(/^(043|044|045|048|049)\d{6}$/, 'Phone number must be in the format of 043/44/45/48/49 XXX-XXX'),

    street: Yup.string()
        .required('Street is required')
        .max(GuestConstants.STREET_MAX_LENGTH, `Street cannot exceed ${GuestConstants.STREET_MAX_LENGTH} characters`),

    city: Yup.string()
        .required('City is required')
        .max(GuestConstants.CITY_MAX_LENGTH, `City cannot exceed  ${GuestConstants.CITY_MAX_LENGTH} characters`),

    country: Yup.string()
        .required('Country is required')
        .max(GuestConstants.COUNTRY_MAX_LENGTH, `Country cannot exceed ${GuestConstants.COUNTRY_MAX_LENGTH} characters`),
});