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
            // smooth scroll
            // selectedCard.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // smooth scroll 끝난 후 정확한 위치로 추가 스크롤
            // selectedCard.scrollIntoView({ behavior: 'instant', block: 'start' });

            selectedCard.scrollIntoView({ behavior: 'smooth' });

            setTimeout(() => {
                selectedCard.scrollIntoView({ behavior: 'instant', block: 'start' });
            }, 500); // 애니메이션 시간 고려

        }
    };

    const editorRef = useRef<HTMLDivElement | null>(null); // 참조 추가

    const handleBeforeClick = () => {
        const currentUrl = window.location.href;
        console.log('currentUrl : ', currentUrl);

        // 정규식을 사용하여 URL에서 마지막 숫자를 추출
        const regex = /\/(\d+)$/; // URL에서 맨 뒤의 연속된 숫자를 찾기 위한 정규식
        const match = currentUrl.match(regex);

        if (match) {
            const lastNumber = parseInt(match[1]); // 맨 뒤의 숫자 추출
            const newLastNumber = lastNumber - 1; // 변경할 숫자 계산

            if (newLastNumber === 0) {
                alert("1 페이지 보다 커야 합니다")
                return
            }

            const newUrl = currentUrl.replace(regex, `/${newLastNumber}`); // 새로운 URL 생성
            console.log('새로운 URL : ', newUrl);
            router.push(newUrl); // 새로운 URL로 페이지 이동

        } else {
            console.log('URL에서 변경할 숫자를 찾을 수 없습니다.');
        }

    };



    const handleNextClick = () => {
        const currentUrl = window.location.href;
        console.log('currentUrl : ', currentUrl);

        // 정규식을 사용하여 URL에서 마지막 숫자를 추출
        const regex = /\/(\d+)$/; // URL에서 맨 뒤의 연속된 숫자를 찾기 위한 정규식
        const match = currentUrl.match(regex);

        if (match) {
            const lastNumber = parseInt(match[1]); // 맨 뒤의 숫자 추출
            const newLastNumber = lastNumber + 1; // 변경할 숫자 계산

            if (newLastNumber === 101) {
                alert("100 페이지 보다 작아야 합니다")
                return
            }

            const newUrl = currentUrl.replace(regex, `/${newLastNumber}`); // 새로운 URL 생성
            console.log('새로운 URL : ', newUrl);
            router.push(newUrl); // 새로운 URL로 페이지 이동

        } else {
            console.log('URL에서 변경할 숫자를 찾을 수 없습니다.');
        }
    };


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
        <Box border={"0px solid pink"}>
            <Box display={"flex"} border={"2px dotted black"} mx={2} p={0} gap={2}>
                <Text>title: {dataForskilNoteContent?.title}</Text>
                <Text>writer: {dataForskilNoteContent?.writer.email}</Text>
                <Text>noteId: {skilNoteId}</Text>
                <Text>pageNum: {pageNum}</Text>
            </Box>
            <Box display={"flex"} border={"0px dotted black"} overflowY={"scroll"} height={"100%"} m={2}>
                <Box flex={7} border={"0px dotted red"}>
                    <Box border="0px dashed red" p={0} display={"flex"} flexDirection={"column"} gap={2} overflowY={"scroll"} height={"80vh"} mt={0}>
                        {dataForskilNoteContent?.skilnoteContents.map((row, index) => (
                            <div data-order={row.order} key={row.id} ref={(ref) => (cardRefs.current[row.order] = ref)}>
                                <CardForSkilNoteContent key={row.id} noteObj={row} index={index + 1} data-order={row.order} pageNum={pageNum} />
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

                <Box flex={3} border={"2px dotted red"} position="sticky" top={0} mt={0} height={"80vh"}>
                    <Grid templateColumns="1fr 5fr" gap={2} px={2}>
                        <Box display={"flex"} flexDirection={"column"} gap={2} border={"2px dotted purple"} textAlign={"center"}>
                            {/* {buttonsForScroll}
                            <Box width={"100%"}>
                                <Button onClick={scrollToEditor} width={"100%"}>create</Button> 
                            </Box> */}

                            <NavigatorForScrollContents
                                skilNoteId={skilNoteId}
                                pageNum={pageNum}
                                itemsInfo={orderInfos ? orderInfos : []}
                                scrollToCard={scrollToCard}
                            />

                        </Box>

                        <Box border="1px dashed" borderColor="gray.300" p={0}>
                            <Box width={"100%"} display={"flex"} gap={2} p={1}>
                                <Button width={"50%"} onClick={handleBeforeClick}>Before</Button>
                                <Button width={"50%"} onClick={handleNextClick}>Next</Button>
                            </Box>
                            current page:{pageNum}
                        </Box>
                    </Grid>
                </Box>
            </Box >
        </Box >
    );
};

export default SkilNoteContents;
