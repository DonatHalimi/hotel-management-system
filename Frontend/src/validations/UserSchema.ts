import * as Yup from "yup";
import { UserConstants } from "./constants/user";

export const UserSchema = Yup.object().shape({
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

    roleID: Yup.string().required("Role is required"),

    password: Yup.string().when("mode", {
        is: "create",
        then: (schema) =>
            schema
                .required("Password is required")
                .min(8, "Password must be at least 8 characters")
                .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
                .matches(/[a-z]/, "Password must contain at least one lowercase letter")
                .matches(/\d/, "Password must contain at least one number")
                .matches(/[^A-Za-z0-9]/, "Password must contain at least one special character")
                .test(
                    "no-personal-info",
                    "Password cannot contain your first name, last name or email",
                    function (value) {
                        if (!value) return true;
                        const { firstName, lastName, email } = this.parent;

                        const lowerPass = value.toLowerCase();
                        const emailPrefix = email?.split("@")[0].toLowerCase() || "";

                        return !(
                            (firstName && lowerPass.includes(firstName.toLowerCase())) ||
                            (lastName && lowerPass.includes(lastName.toLowerCase())) ||
                            (emailPrefix && lowerPass.includes(emailPrefix))
                        );
                    }
                ),
        otherwise: (schema) => schema.notRequired(),
    }),
});

export const UpdateUserSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),

    lastName: Yup.string().required("Last name is required"),

    email: Yup.string().email("Invalid email").required("Email is required"),

    phoneNumber: Yup.string().nullable(),

    currentPassword: Yup.string().nullable(),

    newPassword: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/\d/, "Password must contain at least one number")
        .matches(/[^A-Za-z0-9]/, "Password must contain at least one special character")
        .test(
            "no-personal-info",
            "Password cannot contain your first name, last name or email",
            function (value) {
                if (!value) return true;
                const { firstName, lastName, email } = this.parent;

                const lowerPass = value.toLowerCase();
                const emailPrefix = email?.split("@")[0].toLowerCase() || "";

                return !(
                    (firstName && lowerPass.includes(firstName.toLowerCase())) ||
                    (lastName && lowerPass.includes(lastName.toLowerCase())) ||
                    (emailPrefix && lowerPass.includes(emailPrefix))
                );
            }
        ),
});