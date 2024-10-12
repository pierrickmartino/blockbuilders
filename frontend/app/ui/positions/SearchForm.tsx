import { ChangeEvent, useCallback } from "react";
import { useForm } from "react-hook-form";
import { debounce } from "lodash";
import { TextField } from "@mui/material";

// Define the type of the props (onSearch)
interface SearchFormProps {
    onSearch: (searchTerm: string) => void;
  }

export const SearchForm = ({ onSearch }: SearchFormProps) => {
    const { register } = useForm();

    const handleSearch = useCallback(
        debounce((searchTerm: string) => {
            onSearch(searchTerm);
        }, 300), // Debounce for 300 milliseconds
        [onSearch]
    );

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const searchTerm = event.target.value;
        handleSearch(searchTerm);
    };

    return (
        <TextField
                id="search"
                label="Search"
                variant="standard"
                // error={!!state.errors?.address}
                // helperText={state.errors?.address?.[0]}
                {...register("search", {
                    onChange: (e) => handleChange(e),
                })}
            />
        
    );
};