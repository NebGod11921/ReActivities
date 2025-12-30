import {type FieldValues, useController, type UseControllerProps } from 'react-hook-form'
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import type { SelectProps } from "@mui/material/Select";

type Props<T extends FieldValues> = {
    items: { text: string; value: string }[];
    label: string;
} & UseControllerProps<T>
    & Omit<SelectProps, 'value' | 'onChange' | 'defaultValue'>;

export default function SelectInput<T extends FieldValues>({
                                                               items,
                                                               label,
                                                               ...controllerProps
                                                           }: Props<T>) {
    const { field, fieldState } = useController(controllerProps);

    return (
        <FormControl fullWidth error={!!fieldState.error}>
            <InputLabel>{label}</InputLabel>

            <Select {...field} label={label} value={field.value ?? ''}>
                {items.map(({ text, value }) => (
                    <MenuItem key={value} value={value}>
                        {text}
                    </MenuItem>
                ))}
            </Select>

            <FormHelperText>{fieldState.error?.message}</FormHelperText>
        </FormControl>
    );
}
