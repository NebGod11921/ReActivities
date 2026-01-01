import {Box, Button, Paper, Typography} from "@mui/material";
import {useActivities} from "../../../lib/hooks/useActivities.ts";
import {useNavigate, useParams} from "react-router";
import { useForm} from "react-hook-form";
import {useEffect} from "react";
import {activitySchema, type ActivitySchema} from "../../../lib/schemas/activitySchema.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import TextInput from "../../../app/shared/components/TextInput.tsx";
import SelectInput from "../../../app/shared/components/SelectInput.tsx";
import {categoryOptions} from "./CategoryOptions.tsx";
import DateTimeInput from "../../../app/shared/components/DateTimeInput.tsx";
import LocationInput from "../../../app/shared/components/LocationInput.tsx";





export default function ActivityForm() {
    const { reset, handleSubmit, control} = useForm<ActivitySchema>({
        mode: 'onTouched',
        resolver: zodResolver(activitySchema),


    });
    const navigate = useNavigate();
    const {id} = useParams();
    const {updateActivity, createActivity, activity, isLoadingActivity} = useActivities(id);
    // const navigate = useNavigate();
    useEffect(() => {
        if(activity) reset({
            ...activity,
            location: {
                city: activity.city,
                venue: activity.venue,
                latitude: activity.latitude,
                longitude: activity.longitude
            }
        }) ;
    }, [activity, reset]);


    const onSubmit= async  (data: ActivitySchema) => {
        const {location, ...rest} = data;
        const flattenedData = {...rest, ...location, };
        try {
            if(activity) {
                updateActivity.mutate(
                    { ...activity, ...flattenedData },
                    {
                        onSuccess: () => navigate(`/Activities/${activity.id}`),
                    }
                );
            } else {
                createActivity.mutate(flattenedData, {
                    onSuccess: (id) => navigate(`/Activities/${id}`),
                    onError: (err) => console.error(err),
                });
            }


        }catch (error) {
            console.log(error);
        }


    }
    if(isLoadingActivity) {
        return <Typography>Loading...</Typography>;
    }


//key value = name in textfield
    return (
        <Paper sx={{borderRadius: 3, padding: 3}}>
            <Typography variant="h5" gutterBottom color="primary">
                {activity ? 'Edit activity' : 'Create activity'}
            </Typography>
            <Box component='form' onSubmit={handleSubmit(
                (data) => {
                    console.log("FORM SUBMITTED", data);
                    onSubmit(data);
                },
                (errors) => {
                    console.log(" FORM BLOCKED BY VALIDATION", errors);
                }
            )} display='flex' flexDirection='column' gap={3}>

                <TextInput label="Title" control={control} name='title'></TextInput>
                <TextInput label="Description" control={control} name='description' multiline rows={3}></TextInput>
                <Box display='flex' gap={3}>
                    <SelectInput items={categoryOptions}
                                 label="Category" control={control} name='category'></SelectInput>
                    <DateTimeInput label="Date" control={control} name='date'></DateTimeInput>

                </Box>
                <LocationInput control={control} label="Enter the location" name='location'></LocationInput>








                {/*<TextField {...register('description')}  label='Description' defaultValue={activity?.description} multiline rows={3}> </TextField>*/}
                {/*<TextField {...register('category')} label='Category' defaultValue={activity?.category}></TextField>*/}
                {/*<TextField {...register('date')} label='Date' type='date'*/}
                {/*           defaultValue={activity?.date*/}
                {/*               ? new Date(activity.date).toLocaleDateString('en-CA')*/}
                {/*               : new Date().toLocaleDateString('en-CA')}></TextField>*/}
                {/*<TextField {...register('city')} label='City' defaultValue={activity?.city}></TextField>*/}
                {/*<TextField {...register('venue')} label='Venue' defaultValue={activity?.venue}></TextField>*/}
                <Box display='flex' justifyContent='end' gap={3}>
                        <Button onClick={() => {}} color='inherit'>Cancel</Button>
                        <Button type="submit" color='success' variant='contained'
                                disabled={updateActivity.isPending || createActivity.isPending}
                        >Submit</Button>
                </Box>
            </Box>
        </Paper>
    )
}
