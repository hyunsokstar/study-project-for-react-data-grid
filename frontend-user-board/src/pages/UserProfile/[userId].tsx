import React, { useState } from 'react';
import { Avatar, Box, Divider, Image, Spacer, Text, IconButton } from '@chakra-ui/react';
import useUserPostings from '@/hooks/useUserPostings';
import { AiFillHeart, AiFillStar, AiFillGithub, AiFillFileText } from "react-icons/ai"; // 사용할 아이콘을 가져와야 합니다.
import { useRouter } from 'next/router';


interface IProps { }

const UserProfile = (props: IProps) => {
    const router = useRouter();
    const { userId } = router.query;
    const [pageNum, setPageNum] = useState(1);
    const actualUserId = userId as string; // nullish coalescing operator를 사용하여 더 간단하게 처리 가능

    console.log("actualUserId : ", actualUserId);


    const { isLoading, error, dataForUserPosting } = useUserPostings(actualUserId, pageNum);

    console.log("dataForUserPosting : ", dataForUserPosting);


    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <Box width="80%" margin="auto" mt={2} display="flex">
            {/* 왼쪽 영역 */}
            <Box width={"75%"} border={"1px dotted black"}>
                유저 포스팅 리스트 출력 for {userId}
                <Box
                    border={"1px solid blue"}
                    display={"flex"}
                >
                    <Box
                        border={"1px solid red"}
                        width={"30%"}
                    >
                        <Image
                            src="https://via.placeholder.com/150"
                            width={"100%"}
                        />
                    </Box>
                    <Box
                        width={"70%"}
                        display={"flex"}
                        flexDirection={"column"}
                        p={2} /* 박스와 타이틀 콘텐트 간의 간격 * */
                    >
                        <Box>
                            <Text fontWeight="bold">Title:</Text>
                            <Text fontSize="xl">오늘은 짜파게티 먹는날</Text>

                            {/* 내용(content) */}
                            <Text fontWeight="bold" mt={3}>Content:</Text>
                            <Text>짜짜 짜파게티</Text>

                            {/* 작성일(createdAt) */}
                            <Text fontWeight="bold" mt={3}>Created At:</Text>
                            <Text>2023-12-17T13:15:38.700Z</Text>
                        </Box>
                        <Spacer />
                        <Box
                            width={"100%"}
                            display={"flex"}
                            justifyContent={"space-around"}
                            border={"0px solid red"}
                        // pb={1}
                        >
                            <IconButton
                                aria-label="좋아요"
                                icon={<AiFillHeart />}
                                onClick={() => {
                                    // 좋아요 기능 구현
                                }}
                            />
                            <IconButton
                                aria-label="즐겨찾기"
                                icon={<AiFillStar />}
                                onClick={() => {
                                    // 즐겨찾기 기능 구현
                                }}
                            />
                            <IconButton
                                aria-label="GitHub"
                                icon={<AiFillGithub />}
                                onClick={() => {
                                    // GitHub 기능 구현
                                }}
                            />
                            <IconButton
                                aria-label="노트"
                                icon={<AiFillFileText />}
                                onClick={() => {
                                    // 노트 기능 구현
                                }}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>

            <Box width={"25%"} display="flex" flexDirection="column" alignItems="center" border={"1px solid green"}>
                <Box>
                    <Image
                        mt={2}
                        boxSize="200px"
                        objectFit="cover"
                        src="https://wimg.mk.co.kr/news/cms/202306/12/news-p.v1.20230609.5101dc06d57b46f3bc552e95933d31c4_P1.jpg"
                        alt="Sample Image"
                    />
                </Box>

                {/* 유저 정보 */}
                <Box marginTop="20px">
                    <Text>Email: user@example.com</Text>
                    <Text>Nickname: User123</Text>
                    <Text>Gender: Male</Text>
                    <Text>Role: Admin</Text>
                </Box>
            </Box>
        </Box>
    );
};

export default UserProfile;
