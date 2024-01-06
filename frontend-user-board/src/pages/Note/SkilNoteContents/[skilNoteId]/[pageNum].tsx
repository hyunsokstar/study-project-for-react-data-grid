import CardForSkilNoteContent from '@/components/Card/CardForSkilNoteContent';
import NavigatorForScrollContents from '@/components/Navigator/NavigatorForScrollContents';
import EditorForCreateSkilNoteContents from '@/components/RichEditor/EditorForCreateSkilNoteContents';
import useApiForGetSkilNoteContentsForSkilNoteId from '@/hooks/useApiForGetSkilNoteContentsForSkilNoteId';
import { Box, Button, Grid, HStack, Input, Text, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';

type Item = {
    id: string;
    order: string;
};

const SkilNoteContents = () => {
    const router = useRouter();
    const { skilNoteId, pageNum } = router.query;
    const cardRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
    const [orderInfos, setOrderInfos] = useState<Item[]>();

    const { data: dataForskilNoteContent } = useApiForGetSkilNoteContentsForSkilNoteId(skilNoteId, pageNum);

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

    useEffect(() => {
        if (dataForskilNoteContent) {
            const ordersArray = dataForskilNoteContent?.skilnoteContents.map((row) => {
                return {
                    id: `${row.id}`,
                    order: `${row.order}`
                }
            })
            setOrderInfos(ordersArray)
        }
    }, [dataForskilNoteContent])


    return (
        <Box>
            <Box display={"flex"} border={"2px dotted black"} mx={2} p={2} gap={2}>
                <Text>title: {dataForskilNoteContent?.title}</Text>
                <Text>writer: {dataForskilNoteContent?.writer.email}</Text>
                <Text>noteId: {skilNoteId}</Text>
                <Text>pageNum: {pageNum}</Text>
            </Box>
            <Box display={"flex"} border={"0px dotted black"} overflowY={"scroll"} height={"80vh"} mt={2}>
                <Box flex={7} border={"0px dotted red"} >

                    <Box border="0px dashed red" p={2} display={"flex"} flexDirection={"column"} gap={2}>
                        {dataForskilNoteContent?.skilnoteContents.map((row, index) => (
                            <div data-order={row.order} key={row.id} ref={(ref) => (cardRefs.current[row.order] = ref)}>
                                <CardForSkilNoteContent key={row.id} noteObj={row} index={index + 1} data-order={row.order} />
                            </div>
                        ))}
                        <Box border="0px dashed red" ref={editorRef} height={"80vh"} width={"100%"}>
                            <EditorForCreateSkilNoteContents
                                skilNoteId={skilNoteId}
                                pageNum={pageNum}
                            />
                        </Box>
                    </Box>
                </Box>

                <Box flex={3} border={"0px dotted red"} position="sticky" top={0} mt={2}>
                    <Grid templateColumns="1fr 5fr" gap={2} px={2}>
                        <Box display={"flex"} flexDirection={"column"} gap={2} border={"2px dotted purple"} textAlign={"center"}>
                            {/* {buttonsForScroll}
                            <Box width={"100%"}>
                                <Button onClick={scrollToEditor} width={"100%"}>create</Button> 
                            </Box> */}

                            <NavigatorForScrollContents
                                skilNoteId={skilNoteId}
                                pageNum={pageNum}
                                itemsInfo={orderInfos ? orderInfos : []} />

                        </Box>

                        <Box border="1px dashed" borderColor="gray.300" p={0}>
                            <Box>left, right</Box>
                            <Text fontSize="xl" mb={4}>Right side</Text>
                            <Text>{skilNoteId}</Text>
                        </Box>
                    </Grid>
                </Box>
            </Box >
        </Box >
    );
};

export default SkilNoteContents;
