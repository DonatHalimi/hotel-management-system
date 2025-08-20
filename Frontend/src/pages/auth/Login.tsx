import { Button } from "primereact/button"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axiosInstance from "../../config/axiosInstance"
import { useToast } from "../../contexts/ToastContext"
import Email from "../../custom/auth/Email"
import Password from "../../custom/auth/Password"
import Navbar from "../../components/navbar/Navbar"

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

    // TODO: replace these later on with Formik for validation 
    const hasServerFieldErrors = !!errors.Email?.length || !!errors.Password?.length;
    const hasClientErrors = !email.trim() || !email.includes("@") || password.length < 12 || hasServerFieldErrors;
    const isDisabled = loading || hasClientErrors;

    const handleSubmit = async () => {
        try {
            setLoading(true)
            setErrors({})
            const res = await axiosInstance.post("auth/login", { email, password })
            localStorage.setItem("accessToken", res.data.accessToken)

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
                            icon={loading ? "pi pi-spin pi-spinner" : "pi pi-sign-in"}
                            onClick={handleSubmit}
                            disabled={isDisabled}
                            className="w-full h-12 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 disabled:opacity-60 disabled:cursor-not-allowed border-0 rounded-lg text-white text-base font-medium font-sans transition-all duration-200 mt-2"
                        />

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