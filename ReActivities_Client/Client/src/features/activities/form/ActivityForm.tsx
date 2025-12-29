import {Box, Button, Paper, Typography} from "@mui/material";
import {useActivities} from "../../../lib/hooks/useActivities.ts";
import { useParams} from "react-router";
import { useForm} from "react-hook-form";
import {useEffect} from "react";
import {activitySchema, type ActivitySchema} from "../../../lib/schemas/activitySchema.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import TextInput from "../../../app/shared/components/TextInput.tsx";



export default function ActivityForm() {
    const { reset, handleSubmit, control} = useForm<ActivitySchema>({
        mode: 'onTouched',
        resolver: zodResolver(activitySchema)
    });
    const {id} = useParams();
    const {updateActivity, createActivity, activity, isLoadingActivity} = useActivities(id);
    // const navigate = useNavigate();
    useEffect(() => {
        if(activity) reset(activity) ;
    }, [activity, reset]);


    const onSubmit=  (data: ActivitySchema) => {
        // event.preventDefault();// prevent browser submission to cause page to reload and lose anything in data form

        // const formData = new FormData(event.currentTarget);
        //
        // const data: {[key: string]: FormDataEntryValue} = {};
        // formData.forEach((value, key) => {
        //     data[key] = value;
        // })

        // if (activity) {
        //     data.id = activity.id;
        //     await updateActivity.mutateAsync(data as unknown as Activity);
        //     navigate(`/activities/${activity.id}`);
        //
        // } else {
        //      createActivity.mutate(data as unknown as Activity, {
        //          onSuccess: (id) => {
        //              navigate(`/activities/${id}`);
        //          }
        //      });
        //
        // }
        console.log(data);



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
            <Box component='form' onSubmit={handleSubmit(onSubmit)} display='flex' flexDirection='column' gap={3}>

                <TextInput label="Title" control={control} name='title'></TextInput>
                <TextInput label="Description" control={control} name='description' multiline rows={3}></TextInput>
                <TextInput label="Category" control={control} name='category'></TextInput>
                <TextInput label="Date" control={control} name='date'></TextInput>
                <TextInput label="City" control={control} name='city'></TextInput>
                <TextInput label="Venue" control={control} name='venue'></TextInput>
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
