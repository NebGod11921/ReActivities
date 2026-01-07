import { z } from "zod";
import { requiredString } from "../utils/utils";

export const registerSchema = z.object({
    email: z
        .string({
            error: 'Email is required',
        })
        .email('Invalid email address'),

    displayName: requiredString('Display name'),

    password: requiredString('Password'),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
