import { InputText } from 'primereact/inputtext'
import { classNames } from 'primereact/utils'

interface LastNameProps {
    lastName: string
    setLastName: (lastName: string) => void
    loading: boolean
    errors?: string[] | string
}

const LastName = ({ lastName, setLastName, loading, errors }: LastNameProps) => {
    const errArr = Array.isArray(errors) ? errors : errors ? [errors] : [];

    const validateLastName = (name: string) => {
        if (!name.trim()) return { valid: false, message: "Last name is required" }

        const nameRegex = /^[A-Z][a-zA-Z]*$/
        return {
            valid: nameRegex.test(name),
            message: "Last name must start with a capital letter and contain only letters"
        }
    }

    const validation = validateLastName(lastName)
    const hasServerErrors = errArr.length > 0
    const showClientValidation = lastName.trim() && !validation.valid

    return (
        <div className="relative w-full">
            <InputText
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                autoComplete="family-name"
                disabled={loading}
                className={classNames(
                    "w-full h-12 text-base px-4 py-3 border-2 rounded-lg outline-none transition-all duration-200 font-sans bg-white",
                    {
                        "border-red-500": hasServerErrors || showClientValidation,
                        "border-green-500": lastName.trim() && validation.valid && !hasServerErrors,
                        "border-gray-300": !hasServerErrors && !showClientValidation && (!lastName.trim() || validation.valid)
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

export default LastName;