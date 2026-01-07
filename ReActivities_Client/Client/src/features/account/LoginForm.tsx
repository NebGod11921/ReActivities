import { useForm } from "react-hook-form";
import {useAccount} from "../../lib/hooks/useAccount.ts";
import {LoginSchema} from "../../lib/schemas/loginSchema.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {Box, Button, Paper, Typography} from "@mui/material";
import { LockOpen } from "@mui/icons-material";
import TextInput from "../../app/shared/components/TextInput.tsx";
import {Link, useLocation, useNavigate} from "react-router";

export default function LoginForm() {
    const {loginUser} =useAccount();
    const nav = useNavigate();
    const location = useLocation();
    const {control, handleSubmit, formState: {isValid, isSubmitting}} = useForm<LoginSchema>({
        mode: 'onTouched',
        resolver: zodResolver(LoginSchema)
    });

    const onSubmit = async (data: LoginSchema) => {
        await loginUser.mutateAsync(data, {
            onSuccess: () => {
                nav(location.state?.from || '/activities')
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
                <Typography variant='h4'>Sign in</Typography>
            </Box>
            <TextInput label='Email' name='email' control= {control}></TextInput>
            <TextInput label='Password' type='password' name='password' control={control}></TextInput>
            <Button type='submit' disabled={!isValid || isSubmitting} variant='contained' size='large'>
                Login
            </Button>
            <Typography sx={{textAlign: 'center'}}>
                Don't have an account?
                <Typography sx={{ml: 2}} component={Link} to={'/register'} color='primary'>
                     Sign up
                </Typography>
            </Typography>
        </Paper>
    )
}
