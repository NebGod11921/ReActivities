import {useAccount} from "../../lib/hooks/useAccount.ts";
import type {FieldValues} from "react-hook-form";
import {toast} from "react-toastify";
import {useNavigate} from "react-router";
import AccountFormWrapper from "./AccountFormWrapper.tsx";
import { LockOpen } from "@mui/icons-material";
import TextInput from "../../app/shared/components/TextInput.tsx";


export default function ForgotPasswordForm() {
    const {forgotPassword} = useAccount();
    const nav  = useNavigate();
    const obSubmit = async (data: FieldValues) =>{

        try {
            await forgotPassword.mutateAsync(data.email, {
                onSuccess: () => {
                    toast.success('Password reset requested - please check your email');
                    nav('/login')
                }
            })
        }catch (error) {
            console.log(error);
        }
    }

    return (
        <AccountFormWrapper
            title="Please enter your email address"
            icon={<LockOpen fontSize="large"/>}
            onSubmit={obSubmit}
            submitButtonText="Request password reset link"

        >
            <TextInput rules={{required: true}} label='Email address' name='email' ></TextInput>
        </AccountFormWrapper>
    )
}
