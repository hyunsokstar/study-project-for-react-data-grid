import CardForSkilNoteContent from '@/components/Card/CardForSkilNoteContent';
import useApiForGetSkilNoteContentsForSkilNoteId from '@/hooks/useApiForGetSkilNoteContentsForSkilNoteId';
import { Box, Grid, HStack, Input, Text, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

type SkilNote = {
    id: number;
    title: string;
    file: string;
    content: string;
    page: number;
    order: number;
    createdAt: string;
    updatedAt: string | null;
};

type Props = {};

const SkilNoteContents = (props: Props) => {
    const router = useRouter();
    const { skilNoteId } = router.query;

    // const fakeData: SkilNote = {
    //     id: 6,
    //     title: 'Sample Title1',
    //     file: 'sample-file1.txt',
    //     content: 'Sample content1',
    //     page: 1,
    //     order: 10,
    //     createdAt: '2024-01-01T04:08:02.392Z',
    //     updatedAt: null,
    // };

    const { isPending, error, data: dataForskilNoteContent } = useApiForGetSkilNoteContentsForSkilNoteId(skilNoteId);
    console.log('data at useApiForGetSkilNoteContentsForSkilNoteId : ', dataForskilNoteContent);
    // console.log('data at useApiForGetSkilNoteContentsForSkilNoteId : ', dataForskilNoteContent?.skilnoteContents);

    return (
        <>
            <Box border={"1px solid blue"} width={"98%"} m={"auto"} display={"flex"} gap={2}>
                <Text>title: {dataForskilNoteContent?.title}
                </Text>
                <Text>
                    writer: {dataForskilNoteContent?.writer.email}
                </Text>
            </Box>
            <Grid templateColumns="12fr 1fr 4fr" gap={4} p={2}>
                {/* 왼쪽 box for skil note contents */}
                <Box border="1px dashed red" p={2} display={"flex"} flexDirection={"column"} gap={2}>

                    {dataForskilNoteContent?.skilnoteContents.map((row, index) => {
                        return (
                            <>
                                {index}
                                <CardForSkilNoteContent skilNoteId={skilNoteId} />
                            </>
                        )
                    })}

                </Box>

                <Box border={"1px dotted black"} textAlign={"center"}> center</Box>

                <Box border="1px dashed" borderColor="gray.300" p={2}>
                    {/* 오른쪽 영역 */}
                    <Text fontSize="xl" mb={4}>
                        Right side
                    </Text>
                    <Text>{skilNoteId}</Text>
                </Box>
            </Grid>
        </>
    );
};

export default SkilNoteContents;
