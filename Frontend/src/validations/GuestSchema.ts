import * as Yup from 'yup';

export const GuestSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email').nullable(),
    phoneNumber: Yup.string().nullable(),
    city: Yup.string().nullable(),
    country: Yup.string().nullable(),
});