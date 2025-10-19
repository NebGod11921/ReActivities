import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

import agent from "../api/agent.ts";

export const useActivities = () => {
    const queryClient = useQueryClient();

    const {data: activities, isPending} = useQuery({
        queryKey: ['activities'],
        queryFn: async () =>
        {
            const response = await agent.get<Activity[]>('/Activities');
            return response.data;
        }
    });
    const updateActivity = useMutation({
        mutationFn: async (activity: Activity) => {
            await agent.put(`/Activities/`, activity);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['activities']
            });
        }
    })


    const createActivity = useMutation({
        mutationFn: async (activity: Activity) => {
            await agent.post(`/Activities/`, activity);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['activities']
            });
        }
    })

    const deleteActivity = useMutation({
        mutationFn: async (id: string) => {
            await agent.delete(`/Activities/${id}`);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['activities']
            });
        }
    })





    return {activities, isPending, updateActivity, createActivity,deleteActivity};

}