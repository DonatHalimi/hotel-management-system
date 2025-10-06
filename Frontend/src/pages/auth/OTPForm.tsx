import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "../../contexts/ToastContext";
import axiosInstance from "../../config/axiosInstance";

const OTPForm = () => {
    const { toast } = useToast();
    const location = useLocation();
    const navigate = useNavigate();

    const email = location.state?.email;

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (!email) {
            toast({ severity: 'warn', summary: 'Warning', detail: 'Please register first to verify your email' });

            navigate('/register');
            return;
        }
    }, [email, navigate, toast]);

    const handleInputChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'Enter') {
            handleVerifyOtp();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');

        if (pastedData.length === 6) {
            const newOtp = pastedData.split('');
            setOtp(newOtp);
            inputRefs.current[5]?.focus();
        }
    };

    const handleVerifyOtp = async () => {
        const otpString = otp.join('');

        if (otpString.length !== 6) {
            toast({ severity: 'warn', summary: 'Invalid OTP', detail: 'Please enter all 6 digits' });
            return;
        }

        try {
            setLoading(true);

            await axiosInstance.post('/auth/verify-email', { email: email, otp: otpString });

            toast({ severity: 'success', summary: 'Success', detail: 'Email verified successfully! You can now log in' });

            setTimeout(() => {
                navigate('/login', { state: { email: email } });
            }, 1500);

        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Invalid or expired OTP.';

            toast({ severity: 'error', summary: 'Verification Failed', detail: errorMessage });

            setOtp(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        try {
            setResendLoading(true);

            await axiosInstance.post('/auth/resend-verification', { email: email });

            toast({ severity: 'success', summary: 'OTP Sent', detail: 'A new verification code has been sent to your email' });

            setOtp(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to resend OTP.';

            toast({ severity: 'error', summary: 'Error', detail: errorMessage });
        } finally {
            setResendLoading(false);
        }
    };

    const isOtpComplete = otp.every(digit => digit !== "");

    if (!email) {
        return null;
    }

    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 p-5 m-0">
                <div className="relative w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-10 border border-gray-200/40 z-10">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="pi pi-envelope text-white text-2xl"></i>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Verify Your Email</h1>
                        <p className="text-gray-600 text-sm">
                            We've sent a 6-digit verification code to
                        </p>
                        <p className="text-blue-600 font-medium text-sm mt-1 break-all">
                            {email}
                        </p>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="flex justify-center gap-3">
                            {otp.map((digit, index) => (
                                <div key={index} className="relative">
                                    <InputText
                                        ref={(el) => {
                                            if (el) {
                                                inputRefs.current[index] = el;
                                            }
                                        }} value={digit}
                                        onChange={(e) => handleInputChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onPaste={index === 0 ? handlePaste : undefined}
                                        className="w-12 h-12 text-center text-lg font-bold rounded-lg border-2 focus:border-blue-500 focus:shadow-lg transition-all duration-200"
                                        maxLength={1}
                                        disabled={loading}
                                    />
                                </div>
                            ))}
                        </div>

                        <Button
                            label={loading ? "Verifying..." : "Verify Email"}
                            icon={loading ? <i className="pi pi-spinner animate-spin" /> : "pi pi-check"}
                            onClick={handleVerifyOtp}
                            disabled={!isOtpComplete || loading}
                            className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:opacity-60 disabled:cursor-not-allowed border-0 rounded-lg text-white text-base font-medium transition-all duration-200"
                        />

                        <div className="text-center">
                            <p className="text-gray-500 text-sm mb-2">Didn't receive the code?</p>
                            <Button
                                label={resendLoading ? "Sending..." : "Resend Code"}
                                icon={resendLoading ? <i className="pi pi-spinner animate-spin" /> : "pi pi-refresh"}
                                onClick={handleResendOtp}
                                disabled={resendLoading}
                                className="bg-transparent border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 disabled:opacity-60 disabled:cursor-not-allowed text-gray-700 hover:text-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                                outlined
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OTPForm;