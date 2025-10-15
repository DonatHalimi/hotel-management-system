import { Button } from "primereact/button";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useToast } from "../../contexts/ToastContext";
import Navbar from "../../components/navbar/Navbar";
import Email from "../../custom/auth/Email";
import FirstName from "../../custom/auth/FirstName";
import LastName from "../../custom/auth/LastName";
import Password from "../../custom/auth/Password";
import { Formik, Form } from "formik";
import { registerUser, googleLogin } from "../../services/authServices";
import { RegisterSchema, registerInitialValues, type RegisterFormValues } from "../../validations/AuthSchema";

const Register = () => {
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (
        values: RegisterFormValues,
        { setErrors, setSubmitting }: any
    ) => {
        try {
            await registerUser(values);

            toast({ severity: "success", summary: "Registration Successful", detail: "Please check your email for verification code.", });

            navigate("/verify-email", { state: { email: values.email } });
        } catch (err: any) {
            const serverErrors = err.response?.data?.errors;
            if (serverErrors) setErrors(serverErrors);

            toast({ severity: "error", summary: "Registration Failed", detail: err.response?.data?.message || "Registration failed. Please try again." });
        } finally {
            setSubmitting(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
        try {
            if (!credentialResponse.credential) throw new Error("No credential received from Google");

            const res = await googleLogin({ idToken: credentialResponse.credential });

            localStorage.setItem("accessToken", res.data.accessToken);
            localStorage.setItem("refreshToken", res.data.refreshToken);

            toast({ severity: "success", summary: "Success", detail: "Successfully logged in with Google" });
            navigate("/", { replace: true });
        } catch (err: any) {
            toast({ severity: "error", summary: "Error", detail: err.response?.data?.message || "Google login failed" });
        }
    };

    const handleGoogleError = () => {
        toast({ severity: "error", summary: "Error", detail: "Google login failed" });
    };

    return (
        <>
            <div className="fixed top-0 left-0 w-full z-20">
                <Navbar />
            </div>

            <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 p-5">
                <div className="relative w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-10 border border-gray-200/40 z-10">
                    <div className="text-left mb-8">
                        <h1 className="text-2xl font-bold text-gray-700 mb-1">Create Account</h1>
                    </div>

                    <Formik
                        initialValues={registerInitialValues}
                        validationSchema={RegisterSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ values, handleChange, errors, touched, isSubmitting }) => (
                            <Form className="flex flex-col gap-5">
                                <FirstName
                                    firstName={values.firstName}
                                    setFirstName={handleChange("firstName")}
                                    errors={touched.firstName ? errors.firstName ? [errors.firstName] : [] : []}
                                    loading={isSubmitting}
                                />

                                <LastName
                                    lastName={values.lastName}
                                    setLastName={handleChange("lastName")}
                                    errors={touched.lastName ? errors.lastName ? [errors.lastName] : [] : []}
                                    loading={isSubmitting}
                                />

                                <Email
                                    email={values.email}
                                    setEmail={handleChange("email")}
                                    errors={touched.email ? errors.email ? [errors.email] : [] : []}
                                    loading={isSubmitting}
                                />

                                <Password
                                    value={values.password}
                                    onChange={handleChange("password")}
                                    placeholder="Password"
                                    errors={touched.password ? errors.password ? [errors.password] : [] : []}
                                    disabled={isSubmitting}
                                />

                                <Password
                                    value={values.confirmPassword}
                                    onChange={handleChange("confirmPassword")}
                                    placeholder="Confirm Password"
                                    errors={touched.confirmPassword ? errors.confirmPassword ? [errors.confirmPassword] : [] : []}
                                    disabled={isSubmitting}
                                    isConfirmPassword
                                    originalPassword={values.password}
                                />

                                <Button
                                    type="submit"
                                    label={isSubmitting ? "Creating Account..." : "Create Account"}
                                    icon={isSubmitting ? <i className="pi pi-spinner animate-spin" /> : "pi pi-user-plus"}
                                    disabled={isSubmitting}
                                    className="w-full h-12 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 disabled:opacity-60 disabled:cursor-not-allowed border-0 rounded-lg text-white text-base font-medium font-sans transition-all duration-200 mt-2"
                                />

                                <div className="relative flex items-center justify-center my-2">
                                    <div className="border-t border-gray-300 w-full"></div>
                                    <span className="px-4 text-sm text-gray-500 bg-white/95">OR</span>
                                    <div className="border-t border-gray-300 w-full"></div>
                                </div>

                                <div className="flex justify-center">
                                    <GoogleLogin
                                        onSuccess={handleGoogleSuccess}
                                        onError={handleGoogleError}
                                        useOneTap
                                        theme="outline"
                                        size="large"
                                        text="signin_with"
                                        shape="rectangular"
                                        width="100%"
                                    />
                                </div>

                                <p className="text-sm text-gray-400">
                                    Already have an account?
                                    <Link to="/login" className="hover:text-gray-600 hover:underline ml-1">Log In</Link>
                                </p>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </>
    );
};

export default Register;