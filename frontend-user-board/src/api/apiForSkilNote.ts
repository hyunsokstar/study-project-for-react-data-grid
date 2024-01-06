import axios, { AxiosResponse } from "axios";
import { backendApi } from "./commonApi";
import { QueryFunctionContext } from "@tanstack/react-query";
import { access } from "fs";
import { log } from "console";
import { SkillNoteListResponse, SkillNoteRow, dataForCreateSkilNoteContent, dataForUpdateSkilNoteContent, skilnoteRowToSave } from "@/types/typeForSkilNote";

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

// todo
// /${skilnoteId}/contents/${pageNum}
// 함수 이름: apiForCreateSkilNoteContent
// 서버로 보내야할 데이터: skilNoteId, pageNum, title, file, content
// with ts
export const apiForCreateSkilNoteContent = async (data: dataForCreateSkilNoteContent) => {

    const skilNoteId = data.skilNoteId
    const pageNum = data.pageNum

    console.log("data : ", data);

    try {
        const response = await instance.post(`/${skilNoteId}/contents/${pageNum}`, { title: data.title, file: data.file, content: data.content });
        return response.data;
    } catch (error) {
        console.log("error : ", error);
        throw error
    }
};



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

export const apiForGetSkilNoteContentListForSkilNoteId = async ({ queryKey }: QueryFunctionContext) => {
    const [queryName, skilNoteId, pageNum] = queryKey;

    if (!skilNoteId || !pageNum) {
        throw new Error('SkilNoteId나 pageNum이 올바르지 않습니다.');
    }

    try {
        const response = await instance.get(`/${skilNoteId}/contents/${pageNum}`); // 이 부분 수정
        return response.data;
    } catch (error) {
        throw new Error(`Skill notes를 불러오는 중 오류가 발생했습니다: ${error}`);
    }
}

// 
export const apiForSaveSkilNotes = (skilnoteDataToSave: SkillNoteRow[]) => {
    console.log("skilnoteDataToSave at api : ", skilnoteDataToSave);
    return instance.post(
        'saveRows', skilnoteDataToSave
    ).then((response: any) => response.data)
}

// http://127.0.0.1:8080/skilnotes/10/contents
interface parameterTypeForUpdateSkilNoteContents {
    id: string;
    order: string;
}

export const apiForUpdateSkilNoteContentsOrder = (
    orderInfoArray: parameterTypeForUpdateSkilNoteContents[]
) => {
    console.log("hi");
    return instance.put(
        'contents/reorder', orderInfoArray
    )
}

export const apiForUpdateSkilNoteContent = async (data: dataForUpdateSkilNoteContent) => {
    const skilNoteContentId = data.skilNoteContentId;
    console.log("data : ", data);

    try {
        const response = await instance.put(`/content/${skilNoteContentId}`, { title: data.title, file: data.file, content: data.content });
        return response.data;
    } catch (error) {
        console.log("error : ", error);
        throw error
    }

};
