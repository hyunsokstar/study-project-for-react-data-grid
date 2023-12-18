import React, { useState } from 'react';
import { Avatar, Box, Divider, Image, Spacer, Text, IconButton } from '@chakra-ui/react';
import useUserPostings from '@/hooks/useUserPostings';
import { AiFillHeart, AiFillStar, AiFillGithub, AiFillFileText } from "react-icons/ai"; // 사용할 아이콘을 가져와야 합니다.
import { useRouter } from 'next/router';

type Props = {
    title: string;
    content: string;
    createdAt: string;
}

const CardForUserPostings = ({ title, content, createdAt }: Props) => {
    return (
        <Box
            border={"1px solid blue"}
            display={"flex"}
            mb={2}
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
                p={2}
            >
                <Box>
                    <Text fontWeight="bold">Title:</Text>
                    <Text fontSize="xl">{title}</Text>

                    <Text fontWeight="bold" mt={3}>Content:</Text>
                    <Text>{content}</Text>

                    <Text fontWeight="bold" mt={3}>Created At:</Text>
                    <Text>{createdAt}</Text>
                </Box>
                <Spacer />
                <Box
                    width={"100%"}
                    display={"flex"}
                    justifyContent={"space-around"}
                    border={"0px solid red"}
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
    )
}

export default CardForUserPostings