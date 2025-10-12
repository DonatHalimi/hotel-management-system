import { Button } from "primereact/button"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google'
import { useToast } from "../../contexts/ToastContext"
import Email from "../../custom/auth/Email"
import Password from "../../custom/auth/Password"
import Navbar from "../../components/navbar/Navbar"
import { loginUser, googleLogin } from "../../services/authServices"

interface LoginErrorProps {
    Email?: string[]
    Password?: string[]
}

const Login = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<LoginErrorProps>({});

    const hasServerFieldErrors = !!errors.Email?.length || !!errors.Password?.length;
    const hasClientErrors = !email.trim() || !email.includes("@") || password.length < 12 || hasServerFieldErrors;
    const isDisabled = loading || hasClientErrors;

    const handleSubmit = async () => {
        try {
            setLoading(true)
            setErrors({})

            const res = await loginUser({ email, password });

            localStorage.setItem("accessToken", res.data.accessToken);
            localStorage.setItem("refreshToken", res.data.refreshToken);

            toast({ severity: "success", summary: "Success", detail: "Successfully logged in" })
            navigate("/", { replace: true })
        } catch (err: any) {
            const serverErrors = err.response?.data?.errors
            if (serverErrors) setErrors(serverErrors)

            toast({
                severity: "error",
                summary: "Error",
                detail: err.response?.data?.message || "Login failed. Please try again",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
        try {
            if (!credentialResponse.credential) {
                throw new Error("No credential received from Google");
            }

            setLoading(true);
            const res = await googleLogin({ idToken: credentialResponse.credential });

            localStorage.setItem("accessToken", res.data.accessToken);
            localStorage.setItem("refreshToken", res.data.refreshToken);

            toast({ severity: "success", summary: "Success", detail: "Successfully logged in with Google" });
            navigate("/", { replace: true });
        } catch (err: any) {
            toast({ severity: "error", summary: "Error", detail: err.response?.data?.message || "Google login failed. Please try again" });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleError = () => {
        toast({ severity: "error", summary: "Error", detail: "Google login failed. Please try again" });
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !loading) handleSubmit()
    }

    return (
        <>
            <div className="fixed top-0 left-0 w-full z-20">
                <Navbar />
            </div>

            <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 p-5 m-0">
                <div className="relative w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-10 border border-gray-200/40 z-10">
                    <div className="text-left mb-8">
                        <h1 className="text-2xl font-bold text-gray-700 mb-1">Welcome Back</h1>
                    </div>

                    <div onKeyDown={handleKeyPress} className="flex flex-col gap-5">
                        <Email
                            email={email}
                            setEmail={(v) => {
                                setEmail(v)
                                setErrors((p) => ({ ...p, Email: undefined }))
                            }}
                            loading={loading}
                            errors={errors.Email}
                        />

                        <Password
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                                setErrors((p) => ({ ...p, Password: undefined }))
                            }}
                            placeholder="Password"
                            disabled={loading}
                            errors={errors.Password}
                        />

                        <Button
                            label={loading ? "Logging in..." : "Log In"}
                            icon={loading ? <i className="pi pi-spinner animate-spin" /> : "pi pi-sign-in"}
                            onClick={handleSubmit}
                            disabled={isDisabled}
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
                            Don't have an account?
                            <Link to="/register" className="hover:text-gray-600 hover:underline ml-1">
                                Register
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;