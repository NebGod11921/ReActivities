import {type FieldValues, useController, type UseControllerProps} from "react-hook-form";
import {Box, debounce, List, ListItemButton, TextField, Typography} from "@mui/material";
import {useEffect, useMemo, useState} from "react";
import type {LocationIQSuggestion} from "../../../lib/types";
import axios from "axios";

type Props<T extends FieldValues> = {
    label: string
} & UseControllerProps<T>


export default function LocationInput<T extends FieldValues>(props: Props<T>) {
    const { field, fieldState } = useController({ ...props });
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestion] = useState<LocationIQSuggestion[]>([]);
    const [inputValue, setInputValue] = useState(field.value || '');



    useEffect(() => {
        if(field.value && typeof field.value === 'object') {
            setInputValue(field.value.venue || '');
        }else {
            setInputValue(field.value || '');
        }
    }, [field.value])



    const locationKey = import.meta.env.VITE_LOCATION_URL;
    const LocationURL = `https://api.locationiq.com/v1/autocomplete?key=${locationKey}&limit=5&dedupe=1`;

    const fetchSuggestions = useMemo(
        () =>
            debounce(async (query: string) => {
                if (!query || query.length < 3) {
                    setSuggestion([]);
                    return;
                }

                setLoading(true);
                try {
                    const res = await axios.get<LocationIQSuggestion[]>(
                        `${LocationURL}&q=${encodeURIComponent(query)}`
                    );
                    setSuggestion(res.data);
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            }, 500),
        [LocationURL]
    );

    const handleChange = (value: string) => {
        field.onChange(value);
        fetchSuggestions(value);
    };

    const handleSelect = (location: LocationIQSuggestion) => {
        const city = location.address.city || location.address.village || location.address.towns
        const venue = location.display_name
        const latitude = location.lat
        const longitude = location.lon

        setInputValue(venue);
        field.onChange({city, venue, latitude, longitude});
        setSuggestion([]);
    }


    return (
        <Box position="relative">
            <TextField
                {...props}
                {...field}
                onChange={(e) => handleChange(e.target.value)}
                fullWidth
                value={inputValue}
                variant="outlined"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
            />

            {loading && <Typography variant="body2">Loading...</Typography>}

            {suggestions.length > 0 && (
                <List
                    sx={{
                        position: "absolute",
                        zIndex: 10,
                        width: "100%",
                        bgcolor: "background.paper",
                        border: 1,
                        borderColor: "divider",
                        maxHeight: 250,
                        overflow: "auto",
                    }}
                >
                    {suggestions.map((s) => (
                        <ListItemButton
                            key={s.place_id}
                            onClick={() => handleSelect(s)}
                        >
                            {s.display_name}
                        </ListItemButton>
                    ))}
                </List>
            )}
        </Box>
    );
}
