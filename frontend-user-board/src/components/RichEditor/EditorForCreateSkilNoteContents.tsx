import React, { useEffect, useState } from "react";
import { Box, Button, Grid, HStack, Input, Text, VStack } from '@chakra-ui/react';
import TinyMCEEditor from "./TinyMCEEditor";
import { useForm } from "react-hook-form";
import useApiForCreateSkilNoteContent from "@/hooks/useApiForCreateSkilNoteContent";

type Props = {
    skilNoteId: any,
    pageNum: any;
}

type FormData = {
    title: string;
    file: string;
};


// 1122
const EditorForCreateSkilNoteContents = ({ skilNoteId, pageNum }: Props) => {

    const mutationForCreateSkilNoteContent = useApiForCreateSkilNoteContent(skilNoteId, pageNum); // 훅 사용

    const [note_content, set_note_content] =
        useState<string>("");

    const handleContentChange = (value: string) => {
        set_note_content(value);
    };


    const { register, handleSubmit, reset } = useForm<any>();

    const onSubmit = (data: FormData) => {
        console.log(data);
        console.log("note_content : ", note_content);

        const data_for_create_note_content = {
            skilNoteId,
            pageNum,
            title: data.title,
            file: data.file,
            content: note_content
        }

        mutationForCreateSkilNoteContent.mutate(data_for_create_note_content);
        reset()
        set_note_content("")

    };

    return (
        <>
            <Box borderWidth="1px" borderRadius="lg" overflow="hidden" display={"flex"} flexDirection={"column"} gap={2} key="editorForCreateSkilNoteContents">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box p={2} border={"2px solid blue"} height={"100%"}>
                        <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={2} mb={2}>
                            <Text>
                                <Button variant={"outlined"} size={"md"} border={"1px"}>
                                    C
                                </Button>
                            </Text>
                            <Input {...register("title")} placeholder="Title" />

                            <Input
                                {...register("file")}
                                placeholder="file name"
                            />
                        </Box>

                        <Box
                            border={"1px dotted black"}
                            height={"100%"}
                        >
                            <TinyMCEEditor
                                initialValue={note_content}
                                onChange={handleContentChange}
                                apiKey="mj1ss81rnxfcig1ol8gp6j8oui9jpkp61hw3m901pbt14ei1"
                            />
                        </Box>
                        <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={2} mt={2.5}>
                            <Button variant="outline" width="100%" type="submit">
                                Submit
                            </Button>
                            <Button variant={"outline"} width={"100%"}>Initialize</Button>
                        </Box>
                    </Box>
                </form>

            </Box>
        </>
    )
}

export default EditorForCreateSkilNoteContents