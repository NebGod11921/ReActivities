import {keepPreviousData, useInfiniteQuery, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import agent from "../api/agent.ts";
import {useLocation} from "react-router";
import {useAccount} from "./useAccount.ts";
import {useStore} from "./useStore.ts";

import type {FieldValues} from "react-hook-form";

//optional
export const useActivities = (id?: string) => {
    const queryClient = useQueryClient();
    const location = useLocation();
    const {currentUser} = useAccount();
    const {activityStore: {filter, startDate}} = useStore();

    const {
        data: activitiesGroup,
        isLoading,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage
    } = useInfiniteQuery<PagedList<Activity, string>>({
        queryKey: ['activities', filter, startDate],
        queryFn: async ({pageParam = null}) => {
            const response = await agent.get<PagedList<Activity, string>>('/Activities', {
                params: {
                    cursor: pageParam,
                    pageSize: 3,
                    filter,
                    startDate,
                }
            });
            console.log(response.data)
            return response.data;
        },
        staleTime: 1000 * 60 * 5,
        placeholderData: keepPreviousData,
        initialPageParam: null,
        getNextPageParam: (lastPage) => lastPage.nextCursor,


        enabled: !id && location.pathname === '/activities' && !!currentUser,
        select: data => ({
            ...data,
            pages: data.pages.map((page) => ({
                ...page,
                items: page.items.map(activity => {
                    const host = activity.activityAttendees.find(x => x.id === activity.hostId);
                    return {
                        ...activity,
                        isHost: currentUser?.id === activity.hostId,
                        isGoing: activity.activityAttendees.some(x => x.id === currentUser?.id),
                        hostImageUrl: host?.imageUrl,
                    }
                })
            }))
        })
    });

    // const {data: activity, isLoading: isLoadingActivity} = useQuery({
    //     queryKey: ['activity', id],
    //     queryFn: async () =>{
    //         const response = await agent.get<Activity>(`/Activities/${id}`);
    //         return response.data;
    //     },
    //     enabled: !!id && !!currentUser,
    //     select: data => {
    //         const host = data.activityAttendees.find(x => x.id === data.hostId);
    //         return {
    //             ...data,
    //             isHost: currentUser?.id === data.hostId,
    //             isGoing: data.activityAttendees.some(x => x.id === currentUser?.id),
    //             hostImageUrl: host?.imageUrl
    //         }
    //     }
    //
    // })
    const {isLoading: isLoadingActivity, data: activity} = useQuery<Activity>({


        queryKey: ['activities', id, currentUser?.id],
        queryFn: async () => {
            const response = await agent.get<Activity>(`/Activities/${id}`);
            return response.data;
        },
        enabled: !!id && !!currentUser,
        select: data => {
            const host = data.activityAttendees.find(x => x.id === data.hostId);


            return {
                ...data,
                isHost: currentUser?.id === data.hostId,
                isGoing: data.activityAttendees.some(x => x.id === currentUser?.id),
                hostImageUrl: host?.imageUrl
            }
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
        mutationFn: async (activity: FieldValues) => {
            const response = await agent.post(`/Activities/`, activity);
            return response.data;
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


    const updateAttendance = useMutation({
        mutationFn: async (id: string) => {

            await agent.post(`/Activities/${id}/attend`);
        },
        onMutate: async (activityId: string) => {
            await queryClient.cancelQueries({queryKey: ['activities', activityId]});
            const preActivity = queryClient.getQueryData<Activity>(['activities', activityId]);
            queryClient.setQueryData<Activity>(['activities', activityId], oldActivity => {
                if (!oldActivity || !currentUser) {
                    return oldActivity;
                }

                const isHost = oldActivity.hostId === currentUser.id;
                const isAttending = oldActivity.activityAttendees.some(x => x.id === currentUser.id);

                return {
                    ...oldActivity,
                    isCancelled: isHost ? !oldActivity.isCancelled : oldActivity.isCancelled,
                    activityAttendees: isAttending
                        ? isHost
                            ? oldActivity.activityAttendees
                            : oldActivity.activityAttendees.filter(x => x.id !== currentUser.id)
                        : [...oldActivity.activityAttendees, {
                            id: currentUser.id,
                            displayName: currentUser.displayName,
                            imageUrl: currentUser.imageUrl
                        }]
                }

            })
            return {preActivity};
        },
        onError: (error, activityId, context) => {

            console.log(error);
            if (context?.preActivity) {
                queryClient.setQueryData(['activities', activityId], context.preActivity)
            }
        }

    })


    return {
        activitiesGroup, isLoading, updateActivity, createActivity, deleteActivity,
        isLoadingActivity, activity, updateAttendance,
        fetchNextPage, hasNextPage, isFetchingNextPage
    };

}