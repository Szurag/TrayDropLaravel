import { useEffect, useState } from "react";

export const useDebounceEffect = (value, ms) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, ms);

        return () => {
            clearTimeout(handler);
        };
    }, [value, ms]);

    return debouncedValue;
};
