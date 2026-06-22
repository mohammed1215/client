import { useEffect, useState } from "react";
import type { SearchQueryDto, SearchTypes } from "../pages/BoardInfo";
import { useDebounce } from "use-debounce";
import { useMutation } from "@tanstack/react-query";
import type { SearchResponse } from "../pages/Search";
import { axiosInstance, searchEndpoints } from "../api/api";

export const useSearch = () => {
    const [text, setText] = useState("");
    const [type, setType] = useState<SearchTypes>("ALL");
    const [debouncedValue] = useDebounce(text, 500);

    const searchMutation = useMutation({
        mutationKey: ["search"],
        mutationFn: async (formData: SearchQueryDto) => {
            return (
                await axiosInstance.get<SearchResponse>(
                    searchEndpoints.search,
                    { params: formData },
                )
            ).data;
        },
        onSuccess(data) {
            console.log(data);
        },
    });

    useEffect(() => {
        if (debouncedValue) {
            searchMutation.mutate({
                q: text,
                type,
                workspaceId: undefined,
                limit: undefined,
                page: undefined,
            });
            console.log("Searching for:", debouncedValue);
        }
    }, [debouncedValue]);

    return {
        text,
        setText,
        type,
        setType,
        results: searchMutation.data?.results,
        isSearching: searchMutation.isPending,
        isSuccess: searchMutation.isSuccess,
    };
};
