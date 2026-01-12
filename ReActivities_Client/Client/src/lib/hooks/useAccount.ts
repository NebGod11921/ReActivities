import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {LoginSchema} from "../schemas/loginSchema.ts"
import agent from "../api/agent.ts";
import {useLocation, useNavigate} from "react-router";
import type {RegisterSchema} from "../schemas/registerSchema.ts";
import {toast} from "react-toastify";


export const useAccount = () => {
    const queryClient = useQueryClient();
    const location = useLocation();
    const navigate = useNavigate();
    const loginUser = useMutation({
        mutationFn: async (creds: LoginSchema) => {
            await agent.post('/login?useCookies=true', creds);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['user']
            });

        }
    });

    const registerUser = useMutation({
        mutationFn: async (creds: RegisterSchema)=> {
            await agent.post('Account/register',creds);
        },
        onSuccess: () => {
            toast.success('Register successful - you can now login');
            navigate('/login')
        }
    })


    const logoutUser = useMutation({
        mutationFn: async () => {
            await agent.post('/Account/logout')
        },
        onSuccess: () => {
            queryClient.removeQueries({queryKey: ['user']})
            queryClient.removeQueries({queryKey: ['activities']})
            navigate('/');
        },

    })


    const {data: currentUser, isLoading: loadingUserInfo} = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const response = await agent.get<User>('/Account/user-info')
            return response.data;
        },
        enabled: !queryClient.getQueryData(['user']) && location.pathname !== 'login'
        && location.pathname !== '/register',

    })



    return {
        loginUser,
        currentUser,
        logoutUser,
        loadingUserInfo,
        registerUser
    }
}