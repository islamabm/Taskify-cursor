import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { useQuery } from '@tanstack/react-query';
import { businessService } from '../services/businesses.service';
import { queryKeysService } from '../services/queryKeys.service';

interface AutoCompleteBusinessesProps {
    onSelectPartner: (partnerID: string, partnerName: string) => void;
    initialMarketName?: string;  // Optional initial market name
    initialHaatBussID?: number;   // Optional initial HaatBussID
}

const AutoCompleteBusinesses: React.FC<AutoCompleteBusinessesProps> = ({
    onSelectPartner,
    initialMarketName = "",
    initialHaatBussID = 0
}) => {
    const [searchTerm, setSearchTerm] = useState<string>(initialMarketName);
    const [selectedValue, setSelectedValue] = useState<any | null>(null);

    // Query for searching partners
    const partnersQuery = useQuery({
        queryKey: [queryKeysService.PARTNERS, searchTerm],
        queryFn: () => businessService.searchBusinesses(searchTerm),
        enabled: !!searchTerm,
    });

    useEffect(() => {
        // Set initial selected value if initial values are provided
        if (initialMarketName && initialHaatBussID) {
            setSelectedValue({
                HaatBussID: initialHaatBussID,
                marketName: initialMarketName
            });
        }
    }, [initialMarketName, initialHaatBussID]);

    const handleAutocompleteChange = (
        event: React.SyntheticEvent<Element, Event>,
        value: any | null
    ) => {
        if (value) {
            setSelectedValue(value);
            onSelectPartner(value.marketID.toString(), value.marketName);
        } else {
            setSelectedValue(null);
            onSelectPartner("", "");
        }
    };

    const handleInputChange = (
        event: React.SyntheticEvent<Element, Event>,
        value: string
    ) => {
        setSearchTerm(value);
    };


    return (
        <div className='w-[250px]'>
            <Autocomplete
                disablePortal
                options={partnersQuery.data || []}
                getOptionLabel={(option: any) => `${option.HaatBussID}: ${option.marketName}`}
                renderOption={(props, option: any) => (
                    <li {...props}>
                        {option.HaatBussID}: {option.marketName}
                    </li>
                )}
                isOptionEqualToValue={(option: any, value: any) => option.HaatBussID === value.HaatBussID}
                onChange={handleAutocompleteChange}
                onInputChange={handleInputChange}
                value={selectedValue} // Set initial selected value here
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Businesses"
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {partnersQuery.isLoading ? (
                                        <CircularProgress color="inherit" size={20} />
                                    ) : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}
                    />
                )}
            />
        </div>
    );
};

export default AutoCompleteBusinesses;
