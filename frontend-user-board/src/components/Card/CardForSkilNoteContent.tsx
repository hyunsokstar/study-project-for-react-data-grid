import React from 'react'
import { Box, Button, Grid, HStack, Input, Text, VStack } from '@chakra-ui/react';
import { SkilNoteContentsRow } from '@/types/typeForSkilNoteContents';

type Props = {
    skilNoteId?: any;
    order: number;
    noteObj?: SkilNoteContentsRow;
}

const CardForSkilNoteContent = ({ noteObj, skilNoteId, order }: Props) => {

    console.log("noteObj ? ", noteObj);


    return (
        <>
            {noteObj ?
                <Box
                    key={noteObj.id}
                    borderWidth="1px"
                    borderRadius="lg"
                    overflow="hidden"
                    display={"flex"}
                    flexDirection={"column"}
                    gap={2}
                >
                    <Box p={3} border={"2px solid blue"}>
                        <HStack fontSize="xl" mb={2} border={"1px solid black"}>
                            <Text>
                                <Button variant={"outlined"} size={"md"} border={"1px"}>
                                    {order}
                                </Button>
                            </Text>
                            <Input defaultValue={noteObj.title} />
                            <Input defaultValue={noteObj.file} />
                        </HStack>

                        <Box
                            border={"1px dotted black"}
                            overflowY={"scroll"}
                            height={"70vh"}
                        >
                            {noteObj.content}
                        </Box>
                    </Box>

                </Box>
                : ""}
        </>
    )
}

export default CardForSkilNoteContent