import { Password } from "@mui/icons-material";
import {ChangePasswordSchema} from "../../lib/schemas/changePasswordSchema.ts";
import AccountFormWrapper from "./AccountFormWrapper.tsx";
import {zodResolver} from "@hookform/resolvers/zod";
import TextInput from "../../app/shared/components/TextInput.tsx";
import {useAccount} from "../../lib/hooks/useAccount.ts";
import {toast} from "react-toastify";

export default function ChangePasswordForm() {
    const {changePassword} = useAccount();
    const onSubmit = async (data: ChangePasswordSchema) => {
        try {
            await changePassword.mutateAsync(data, {
                onSuccess: () => toast.success("Password changed successfully."),
            });
        }catch (error) {
            console.log(error);
        }
    }


    return (
        <AccountFormWrapper <ChangePasswordSchema>
            title='Change Password'
            icon={<Password fontSize="large"/>}
            onSubmit={onSubmit}
            submitButtonText="Update password"
            resolver={zodResolver(ChangePasswordSchema)}
            reset={true}

        >
            <TextInput type='password' label='Current Password' name="currentPassword"></TextInput>
            <TextInput type='password' label='New Password' name="newPassword"></TextInput>
            <TextInput type='password' label='Confirm Password' name="confirmPassword"></TextInput>
        </AccountFormWrapper>
    )
}
