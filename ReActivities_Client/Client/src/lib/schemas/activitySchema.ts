
import {z} from 'zod';
import {requiredString} from "../utils/utils.tsx";




export const activitySchema = z.object({
    title: requiredString('Title'),
    description: requiredString('Description'),
    category: requiredString('Category'),
    date: z.coerce.date(),
    // city: requiredString('City'),
    // venue: requiredString('Venue'),
    location: z.object({
        venue: requiredString("Venue"),
        city: z.string().optional(),
        latitude: z.number(),
        longitude: z.number(),
    }).refine(val => val !== null, {
        message: "Please select a location from the suggestions",
        }
    ),

})

export type ActivitySchema = z.infer<typeof activitySchema>;