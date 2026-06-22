import { Input } from "./ui/input";
import { Label } from "./ui/label";

export const Field = ({
    htmlFor,
    name,
    placeholder,
    defaultValue,
    label,
    disabled = false,
}: {
    htmlFor: string;
    name: string;
    placeholder: string;
    defaultValue: string;
    label: string;
    disabled?: boolean;
}) => {
    return (
        <div className="space-y-3">
            <Label htmlFor={htmlFor}>{label}</Label>
            <Input
                id={htmlFor}
                name={name}
                placeholder={placeholder}
                defaultValue={defaultValue}
                disabled={disabled}
            />
        </div>
    );
};
