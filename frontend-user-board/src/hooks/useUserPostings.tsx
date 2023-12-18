import { apiForGetAllUserPostings } from "@/api/apiForPosting";
import { IResponseTypeForUserPostings } from "@/types/typeForPostings";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";


const useUserPostings = (userId: string, pageNum: number) => {

    console.log("userId at api : ", userId);


    const { isLoading, error, data: dataForUserPosting } = useQuery<any>({
        queryKey: ['userPostings', userId, pageNum],
        queryFn: apiForGetAllUserPostings,
    });

    return { isLoading, error, dataForUserPosting };

};

export default useUserPostings;
