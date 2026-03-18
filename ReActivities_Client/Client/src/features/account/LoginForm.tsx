import { useForm } from "react-hook-form";
import {useAccount} from "../../lib/hooks/useAccount.ts";
import {LoginSchema} from "../../lib/schemas/loginSchema.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {Box, Button, Paper, Typography} from "@mui/material";
import {GitHub, LockOpen } from "@mui/icons-material";
import TextInput from "../../app/shared/components/TextInput.tsx";
import {Link, useLocation, useNavigate} from "react-router";
import {useState} from "react";
import {toast} from "react-toastify";

export default function LoginForm() {
    const [notVerified, setNotVerified] = useState(false);
    const {loginUser, resendConfirmationEmail} =useAccount();
    const nav = useNavigate();
    const location = useLocation();
    const {control, watch, handleSubmit, formState: {isValid, isSubmitting}} = useForm<LoginSchema>({
        mode: 'onTouched',
        resolver: zodResolver(LoginSchema)
    });

    const email = watch('email')

    const handleResendEmail = async () => {
        try {
            await resendConfirmationEmail.mutateAsync({email});
            setNotVerified(false);
        }catch (error) {
            toast.error('Problem sending email - please check email address' + error);
        }

    }



    const loginWithGitHub = () => {
        const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
        const redirectUrl = import.meta.env.VITE_REDIRECT_URI;
        window.location.href =
            `https://github.com/login/oauth/authorize?client_id=${clientId}&redirectUri=${redirectUrl}&scope=read:user user:email`
    }


    const onSubmit = async (data: LoginSchema) => {
        await loginUser.mutateAsync(data, {
            onSuccess: () => {
                nav(location.state?.from || '/activities')
            },
            onError: error => {
                if(error.message === 'NotAllowed') {
                    setNotVerified(true);
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
                <Typography variant='h4'>Sign in</Typography>
            </Box>
            <TextInput label='Email' name='email' control= {control}></TextInput>
            <TextInput label='Password' type='password' name='password' control={control}></TextInput>
            <Button type='submit' disabled={!isValid || isSubmitting} variant='contained' size='large'>
                Login
            </Button>
            <Button onClick={loginWithGitHub}
                    startIcon={<GitHub></GitHub>}
                    sx={{backgroundColor: 'black'}}
                    type="button"
                    variant='contained'
                    size='large'


            >
                Login with GitHub
            </Button>
            {notVerified ? (
                <Box display='flex' flexDirection='column' justifyContent='center'>
                    <Typography textAlign='center' color='error'>
                        Your email has not been verified. You can click the button to re-send
                    </Typography>
                    <Button disabled={resendConfirmationEmail.isPending} onClick={handleResendEmail}>
                        Resend Email link
                    </Button>
                </Box>
            ) : (
                <Box display='flex' alignItems='center' justifyContent='center' gap={3}>
                    <Typography>
                        Forgot password? Click <Link to='/forgot-password'>here</Link>
                    </Typography>
                    <Typography sx={{textAlign: 'center'}}>
                        Don't have an account?
                        <Typography sx={{ml: 2}} component={Link} to={'/register'} color='primary'>
                            Sign up
                        </Typography>
                    </Typography>
                </Box>

            )}

        </Paper>
    )
}
