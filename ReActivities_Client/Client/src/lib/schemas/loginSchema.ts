import {z} from "zod";
import {requiredString} from "../utils/utils.tsx";


export const LoginSchema = z.object({
    email: requiredString("Email"),
    password: requiredString("Password"),
})

export type LoginSchema = z.infer<typeof LoginSchema>