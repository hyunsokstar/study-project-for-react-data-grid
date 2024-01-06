import React, { useEffect, useState } from "react";
import { Box, Button, Grid, HStack, Input, Text } from '@chakra-ui/react';
import TinyMCEEditor from "./TinyMCEEditor";
import { useForm } from "react-hook-form";
import useApiForCreateSkilNoteContent from "@/hooks/useApiForCreateSkilNoteContent";

type Props = {
    skilNoteContentId: any;
    title?: string;
    file?: string;
    content?: string
}

type FormData = {
    title: string;
    file: string;
};


const EditorForUpdateSkilNotes = ({ skilNoteContentId, title, file, content }: Props) => {
    // const mutationForCreateSkilNoteContent = useApiForCreateSkilNoteContent(skilNoteContentId);

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
            title: data.title,
            file: data.file,
            content: note_content
        }

        // mutationForCreateSkilNoteContent.mutate(data_for_create_note_content);
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
                            <Input {...register("title")}
                                placeholder="Title"
                                defaultValue={title}
                            />

                            <Input
                                {...register("file")}
                                placeholder="file name"
                                defaultValue={file}
                            />
                        </Box>

                        <Box
                            border={"1px dotted black"}
                            height={"100%"}
                        >
                            <TinyMCEEditor
                                initialValue={content}
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

export default EditorForUpdateSkilNotes