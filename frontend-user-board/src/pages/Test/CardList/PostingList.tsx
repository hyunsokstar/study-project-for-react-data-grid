import {
    Box,
    Heading,
    Text,
    Divider,
    Avatar, Flex,
    Image,
    Grid,
    HStack,
    Icon,
    IconButton
} from '@chakra-ui/react';
import { AiOutlineHeart, AiOutlineStar } from 'react-icons/ai';

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
    },
    {
        "id": 13,
        "title": "리액트에 대한 질문",
        "content": "리액트 hook의 효과적인 사용팁이 있나요?",
        "createdAt": "2023-12-18T09:15:37.944Z",
        "user": {
            "nickname": "reactlover123"
        }
    },

    {
        "id": 14,
        "title": "리액트에 대한 질문",
        "content": "리액트 hook의 효과적인 사용팁이 있나요?",
        "createdAt": "2023-12-18T09:15:37.944Z",
        "user": {
            "nickname": "reactlover123"
        }
    },

    {
        "id": 15,
        "title": "리액트에 대한 질문",
        "content": "리액트 hook의 효과적인 사용팁이 있나요?",
        "createdAt": "2023-12-18T09:15:37.944Z",
        "user": {
            "nickname": "reactlover123"
        }
    },

    {
        "id": 16,
        "title": "리액트에 대한 질문",
        "content": "리액트 hook의 효과적인 사용팁이 있나요?",
        "createdAt": "2023-12-18T09:15:37.944Z",
        "user": {
            "nickname": "reactlover123"
        }
    },
    {
        "id": 16,
        "title": "리액트에 대한 질문",
        "content": "리액트 hook의 효과적인 사용팁이 있나요?",
        "createdAt": "2023-12-18T09:15:37.944Z",
        "user": {
            "nickname": "reactlover123"
        }
    },

    {
        "id": 17,
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
                width="100%"
                mt={5}
                mx={3}
                py={5}
                px={5}
                overflowY={"scroll"}
                maxHeight={"70vh"}
                border={"2px solid black"}
            >
                {samplePostings.map((posting) => (
                    <Box
                        key={posting.id}
                        display={"flex"}
                        p={2}
                        gap={2}
                        boxShadow="0 4px 8px 0 rgba(0,0,0,0.2)"
                    >
                        <Box width={"8em"} border="1px solid black">
                            <Image
                                boxSize="100%"
                                // objectFit="fill"
                                src="https://via.placeholder.com/150"
                                alt="Sample Image"
                            />
                        </Box>
                        <Box width={"24em"}>
                            <Heading as="h3" size="md" my={2}>
                                {posting.title}
                            </Heading>

                            <Text mb={2} isTruncated>
                                {posting.content}
                            </Text>

                            {/* <Divider mb={2} /> */}

                            <Text fontSize="sm" color="gray.500">
                                {posting.createdAt}
                            </Text>

                            <Box
                                display={"flex"}
                                justifyContent={"flex-end"}
                                alignItems="center"
                                border={"0px solid green"}
                                p={2}
                            >
                                <IconButton
                                    aria-label="Like"
                                    icon={<Icon as={AiOutlineHeart} />}
                                    variant="outline"
                                    mr={2}
                                />
                                <IconButton
                                    aria-label="Bookmark"
                                    icon={<Icon as={AiOutlineStar} />}
                                    variant="outline"
                                />
                            </Box>

                        </Box>
                    </Box>
                ))}

            </Grid>

            {/* 우측 영역 */}
            <Box width="25%">

                <Box
                    width="100%"
                    height={"80%"}
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    pl={4} // 패딩 추가
                    border={"1px solid black"}
                    mt={5}
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
