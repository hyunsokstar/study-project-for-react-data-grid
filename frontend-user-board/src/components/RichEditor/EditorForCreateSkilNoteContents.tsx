import React, { useEffect, useState } from "react";
import { Box, Button, Grid, HStack, Input, Text, VStack } from '@chakra-ui/react';
import TinyMCEEditor from "./TinyMCEEditor";

type Props = {}

const EditorForCreateSkilNoteContents = (props: Props) => {

    const [note_content_content, set_note_content_content] =
        useState<string>("");

    const handleContentChange = (value: string) => {
        set_note_content_content(value);
    };

    return (
        <>
            <Box borderWidth="1px" borderRadius="lg" overflow="hidden" display={"flex"} flexDirection={"column"} gap={2}>
                <Box p={3} border={"2px solid blue"}>
                    <HStack fontSize="xl" mb={2} border={"1px solid black"}>
                        <Text>
                            <Button variant={"outlined"} size={"md"} border={"1px"}>
                                C
                            </Button>
                        </Text>
                        <Input defaultValue={""} />
                        <Input defaultValue={""} />
                    </HStack>

                    <Box
                        border={"1px dotted black"}
                        overflowY={"scroll"}
                        height={"60vh"}
                    >
                        <TinyMCEEditor
                            initialValue={note_content_content}
                            onChange={handleContentChange}
                            apiKey="mj1ss81rnxfcig1ol8gp6j8oui9jpkp61hw3m901pbt14ei1"
                        />
                    </Box>
                </Box>

            </Box>
        </>
    )
}

export default EditorForCreateSkilNoteContents