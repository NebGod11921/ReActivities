import { useForm } from "react-hook-form";
import {useAccount} from "../../lib/hooks/useAccount.ts";

import {zodResolver} from "@hookform/resolvers/zod";
import {Box, Button, Paper, Typography} from "@mui/material";
import { LockOpen } from "@mui/icons-material";
import TextInput from "../../app/shared/components/TextInput.tsx";
import {Link} from "react-router";
import {type RegisterSchema, registerSchema} from "../../lib/schemas/registerSchema.ts";

export default function RegisterForm() {
    const {registerUser} = useAccount();

    const {control, handleSubmit, setError, formState: {isValid, isSubmitting}} = useForm<RegisterSchema>({
        mode: 'onTouched',
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: '',
            displayName: '',
            password: '',
        },
    });

    const onSubmit = async (data: RegisterSchema) => {
        await registerUser.mutateAsync(data, {
            onError: (error) => {
                if(Array.isArray(error)) {
                    error.forEach(err => {
                        if(err.includes('Email')) setError('email', {message: err});
                        else if (err.includes('Password')) setError('password', {message: err})
                    })
                }
            }
        });
    }
    return (
        <Paper component='form' onSubmit={handleSubmit(onSubmit)} sx={{
            display: 'flex',
            flexDirection: 'column',
            p: 3,
            gap: 3,
            maxWidth: 'md',
            mx: 'auto',
            borderRadius: 3
        }}>
            <Box
                display='flex' alignItems='center' justifyContent='center' gap={3} color='secondarry.main'>
                <LockOpen fontSize='large'></LockOpen>
                <Typography variant='h4'>Register</Typography>
            </Box>
            <TextInput label='Email' name='email' control= {control}></TextInput>
            <TextInput label='Display name' type='text' name='displayName' control={control}></TextInput>
            <TextInput label='Password' type='password' name='password' control={control}></TextInput>
            <Button type='submit' disabled={!isValid || isSubmitting} variant='contained' size='large'>
                Register
            </Button>
            <Typography sx={{textAlign: 'center'}}>
                Already have an account?
                <Typography sx={{ml: 2}} component={Link} to={'/login'} color='primary'>
                    Sign in
                </Typography>
            </Typography>
        </Paper>
    )
}
