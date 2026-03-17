import {z} from "zod";
import {requiredString} from "../utils/utils.tsx";

export const ResetPasswordSchema = z.object({
    newPassword: requiredString('newPassword'),
    confirmPassword: requiredString('confirmPassword')
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Password must watch',
    path: ['confirmPassword'],
})

export type ResetPasswordSchema = z.infer<typeof ResetPasswordSchema>;