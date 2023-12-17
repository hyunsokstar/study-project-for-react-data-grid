import React from 'react';
import { useRouter } from 'next/router';
import { Box, Divider, Image, Text } from '@chakra-ui/react';

interface IProps { }

const UserProfile = (props: IProps) => {
    const router = useRouter();

    const { userId } = router.query; // 동적으로 전달된 파라미터 가져오기


    return (
        <Box width="80%" margin="auto" mt={2} display="flex">
            {/* 왼쪽 영역 */}
            <Box flex="3" border={"1px dotted black"}>
                유저 포스팅 리스트 출력 for {userId}
            </Box>

            <Box flex="1" display="flex" flexDirection="column" alignItems="center">
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
