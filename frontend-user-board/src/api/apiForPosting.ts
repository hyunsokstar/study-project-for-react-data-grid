import axios, { AxiosResponse } from "axios";
import { backendApi } from "./commonApi";
import { QueryFunctionContext } from "@tanstack/react-query";

const instance = axios.create({
    baseURL: `${backendApi}/postings`,
    withCredentials: true,
});

export const apiForGetAllUserPostings = ({ queryKey }: QueryFunctionContext) => {
    const [userId, pageNum] = queryKey;

    return instance
        .get(`postings/user/${userId}`, {
            params: { pageNum: pageNum },
        })
        .then((response) => {
            return response.data;
        });
};
