import * as Yup from 'yup';

export const GuestSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),

    lastName: Yup.string().required('Last name is required'),

    idNumber: Yup.string().required('ID number is required'),

    email: Yup.string().email('Invalid email').required('Email is required'),

    phoneNumber: Yup.string().required('Phone number is required'),

    street: Yup.string().required('Street is required'),

    city: Yup.string().required('City is required'),

    country: Yup.string().required('Country is required'),
});