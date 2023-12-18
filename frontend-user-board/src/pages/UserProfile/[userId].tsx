import React, { useState } from 'react';
import { Avatar, Box, Divider, Image, Spacer, Text, IconButton, VStack, Button } from '@chakra-ui/react';
import useUserPostings from '@/hooks/useUserPostings';
import { AiFillHeart, AiFillStar, AiFillGithub, AiFillFileText } from "react-icons/ai"; // 사용할 아이콘을 가져와야 합니다.
import { useRouter } from 'next/router';
import CardForUserPostings from '@/components/Card/CardForUserPostings';
import ModalButtonForCreatePosting from '@/components/Modal/ModalButtonForCreatePosting';


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
        <>
            <Box display={"flex"} width={"80%"} margin={"auto"} my={2}>
                <Box
                    width={"75%"}
                    // border={"1px solid green"}
                    display={"flex"}
                    justifyContent={"flex-end"}
                    px={0}
                >
                    <ModalButtonForCreatePosting button_text={'Posting'} />
                </Box>
            </Box>
            <Box width="80%" margin="auto" mt={2} display="flex">

                {/* 왼쪽 영역 */}
                <Box
                    width={"75%"}
                    border={"1px dotted black"}
                    height={"70vh"}
                    overflowY={"scroll"}
                    p={2}
                    gap={2}
                >
                    {/* 유저 포스팅 리스트 출력 for {userId} */}
                    {dataForUserPosting && dataForUserPosting.data ?
                        dataForUserPosting.data.postings.map((row: any) => {
                            return (<CardForUserPostings
                                title={row.title}
                                content={row.content}
                                createdAt={row.createdAt}
                            />)
                        }) : "no data"}
                </Box>

                <Box width={"25%"} display="flex" flexDirection="column" alignItems="center" border={"1px solid green"}>
                    <Box>
                        <Image
                            mt={2}
                            boxSize="200px"
                            objectFit="cover"
                            // src="https://wimg.mk.co.kr/news/cms/202306/12/news-p.v1.20230609.5101dc06d57b46f3bc552e95933d31c4_P1.jpg"
                            src="https://www.seventoy.co.kr/data/item/1649909695/thumb-7ZGc7KeA1_800x800.jpg"
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

        </>

    );
};

export default UserProfile;
