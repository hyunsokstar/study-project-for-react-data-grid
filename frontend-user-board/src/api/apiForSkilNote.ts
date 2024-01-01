import axios, { AxiosResponse } from "axios";
import { backendApi } from "./commonApi";
import { QueryFunctionContext } from "@tanstack/react-query";
import { access } from "fs";
import { log } from "console";
import { SkillNoteListResponse } from "@/types/typeForSkilNote";

const instance = axios.create({
    baseURL: `${backendApi}/skilnotes`,
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

// todo: http://127.0.0.1:8080/skilnotes/byTechNoteId/16?page=1 로 요청하는 axios 요청 로직 추가 해줘
export const apiForGetSkillNotesByTechNoteId = async (techNoteId: number, page: number): Promise<SkillNoteListResponse> => {

    console.log("techNoteId, page : ", techNoteId, page);


    try {
        const response = await instance.get(`/byTechNoteId/${techNoteId}?pageNum=${page}`);
        return response.data;
    } catch (error) {
        throw new Error(`Skill notes를 불러오는 중 오류가 발생했습니다: ${error}`);
    }
};
