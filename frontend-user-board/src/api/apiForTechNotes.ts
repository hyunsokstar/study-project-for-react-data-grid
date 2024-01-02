import axios, { AxiosResponse } from "axios";
import { backendApi } from "./commonApi";
import { QueryFunctionContext } from "@tanstack/react-query";
import { access } from "fs";

const instance = axios.create({
    baseURL: `${backendApi}/technotes`,
    withCredentials: true,
});

instance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        // console.log("access token 유무 확인 : ", accessToken);

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        alert("여기서 막았나?")
        return Promise.reject(error);
    }
);

export const apiForSaveTechNotes = (techNotesToSave: TechNote[]) => {
    console.log("techNotesToSave at api : ", techNotesToSave);
    return instance.post(
        'saveTechNotes', techNotesToSave
    ).then((response: any) => response.data)
}


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

export const apiForDeleteTechNotesForCheckedIds = (checkedIds: any[]): Promise<any> => {
    console.log('apiForDeleteTechNotesForCheckedIds check data:', checkedIds);

    return instance.delete(`deleteCheckedRows`, { data: { checkedIds } })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw error; // 에러를 그대로 던지기
        });
};