import axios, { AxiosResponse } from "axios";
import { backendApi } from "./commonApi";
import { QueryFunctionContext } from "@tanstack/react-query";
import { access } from "fs";

const instance = axios.create({
    baseURL: `${backendApi}/technotes`,
    withCredentials: true,
});

export const apiForGetAllTechNoteList = ({ queryKey }: QueryFunctionContext) => {
    const [_, pageNum] = queryKey;

    // console.log("userId at api function : ", userId);

    return instance
        .get("", {
        })
        .then((response) => {
            return response.data;
        });

};