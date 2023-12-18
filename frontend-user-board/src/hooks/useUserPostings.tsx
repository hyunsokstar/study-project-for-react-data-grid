import { apiForGetAllUserPostings } from "@/api/apiForPosting";
import { IResponseTypeForUserPostings } from "@/types/typeForPostings";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";


const useUserPostings = (userId: string, pageNum: number) => {
    const { isLoading: isPending, error, data: dataForUserPosting } = useQuery<IResponseTypeForUserPostings>({
        queryKey: ['userPostings', userId, pageNum],
        queryFn: apiForGetAllUserPostings,
    });

    return { isLoading, error, dataForUserPosting: data };

};

export default useUserPostings;
