import axios, { AxiosResponse } from "axios";
import { backendApi } from "./commonApi";
import { QueryFunctionContext } from "@tanstack/react-query";
import { access } from "fs";

const instance = axios.create({
    baseURL: `${backendApi}/todos`,
    withCredentials: true,
});

// instance.interceptors.request.use(
//     (config) => {
//         const accessToken = localStorage.getItem('accessToken');
//         // console.log("access token 유무 확인 : ", accessToken);

//         if (accessToken) {
//             config.headers.Authorization = `Bearer ${accessToken}`;
//         }
//         return config;
//     },
//     (error) => {
//         alert("여기서 막았나?")
//         return Promise.reject(error);
//     }
// );

export const apiForGetAllTodoList = ({ queryKey }: QueryFunctionContext) => {
    const [_, pageNum] = queryKey;

    // console.log("pageNum : ", pageNum);

    return instance
        .get('', {
            params: { pageNum: pageNum },
        })
        .then((response) => {
            return response.data;
        });
};

interface dtoForSaveTodos {
    id: any,
    email: string;
    todo: string;
    status: string;
    startTime: string;
    deadline: string;
}

export const apiForSaveTodoRows = ({ todoRowsForSave }: any) => {
    console.log("todoForSave ( at api ) : ", todoRowsForSave);

    return instance.post(
        'saveTodos', todoRowsForSave
    ).then((response: any) => response.data)
}