
import { RootState } from '@/store';
import { Box, Text, SimpleGrid, Button, LinkBox } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import useUser from '@/hooks/useUser';

const Home = () => {
    const loginUser = useSelector((state: RootState) => state.user.loginUser);
    const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

    console.log("loginUser : ", loginUser);


    const links = [
        { href: '/users', text: '회원 관리 (기본)', visible: true },
        { href: '/users/UserlistByDataGrid', text: '회원 관리(react-data-grid)', visible: true },
        { href: '/users-by-rbd', text: '회원 관리(react-beautiful-dnd)', visible: true },
        { href: `/UserProfile/${loginUser.id}`, text: 'User Postings', visible: isLoggedIn }, // 로그인 상태일 때만 보이도록 설정
        { href: '/payment', text: '결제(구현 예정)', visible: true },
    ];

    const links2 = [
        { href: '/Test/CardList/PostingList', text: '포스팅 리스트', visible: true },
    ];

    return (
        <Box
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
        >

            {/* <Button>
                /UserProfile/{loginUser.id}
            </Button> */}

            <SimpleGrid
                columns={2}
                width="80%"
                margin="auto"
                mt={5}
                border="2px solid red"
                px={2}
            >
                <Box>
                    {links.map((link, index) => (
                        link.visible && ( // visible이 true일 때만 렌더링
                            <Link key={index} href={link.href}>
                                <Box
                                    width="100%"
                                    p={4}
                                    my={2}
                                    borderRadius="md"
                                    bg="#1DA1F2"
                                    color="white"
                                    textAlign="center"
                                    _hover={{ bg: '#0B7BC8' }}
                                    cursor="pointer"
                                >
                                    <Text>{link.text}</Text>
                                </Box>
                            </Link>
                        )
                    ))}
                </Box>
                {/* 이하 코드 동일 */}
            </SimpleGrid>
        </Box>
    );
};

export default Home;
