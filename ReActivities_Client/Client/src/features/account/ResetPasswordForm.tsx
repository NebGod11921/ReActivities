import {useNavigate,  useSearchParams} from "react-router";
import {useAccount} from "../../lib/hooks/useAccount.ts";
import {Typography} from "@mui/material";
import {ResetPasswordSchema} from "../../lib/schemas/resetPasswordSchema.ts";
import {toast} from "react-toastify";
import AccountFormWrapper from "./AccountFormWrapper.tsx";
import {zodResolver} from "@hookform/resolvers/zod";
import { LockOpen } from "@mui/icons-material";
import TextInput from "../../app/shared/components/TextInput.tsx";


export default function ResetPasswordForm() {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const {resetPassword} = useAccount();
    const email = params.get('email');
    const code = params.get('code');

    // const decodedCode = code ? code.replace(/ /g, '+') : null;


    if(!email || !code) return <Typography>Invalid reset password code</Typography>;


    const onSubmit = async(data: ResetPasswordSchema)=> {
        try {
            await resetPassword.mutateAsync({email, resetCode: code, newPassword: data.newPassword}, {
                onSuccess: () => {
                    toast.success('Password reset successfully - you can now sign in');
                    navigate('/login');
                }
            })
        }catch (error) {
            console.log(error);
        }
    }

    return (
        <AccountFormWrapper<ResetPasswordSchema>
            title='Reset Your Password'
            submitButtonText='Reset Password'
            onSubmit={onSubmit}
            resolver={zodResolver(ResetPasswordSchema)}
            icon={<LockOpen fontSize='large'></LockOpen>}


        >
        <TextInput label='New Password' type="password" name="newPassword"></TextInput>
        <TextInput label='Confirm Password' type="password" name="confirmPassword"></TextInput>

        </AccountFormWrapper>


    )
}
