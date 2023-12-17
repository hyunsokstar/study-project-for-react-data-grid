// pages/index.tsx

import { Box, Text, SimpleGrid } from '@chakra-ui/react';
import Link from 'next/link';

const Home = () => {
    const links = [
        { href: '/users', text: '회원 관리 (기본)' },
        { href: '/users/UserlistByDataGrid', text: '회원 관리(react-data-grid)' },
        { href: '/users-by-rbd', text: '회원 관리(react-beautiful-dnd)' },
        { href: '/UserProfile/1', text: '유저 프로필' },
        { href: '/payment', text: '결제(구현 예정)' },
    ];
    const links2 = [
        { href: '/Test/CardList/PostingList', text: '포스팅 리스트' },
    ];

    return (
        <Box
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
        >
            <SimpleGrid
                columns={2}
                width="80%"
                margin="auto"
                mt={5}
                border="2px solid red"
            >
                {/* 좌측 영역 */}
                <Box>
                    {links.map((link, index) => (
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
                    ))}
                </Box>
                <Box>
                    {/* 우측 영역 */}
                    <Text>우측 영역</Text>

                </Box>
            </SimpleGrid>


            <Text>Test Pages</Text>

            <SimpleGrid
                columns={2}
                width="80%"
                margin="auto"
                mt={5}
                border="2px solid red"
            >
                {/* 좌측 영역 */}
                <Box>
                    {links2.map((link, index) => (
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
                    ))}
                </Box>
                <Box>
                    {/* 우측 영역 */}
                    <Text>우측 영역</Text>

                </Box>
            </SimpleGrid>
        </Box>
    );
};

export default Home;
