import axios, { AxiosResponse } from "axios";
import { backendApi } from "./commonApi";
import { QueryFunctionContext } from "@tanstack/react-query";

const instance = axios.create({
    baseURL: `${backendApi}/postings`,
    withCredentials: true,
});

export const apiForGetAllUserPostings = ({ queryKey }: QueryFunctionContext) => {
    const [_, userId, pageNum] = queryKey;

    console.log("userId at api function : ", userId);


    return instance
        .get(`user/${userId}`, {
            params: { pageNum: pageNum },
        })
        .then((response) => {
            return response.data;
        });
};
