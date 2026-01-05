import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {LoginSchema} from "../schemas/loginSchema.ts"
import agent from "../api/agent.ts";
import type {User} from "../types";
import {useNavigate} from "react-router";


export const useAccount = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const loginUser = useMutation({
        mutationFn: async (creds: LoginSchema) => {
            await agent.post('/login?useCookies=true', creds);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['user']
            });
            await navigate('/Activities')
        }
    });

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


    const {data: currentUser} = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const response = await agent.get<User>('/Account/user-info')
            return response.data;
        },
        enabled: !queryClient.getQueryData(['user'])
    })



    return {
        loginUser,
        currentUser,
        logoutUser
    }
}