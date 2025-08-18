import { InputText } from 'primereact/inputtext'
import { classNames } from 'primereact/utils'

interface FirstNameProps {
    firstName: string
    setFirstName: (firstName: string) => void
    loading: boolean
    errors?: string[] | string
}

const FirstName = ({ firstName, setFirstName, loading, errors }: FirstNameProps) => {
    const errArr = Array.isArray(errors) ? errors : errors ? [errors] : [];

    const validateFirstName = (name: string) => {
        if (!name.trim()) {
            return { valid: false, message: "First name is required" }
        }

        const nameRegex = /^[A-Z][a-zA-Z]*$/
        return {
            valid: nameRegex.test(name),
            message: "First name must start with a capital letter and contain only letters"
        }
    }

    const validation = validateFirstName(firstName)
    const hasServerErrors = errArr.length > 0
    const showClientValidation = firstName.trim() && !validation.valid

    return (
        <div className="relative w-full">
            <InputText
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                autoComplete="given-name"
                disabled={loading}
                className={classNames(
                    "w-full h-12 text-base px-4 py-3 border-2 rounded-lg outline-none transition-all duration-200 font-sans bg-white",
                    {
                        "border-red-500": hasServerErrors || showClientValidation,
                        "border-green-500": firstName.trim() && validation.valid && !hasServerErrors,
                        "border-gray-300": !hasServerErrors && !showClientValidation && (!firstName.trim() || validation.valid)
                    }
                )}
            />

            {showClientValidation && (
                <small className="block mt-1 text-sm text-red-600">
                    {validation.message}
                </small>
            )}

            {hasServerErrors && (
                <div className="mt-1">
                    {errArr.map((error, index) => (
                        <small key={index} className="block text-sm text-red-600">
                            {error}
                        </small>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FirstName;