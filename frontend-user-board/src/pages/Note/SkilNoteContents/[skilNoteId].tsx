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

    // 가짜 데이터 대신 API에서 가져오는 데이터 사용
    const fakeData: SkilNote = {
        id: 6,
        title: 'Sample Title1',
        file: 'sample-file1.txt',
        content: 'Sample content1',
        page: 1,
        order: 10,
        createdAt: '2024-01-01T04:08:02.392Z',
        updatedAt: null,
    };

    // API로 데이터 가져오는 대신에 가짜 데이터 사용
    // const { isPending, error, data } = useApiForGetSkilNoteContentsForSkilNoteId(skilNoteId);
    const { isPending, error, data } = { isPending: false, error: null, data: fakeData };

    console.log('data at SkilNoteContents : ', data);

    return (
        <Grid templateColumns="12fr 1fr 4fr" gap={4} p={4}>
            <Box border="1px dashed" borderColor="gray.300" p={4}>
                {/* 왼쪽 영역 */}
                <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
                    <Box p={6}>

                        {/* 내용 영역 */}
                        <HStack fontSize="xl" mb={2} border={"1px solid black"}>
                            <Input defaultValue={data.title} />
                            <Input defaultValue={data.file} />
                        </HStack>

                        <Box
                            border={"1px dotted black"}
                            overflowY={"scroll"}
                            height={"20vh"}
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
                        </Box>
                    </Box>
                </Box>
            </Box>

            <Box border={"1px dotted black"} textAlign={"center"}> center</Box>

            <Box border="1px dashed" borderColor="gray.300" p={4}>
                {/* 오른쪽 영역 */}
                <Text fontSize="xl" mb={4}>
                    Right side
                </Text>
                <Text>{skilNoteId}</Text>
            </Box>
        </Grid>
    );
};

export default SkilNoteContents;
