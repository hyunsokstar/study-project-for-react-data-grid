import CardForSkilNoteContent from '@/components/Card/CardForSkilNoteContent';
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

    return (
        <Box>
            <Box border={"1px solid blue"} width={"100%"} m={"auto"} display={"flex"} gap={2} backgroundColor={"blue.50"}>
                <Text>title: {dataForskilNoteContent?.title}</Text>
                <Text>writer: {dataForskilNoteContent?.writer.email}</Text>
            </Box>
            <Box display={"flex"} border={"3px dotted black"} overflowY={"scroll"} height={"70vh"}>
                <Box flex={3} border={"1px dotted red"}>

                    <Box border="1px dashed red" p={2} display={"flex"} flexDirection={"column"} gap={2}>
                        {dataForskilNoteContent?.skilnoteContents.map((row) => (
                            <div data-order={row.order} key={row.id} ref={(ref) => (cardRefs.current[row.order] = ref)}>
                                <CardForSkilNoteContent key={row.id} order={row.order} data-order={row.order} />
                            </div>
                        ))}
                    </Box>
                </Box>

                <Box flex={1} border={"1px dotted red"} position="sticky" top={0}>
                    <Grid templateColumns="12fr 1fr 4fr" gap={4} p={2}>
                        <Box display={"flex"} flexDirection={"column"} gap={2} border={"2px dotted purple"} textAlign={"center"}>
                            <Button onClick={() => scrollToCard(1)}>1</Button>
                            <Button onClick={() => scrollToCard(2)}>2</Button>
                            <Button onClick={() => scrollToCard(3)}>3</Button>
                            <Button onClick={() => scrollToCard(4)}>4</Button>
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
