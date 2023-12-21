import React, { useEffect, useState } from 'react';
import { Avatar, Box, Divider, Image, Spacer, Text, IconButton, VStack, Button } from '@chakra-ui/react';
import useUserPostings from '@/hooks/useUserPostings';
import { AiFillHeart, AiFillStar, AiFillGithub, AiFillFileText } from "react-icons/ai"; // 사용할 아이콘을 가져와야 합니다.
import { useRouter } from 'next/router';
import CardForUserPostings from '@/components/Card/CardForUserPostings';
import ModalButtonForCreatePosting from '@/components/Modal/ModalButtonForCreatePosting';
import useUser from '@/hooks/useUser';
import UserProfileInfo from '@/components/UserProfileInfo';


interface IProps { }

const UserProfile = (props: IProps) => {
    const router = useRouter();
    const { userId } = router.query;
    const [pageNum, setPageNum] = useState(1);
    const actualUserId = userId as string; // nullish coalescing operator를 사용하여 더 간단하게 처리 가능
    console.log("actualUserId : ", actualUserId);
    const { isLoading, error, dataForUserPosting } = useUserPostings(actualUserId, pageNum);
    const { isLoggedIn, loginUser, logout } = useUser();

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
                    <ModalButtonForCreatePosting button_text={'Posting'} userId={parseInt(actualUserId)} />
                </Box>
            </Box>
            <Box width="80%" margin="auto" mt={2} display="flex" gap={2}>
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
                    {
                        dataForUserPosting && dataForUserPosting.data ?
                            dataForUserPosting.data.postings.map((row: any) => {
                                return (<CardForUserPostings
                                    key={row.id}
                                    title={row.title}
                                    content={row.content}
                                    createdAt={row.createdAt}
                                />)
                            }) : "no data"
                    }
                </Box>

                {
                    dataForUserPosting && dataForUserPosting.data
                        && dataForUserPosting.data.user ?
                        <UserProfileInfo userInfo={dataForUserPosting.data.user} />
                        : ""
                }

            </Box>

        </>

    );
};

export default UserProfile;
