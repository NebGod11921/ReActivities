import { Check } from "@mui/icons-material";
import {useAccount} from "../../lib/hooks/useAccount.ts";
import {Button, Paper, Typography} from "@mui/material";

type Props = {
    email?: string,

}



export default function RegisterSuccess({email}: Props  ) {
    const {resendConfirmationEmail} = useAccount();

    if(!email) return null;

    return (
        <>
            <Paper sx={{height: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pt: 6}}>
                <Check sx={{fontSize: 100,color: "primary"}}></Check>
                <Typography variant="h3"  gutterBottom>You have successfully registered!</Typography>
                <Typography variant="h3"  gutterBottom>Please check your email to confirm your email</Typography>
                <Button fullWidth onClick={() => resendConfirmationEmail.mutate(email)}>Re-send Confirmation Email</Button>
            </Paper>
        </>

    )
}
