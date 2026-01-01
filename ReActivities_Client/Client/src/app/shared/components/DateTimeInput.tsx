import { type FieldValues, useController, type UseControllerProps } from "react-hook-form";
import type { TextFieldProps } from "@mui/material";
import { DateTimePicker, type DateTimePickerProps } from "@mui/x-date-pickers";

type Props<T extends FieldValues> =
    UseControllerProps<T> &
    Omit<DateTimePickerProps, "value" | "onChange"> & {
    textFieldProps?: TextFieldProps;
};

export default function DateTimeInput<T extends FieldValues>({
                                                                 textFieldProps,
                                                                 ...controllerProps
                                                             }: Props<T>) {
    const { field, fieldState } = useController(controllerProps);

    return (
        <DateTimePicker
            value={field.value ? new Date(field.value) : null}
            onChange={(value) => {
                // 🔥 THE FIX
                field.onChange(value ? new Date(value) : null);
            }}
            sx={{ width: "100%" }}
            slotProps={{
                textField: {
                    ...textFieldProps,
                    onBlur: field.onBlur,
                    error: !!fieldState.error,
                    helperText: fieldState.error?.message,
                },
            }}
        />
    );
}
