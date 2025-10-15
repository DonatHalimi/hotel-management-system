import * as Yup from 'yup';

export const GuestSchema = Yup.object().shape({
    firstName: Yup.string()
        .required('First name is required')
        .matches(/^[A-Z][a-zA-Z]*$/, 'First name must start with a capital letter and contain only letters')
        .min(3, 'First name must be at least 3 characters')
        .max(50, 'First name cannot exceed 50 characters'),

    lastName: Yup.string()
        .required('Last name is required')
        .matches(/^[A-Z][a-zA-Z]*$/, 'Last name must start with a capital letter and contain only letters')
        .min(3, 'Last name must be at least 3 characters')
        .max(50, 'Last name cannot exceed 50 characters'),

    idNumber: Yup.string()
        .required('ID number is required')
        .matches(/^[0-9]{10}$/, 'ID number must be 10 numbers long'),

    email: Yup.string()
        .email('Invalid email')
        .required('Email is required')
        .max(100, 'Email cannot exceed 100 characters'),

    phoneNumber: Yup.string()
        .required('Phone number is required')
        .matches(/^(043|044|045|048|049)\d{6}$/, 'Phone number must be in the format of 043/44/45/48/49 XXX-XXX'),

    street: Yup.string()
        .required('Street is required')
        .max(100, 'Street cannot exceed 100 characters'),

    city: Yup.string()
        .required('City is required')
        .max(50, 'City cannot exceed 50 characters'),

    country: Yup.string()
        .required('Country is required')
        .max(50, 'Country cannot exceed 50 characters'),
});