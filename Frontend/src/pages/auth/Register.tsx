import { Button } from "primereact/button"
import { useState } from "react"
import { Link } from "react-router-dom"
import { useToast } from "../../contexts/ToastContext"
import Email from "../../custom/auth/Email"
import FirstName from "../../custom/auth/FirstName"
import LastName from "../../custom/auth/LastName"
import Password from "../../custom/auth/Password"
import Navbar from "../../components/navbar/Navbar"
import { registerUser } from "../../services/authServices"

interface RegisterErrorProps {
    FirstName?: string[],
    LastName?: string[],
    Email?: string[],
    Password?: string[],
    ConfirmPassword?: string[]
}

const Register = () => {
    const { toast } = useToast();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<RegisterErrorProps>({});

    // TODO: replace these later on with Formik for validation 
    const hasServerFieldErrors = !!errors.FirstName?.length || !!errors.LastName?.length || !!errors.Email?.length || !!errors.Password?.length || !!errors.ConfirmPassword?.length
    const hasClientErrors =
        !firstName.trim() ||
        !lastName.trim() ||
        !email.trim() ||
        !email.includes("@") ||
        password.length < 12 ||
        confirmPassword !== password

    const isDisabled = loading || hasClientErrors || hasServerFieldErrors

    const handleSubmit = async () => {
        try {
            setLoading(true)
            setErrors({})

            await registerUser({ firstName, lastName, email, password, confirmPassword })

            toast({ severity: 'success', summary: 'Success', detail: 'Account created successfully', });

            setTimeout(() => { window.location.href = "/login" }, 1500)
        } catch (err: any) {
            const serverErrors = err.response?.data?.errors
            if (serverErrors) setErrors(serverErrors)

            toast({ severity: 'error', summary: 'Error', detail: err.response?.data?.message || 'Registration failed. Please try again.', });
        } finally {
            setLoading(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !loading) {
            handleSubmit()
        }
    }

    return (
        <>
            <div className="fixed top-0 left-0 w-full z-20">
                <Navbar />
            </div>

            <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 p-5 m-0">
                <div className="relative w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-10 border border-gray-200/40 z-10">
                    <div className="">
                        <div className="text-left mb-8">
                            <h1 className="text-2xl font-bold text-gray-700 mb-1">Create Account</h1>
                        </div>
                    </div>

                    <div onKeyDown={handleKeyPress} className="flex flex-col gap-5">
                        <FirstName
                            firstName={firstName}
                            setFirstName={(value) => {
                                setFirstName(value)
                                setErrors(prev => ({ ...prev, FirstName: undefined }))
                            }}
                            loading={loading}
                            errors={errors.FirstName}
                        />

                        <LastName
                            lastName={lastName}
                            setLastName={(value) => {
                                setLastName(value)
                                setErrors(prev => ({ ...prev, LastName: undefined }))
                            }}
                            loading={loading}
                            errors={errors.LastName}
                        />

                        <Email
                            email={email}
                            setEmail={(v) => {
                                setEmail(v)
                                setErrors((p) => ({ ...p, Email: undefined }))
                            }}
                            loading={loading}
                            errors={errors.Email}
                        />

                        <div className="relative w-full">
                            <Password
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                    setErrors(prev => ({ ...prev, Password: undefined }))
                                }}
                                placeholder="Password"
                                disabled={loading}
                                errors={errors.Password}
                                firstName={firstName}
                                lastName={lastName}
                                email={email}
                            />
                        </div>

                        <div className="relative w-full">
                            <Password
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value)
                                    setErrors(prev => ({ ...prev, ConfirmPassword: undefined }))
                                }}
                                placeholder="Confirm Password"
                                disabled={loading}
                                errors={errors.ConfirmPassword}
                                firstName={firstName}
                                lastName={lastName}
                                email={email}
                                originalPassword={password}
                                isConfirmPassword={true}
                            />
                        </div>

                        <Button
                            label={loading ? "Creating Account..." : "Create Account"}
                            icon={loading ? <i className="pi pi-spinner animate-spin" /> : "pi pi-user-plus"}
                            onClick={handleSubmit}
                            disabled={isDisabled}
                            className="w-full h-12 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 disabled:opacity-60 disabled:cursor-not-allowed border-0 rounded-lg text-white text-base font-medium font-sans transition-all duration-200 mt-2"
                        />
                        <p className="text-sm text-gray-400">
                            Already have an account?<Link to="/login" className="hover:text-gray-600 hover:underline ml-1">Log In</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;