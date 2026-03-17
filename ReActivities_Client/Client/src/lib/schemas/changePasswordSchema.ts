import {z} from "zod";
import {requiredString} from "../utils/utils.tsx";

export const ChangePasswordSchema = z.object({
    currentPassword: requiredString('currentPassword'),
    newPassword: requiredString('newPassword'),
    confirmPassword: requiredString('confirmPassword')
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Password must watch',
    path: ['confirmPassword'],
})

export type ChangePasswordSchema = z.infer<typeof ChangePasswordSchema>;