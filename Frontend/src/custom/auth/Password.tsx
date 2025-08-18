import { InputText } from "primereact/inputtext"
import { OverlayPanel } from "primereact/overlaypanel"
import { ProgressBar } from "primereact/progressbar"
import { classNames } from "primereact/utils"
import React, { useRef, useState } from "react"

interface PasswordProps {
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    placeholder?: string
    disabled?: boolean
    errors?: string[] | string
    firstName?: string
    lastName?: string
    email?: string
    showPasswordRules?: boolean
    originalPassword?: string
    isConfirmPassword?: boolean
}

const Password = ({
    value,
    onChange,
    placeholder,
    disabled,
    errors,
    firstName,
    lastName,
    email,
    showPasswordRules = true,
    originalPassword,
    isConfirmPassword = false,
}: PasswordProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const opRef = useRef<OverlayPanel | null>(null);
    const keepOpenRef = useRef(false);
    const errArr = Array.isArray(errors) ? errors : errors ? [errors] : [];

    const containsPersonalInfo = (password: string): boolean => {
        if (!password) return false
        const lowerPassword = password.toLowerCase()
        if (firstName && firstName.trim() && lowerPassword.includes(firstName.toLowerCase())) return true
        if (lastName && lastName.trim() && lowerPassword.includes(lastName.toLowerCase())) return true
        if (email && email.trim()) {
            const emailPrefix = email.split("@")[0].toLowerCase()
            if (emailPrefix && lowerPassword.includes(emailPrefix)) return true
        }
        return false
    }

    const rules = [
        { id: "length", label: "At least 12 characters", test: (p: string) => p.length >= 12 },
        { id: "upper", label: "At least one uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
        { id: "number", label: "At least one number", test: (p: string) => /\d/.test(p) },
        { id: "special", label: "At least one special character", test: (p: string) => /[!@#$%^&*(),.?\":{}|<>~`_\-\\\/\[\];'+=;]/.test(p) },
    ]

    const allRules = (firstName || lastName || email)
        ? [
            ...rules,
            {
                id: "personal",
                label: "Cannot contain personal information",
                test: (p: string) => !containsPersonalInfo(p),
            },
        ]
        : rules

    const passwordsMatch = isConfirmPassword && originalPassword ? value === originalPassword : true
    const showPasswordMismatch = isConfirmPassword && originalPassword && value && !passwordsMatch

    const passedRules = allRules.filter((r) => r.test(value))
    const progress = Math.round((passedRules.length / allRules.length) * 100)
    const hasIncorrect = errArr.some((e) => /incorrect/i.test(e))
    const hasServerErrors = errArr.length > 0

    return (
        <div className="relative w-full">
            {showPasswordRules && (
                <OverlayPanel
                    ref={opRef}
                    showCloseIcon={false}
                    style={{ width: 365 }}
                    onMouseEnter={() => (keepOpenRef.current = true)}
                    onMouseLeave={() => {
                        keepOpenRef.current = false
                        setTimeout(() => opRef.current?.hide(), 120)
                    }}
                    onMouseDown={() => {
                        keepOpenRef.current = true
                    }}
                >
                    <div className="px-2 py-2">
                        <div className="mb-3">
                            <div className="text-xs font-medium text-gray-600 mb-2">Password strength</div>
                            <ProgressBar value={progress} style={{ height: 8 }} showValue={false} />
                            <div className="text-xs mt-1">{progress}%</div>
                        </div>

                        <ul className="text-sm space-y-2">
                            {allRules.map((r) => {
                                const ok = r.test(value)
                                return (
                                    <li key={r.id} className="flex items-center gap-2">
                                        <i
                                            className={classNames(
                                                ok ? "pi pi-check" : "pi pi-times",
                                                ok ? "text-green-600" : "text-red-500"
                                            )}
                                        />
                                        <span className={classNames(ok ? "text-gray-700" : "text-gray-500")}>{r.label}</span>
                                    </li>
                                )
                            })}

                            {hasIncorrect && (
                                <li className="flex items-center gap-2 mt-2">
                                    <i className="pi pi-ban text-red-600" />
                                    <span className="text-sm text-red-600">Password is incorrect</span>
                                </li>
                            )}

                            {errArr
                                .filter((e) => !/incorrect/i.test(e))
                                .map((e, i) => (
                                    <li key={`srv-${i}`} className="flex items-start gap-2 text-sm text-red-600">
                                        <i className="pi pi-exclamation-triangle" />
                                        <span>{e}</span>
                                    </li>
                                ))}
                        </ul>
                    </div>
                </OverlayPanel>
            )}

            <div className="flex flex-wrap items-center gap-2">
                <div className="relative flex-1 min-w-[250px]">
                    <InputText
                        type={showPassword ? "text" : "password"}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        disabled={disabled}
                        className={classNames(
                            "w-full h-12 text-base px-4 py-3 border-2 rounded-lg outline-none transition-all duration-200 font-sans pr-10",
                            {
                                "border-red-500": hasServerErrors || showPasswordMismatch,
                                "border-gray-300": !hasServerErrors && !showPasswordMismatch,
                            }
                        )}
                        onFocus={(e: React.FocusEvent<HTMLInputElement>) =>
                            showPasswordRules &&
                            opRef.current?.show(e, e.currentTarget)
                        }
                        onBlur={() => {
                            if (!showPasswordRules) return
                            setTimeout(() => {
                                if (!keepOpenRef.current) opRef.current?.hide()
                            }, 150)
                        }}
                        onKeyDown={(e) => {
                            if (!showPasswordRules) return
                            if (e.key === "Tab" || e.key === "Enter") {
                                opRef.current?.hide()
                            }
                        }}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-0 cursor-pointer"
                    >
                        <i className={showPassword ? "pi pi-eye-slash" : "pi pi-eye"} />
                    </button>
                </div>

                {showPasswordMismatch && (
                    <small className="block mt-1 text-sm text-red-600 w-full">Passwords do not match</small>
                )}

                {hasServerErrors && (
                    <div className="w-full">
                        {errArr.map((error, index) => (
                            <small key={index} className="block text-sm text-red-600">
                                {error}
                            </small>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Password;