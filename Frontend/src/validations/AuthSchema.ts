import * as Yup from "yup";
import { UserConstants } from './constants/user';

export interface RegisterFormValues {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export const registerInitialValues: RegisterFormValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
};

export interface LoginFormValues {
    email: string;
    password: string;
};

export const loginInitialValues: LoginFormValues = { email: "", password: "" };

export const RegisterSchema = Yup.object({
    firstName: Yup.string()
        .required("First name is required")
        .matches(/^[A-Z][a-z]*$/, "First name must start with a capital letter and contain only letters")
        .max(UserConstants.MAX_FIRST_NAME_LENGTH, `First name cannot exceed ${UserConstants.MAX_FIRST_NAME_LENGTH} characters`),

    lastName: Yup.string()
        .required("Last name is required")
        .matches(/^[A-Z][a-z]*$/, "Last name must start with a capital letter and contain only letters")
        .max(UserConstants.MAX_LAST_NAME_LENGTH, `Last name cannot exceed ${UserConstants.MAX_LAST_NAME_LENGTH} characters`),

    email: Yup.string()
        .required("Email is required")
        .email("Invalid email format")
        .max(UserConstants.MAX_EMAIL_LENGTH, `Email cannot exceed ${UserConstants.MAX_EMAIL_LENGTH} characters`),

    password: Yup.string()
        .required("Password is required")
        .min(UserConstants.MIN_PASSWORD_LENGTH, `Password must be at least ${UserConstants.MIN_PASSWORD_LENGTH} characters`)
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/\d/, "Password must contain at least one number")
        .matches(/[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?]/, "Password must contain at least one special character"),

    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm password is required"),
});

export const LoginSchema = Yup.object({
    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required")
        .max(UserConstants.MAX_EMAIL_LENGTH, `Email cannot exceed ${UserConstants.MAX_EMAIL_LENGTH} characters`),

    password: Yup.string()
        .required("Password is required")
        .min(UserConstants.MIN_PASSWORD_LENGTH, `Password must be at least ${UserConstants.MIN_PASSWORD_LENGTH} characters`)
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/\d/, "Password must contain at least one number")
        .matches(/[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?]/, "Password must contain at least one special character"),
});