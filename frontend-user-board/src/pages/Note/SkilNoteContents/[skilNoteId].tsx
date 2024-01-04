import CardForSkilNoteContent from '@/components/Card/CardForSkilNoteContent';
import EditorForCreateSkilNoteContents from '@/components/RichEditor/EditorForCreateSkilNoteContents';
import useApiForGetSkilNoteContentsForSkilNoteId from '@/hooks/useApiForGetSkilNoteContentsForSkilNoteId';
import { Box, Button, Grid, HStack, Input, Text, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useRef } from 'react';

const SkilNoteContents = () => {
    const router = useRouter();
    const { skilNoteId } = router.query;
    const cardRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

    const { data: dataForskilNoteContent } = useApiForGetSkilNoteContentsForSkilNoteId(skilNoteId);

    const scrollToCard = (order: number) => {
        const selectedCard = cardRefs.current[order];
        if (selectedCard) {
            selectedCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const editorRef = useRef<HTMLDivElement | null>(null); // 참조 추가


    const scrollToEditor = () => {
        if (editorRef.current) {
            editorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const buttonsForScroll = dataForskilNoteContent?.skilnoteContents.map((row, i) => {
        return (<Button onClick={() => scrollToCard(i + 1)}>{i + 1}</Button>)
    })

    return (
        <Box>
            <Box border={"1px solid blue"} width={"100%"} m={"auto"} display={"flex"} gap={2} backgroundColor={"blue.50"}>
                <Text>title: {dataForskilNoteContent?.title}</Text>
                <Text>writer: {dataForskilNoteContent?.writer.email}</Text>
            </Box>
            <Box display={"flex"} border={"3px dotted black"} overflowY={"scroll"} height={"70vh"}>
                <Box flex={7} border={"0px dotted red"} >

                    <Box border="0px dashed red" p={2} display={"flex"} flexDirection={"column"} gap={2}>
                        {dataForskilNoteContent?.skilnoteContents.map((row) => (
                            <div data-order={row.order} key={row.id} ref={(ref) => (cardRefs.current[row.order] = ref)}>
                                <CardForSkilNoteContent key={row.id} noteObj={row} order={row.order} data-order={row.order} />
                            </div>
                        ))}
                        <Box border="0px dashed red" ref={editorRef} height={"68vh"} width={"100%"}>
                            <EditorForCreateSkilNoteContents />
                        </Box>
                    </Box>
                </Box>

                <Box flex={3} border={"0px dotted red"} position="sticky" top={0}>
                    <Grid templateColumns="1fr 5fr" gap={2} p={2}>
                        <Box display={"flex"} flexDirection={"column"} gap={2} border={"2px dotted purple"} textAlign={"center"}>
                            {buttonsForScroll}
                            <Box>
                                <Button onClick={scrollToEditor}>create</Button> {/* 에디터 영역으로 스크롤 */}
                            </Box>
                        </Box>

                        <Box border="1px dashed" borderColor="gray.300" p={2}>
                            <Text fontSize="xl" mb={4}>Right side</Text>
                            <Text>{skilNoteId}</Text>
                        </Box>
                    </Grid>
                </Box>
            </Box>
        </Box>
    );
};

export default SkilNoteContents;
