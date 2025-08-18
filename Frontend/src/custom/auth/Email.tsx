import { InputText } from "primereact/inputtext"
import { classNames } from "primereact/utils"

interface EmailProps {
    email: string
    setEmail: (email: string) => void
    loading: boolean
    errors?: string[] | string
    maxLength?: number
};

const Email = ({ email, setEmail, loading, errors, maxLength = 50 }: EmailProps) => {
    const errArr = Array.isArray(errors) ? errors : errors ? [errors] : [];

    const validateEmail = (email: string) => {
        const rules = []
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!email.trim()) {
            rules.push({ valid: false, message: "Email is required" })
        } else {
            rules.push({
                valid: emailRegex.test(email),
                message: "Invalid email format"
            })

            rules.push({
                valid: email.length <= maxLength,
                message: `Email cannot exceed ${maxLength} characters`
            })
        }

        return rules
    };

    const validationRules = validateEmail(email)
    const hasClientErrors = validationRules.some(rule => !rule.valid)
    const hasServerErrors = errArr.length > 0

    const showClientValidation = email.trim() && hasClientErrors

    return (
        <div className="relative w-full">
            <div className="relative w-full">
                <InputText
                    id="email"
                    value={email}
                    onChange={e => setEmail((e.target as HTMLInputElement).value)}
                    placeholder="Email Address"
                    autoComplete="email"
                    disabled={loading}
                    className={classNames(
                        "w-full h-12 text-base px-4 py-3 border-2 rounded-lg outline-none transition-all duration-200 font-sans bg-white",
                        {
                            "border-red-500": hasServerErrors || showClientValidation,
                            "border-green-500": email.trim() && !hasClientErrors && !hasServerErrors,
                            "border-gray-300": !hasServerErrors && !showClientValidation && (!email.trim() || !hasClientErrors)
                        }
                    )}
                />

                {showClientValidation && (
                    <div className="mt-1">
                        {validationRules
                            .filter(rule => !rule.valid)
                            .map((rule, index) => (
                                <small key={index} className="block text-sm text-red-600">
                                    {rule.message}
                                </small>
                            ))}
                    </div>
                )}

                {hasServerErrors && (
                    <div className="mt-1 w-full">
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

export default Email;