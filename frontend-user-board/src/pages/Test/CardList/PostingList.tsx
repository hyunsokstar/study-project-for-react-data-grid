import { Box, Heading, Text, Divider, Avatar, Flex, Image, Grid } from '@chakra-ui/react';

interface Posting {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    user: {
        nickname: string;
    }
}

const samplePostings: Posting[] = [
    {
        "id": 9,
        "title": "test title3",
        "content": "test content3",
        "createdAt": "2023-12-17T13:15:38.700Z",
        "user": {
            "nickname": "tere1"
        }
    },
    {
        "id": 10,
        "title": "더미 타이틀1",
        "content": "이것은 더미 콘텐츠 1입니다.",
        "createdAt": "2023-12-16T05:23:13.285Z",
        "user": {
            "nickname": "dummyuser1"
        }
    },
    {
        "id": 11,
        "title": "더미 포스팅 2",
        "content": "여기에는 더미 콘텐츠 2가 들어갑니다. 약간의 텍스트를 채워 넣습니다.",
        "createdAt": "2023-12-17T15:47:52.813Z",
        "user": {
            "nickname": "dummyuser2"
        }
    },
    {
        "id": 12,
        "title": "리액트에 대한 질문",
        "content": "리액트 hook의 효과적인 사용팁이 있나요?",
        "createdAt": "2023-12-18T09:15:37.944Z",
        "user": {
            "nickname": "reactlover123"
        }
    }
];

const PostingList = () => {
    return (
        <Flex width="80%" margin="auto">
            <Grid
                templateColumns="repeat(2, 1fr)" // 2열 그리드 설정
                gap={4}
                width="75%"
                py={5}
                px={5}
            >
                {samplePostings.map(posting => (
                    <Flex
                        key={posting.id}
                        borderWidth="1px"
                        borderRadius="lg"
                        overflow="hidden"
                        p={4}
                        flexDirection="column"
                        boxShadow="0 4px 8px 0 rgba(0,0,0,0.2)"
                    >
                        {/* <Flex alignItems="center">
                            <Avatar name={posting.user.nickname} mr={2} />
                            <Text fontSize="sm" fontWeight="bold">
                                {posting.user.nickname}
                            </Text>
                        </Flex> */}

                        <Heading as="h3" size="md" my={2}>
                            {posting.title}
                        </Heading>

                        <Text mb={2}>
                            {posting.content}
                        </Text>

                        <Divider mb={2} />

                        <Text fontSize="sm" color="gray.500">
                            {posting.createdAt}
                        </Text>
                    </Flex>
                ))}
            </Grid>

            {/* 우측 영역 */}
            <Box width="25%">

                <Box
                    width="100%"
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    borderLeft="1px solid black" // 오른쪽 영역과 구분선 추가
                    pl={4} // 패딩 추가
                >
                    <Box>
                        <Image
                            mt={2}
                            boxSize="200px"
                            objectFit="cover"
                            src="https://wimg.mk.co.kr/news/cms/202306/12/news-p.v1.20230609.5101dc06d57b46f3bc552e95933d31c4_P1.jpg"
                            alt="Sample Image"
                        />
                    </Box>

                    <Box marginTop="20px">
                        <Text>Email: user@example.com</Text>
                        <Text>Nickname: User123</Text>
                        <Text>Gender: Male</Text>
                        <Text>Role: Admin</Text>
                    </Box>
                </Box>

            </Box>
        </Flex>
    );
};

export default PostingList;
