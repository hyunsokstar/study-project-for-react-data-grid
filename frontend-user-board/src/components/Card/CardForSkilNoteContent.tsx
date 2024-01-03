import React from 'react'
import { Box, Grid, HStack, Input, Text, VStack } from '@chakra-ui/react';

type Props = {
    skilNoteId: any;
}

const CardForSkilNoteContent = ({ skilNoteId }: Props) => {
    return (
        <>
            <Box borderWidth="1px" borderRadius="lg" overflow="hidden" display={"flex"} flexDirection={"column"} gap={2}>
                <Box p={6} border={"2px solid blue"}>

                    <HStack fontSize="xl" mb={2} border={"1px solid black"}>
                        <Input defaultValue={""} />
                        <Input defaultValue={""} />
                    </HStack>

                    <Box
                        border={"1px dotted black"}
                        overflowY={"scroll"}
                        height={"50vh"}
                    >
                        hi <br />
                        hi2 <br />
                        hi3 <br />
                        hi4 <br />
                        hi5 <br />
                        hi6 <br />
                        hi7 <br />
                        hi <br />
                        hi <br />
                        hi <br />
                        hi <br />
                        hi <br />
                        hi <br />
                        {/* {skilNoteId} <br /> */}
                    </Box>
                </Box>

            </Box>
        </>
    )
}

export default CardForSkilNoteContent