import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const Dropdown = ({ id, value, onChange, options, placeholder, disabled = false }) => {
    return (
        <Select value={value} onValueChange={onChange} disabled={disabled}>
            <SelectTrigger id={id}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} >{opt.label}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

export default Dropdown;