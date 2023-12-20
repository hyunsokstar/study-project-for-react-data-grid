import React, { useState } from 'react'
import { Box, Image, Button, Text, useToast, Spinner } from '@chakra-ui/react'
import { apiForGetUrlForImageUpload, apiForUploadToCloudFlare } from '@/api/apiForCloudFlare';
import { UseMutationOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiForUpdateProfileImage } from '@/api/apiForUserBoard';

type Props = { userInfo: any }

const UserProfileInfo = ({ userInfo }: Props) => {
    const [profileImageUrl, setProfileImageUrl] = useState(userInfo.profileImage)
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [urlToImageUpload, setUrlToImageUpload] = useState<string>("")
    const [isLoadingForImageUpload, setIsLoadingForImageUpload] = useState(false);
    const queryClient = useQueryClient();
    const toast = useToast();

    const mutationForUpdateUserProfileImage = useMutation({
        mutationFn: apiForUpdateProfileImage,
        onSuccess: ({ result }: any) => {
            console.log("result for profile image update", result);

            toast({
                title: "image update success",
                status: "success",
                duration: 2000,
                isClosable: true,
            });

        }
    })

    const mutationForImageUploadToCloudFlare = useMutation({
        mutationFn: apiForUploadToCloudFlare,
        onSuccess: ({ result }: any) => {
            console.log("result for mutation : ", result);
            console.log("result : ", result.variants[0]);
            setProfileImageUrl(result.variants[0])
            setIsLoadingForImageUpload(false)

            mutationForUpdateUserProfileImage.mutate({ email: userInfo.email, profileImage: result.variants[0] })

            // toast({
            //     title: "image upload success",
            //     description: result.variants[0],
            //     status: "success",
            //     duration: 2000,
            //     isClosable: true,
            // });
        },
        onError: (error: Error) => {
            // 에러 발생 시 처리할 내용
            console.log("error : ", error);
        },
    });

    const mutationForGetImageUploadUrl = useMutation({
        mutationFn: apiForGetUrlForImageUpload,
        onSuccess: (result: any) => {
            // 성공 시 처리할 내용
            console.log("result : ", result);
            setUrlToImageUpload(result.uploadURL);
        },
        onError: (error: Error) => {
            // 에러 발생 시 처리할 내용
        },
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
        mutationForGetImageUploadUrl.mutate();
    };

    const uploadImageToCloudFlare = () => {
        setIsLoadingForImageUpload(true)
        mutationForImageUploadToCloudFlare.mutate({ file: selectedFile, uploadURL: urlToImageUpload })
    }

    return (
        <Box
            width={"25%"}
            display="flex"
            flexDirection="column"
            alignItems="center"
            border={"2px solid green"}
            height={"70vh"}
        >
            {/* {isLoggedIn ? "로그인 상태" : "비 로그인 상태"} */}
            <Box display="flex" flexDirection="column" width={"100%"}>
                <Box border={"1px solid black"} width={"100%"} >
                    {selectedFile ? (
                        <Image
                            width={"100%"}
                            objectFit="fill"
                            src={URL.createObjectURL(selectedFile)}
                            alt="Selected Image"
                            height={"30vh"}
                        />
                    ) : (
                        <Image
                            width={"100%"}
                            objectFit="contain"
                            src={profileImageUrl}
                            alt="Sample Image"
                            height={"30vh"}
                        />
                    )}
                </Box>
                <Box display={"flex"} justifyContent="space-between" border={"1px solid red"}>
                    <Box border={"1px solid green"} width={"48%"} >
                        <label htmlFor="fileSelect">
                            <input
                                type="file"
                                id="fileSelect"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                            />
                            <Button variant="outline" size={'sm'} width={"100%"} as="span">
                                Select
                            </Button>
                        </label>
                    </Box>
                    <Box width={"48%"} >
                        <Button
                            variant="outline"
                            size={"sm"}
                            className="equal-width-button"
                            width={"100%"}
                            onClick={uploadImageToCloudFlare}
                            colorScheme={urlToImageUpload ? "green" : "gray"}
                            isDisabled={!urlToImageUpload}
                        >
                            Update Image
                            {isLoadingForImageUpload ? (
                                <Spinner size="sm" color="green.500" />
                            ) : (
                                ""
                            )}
                        </Button>
                    </Box>

                </Box>


            </Box>
            <Box marginTop="2px" border={"2px solid green"} width={"100%"} p={2}>
                <Text>Email: user@example.com</Text>
                <Text>Nickname: User123</Text>
                <Text>Gender: Male</Text>
                <Text>Role: Admin</Text>
            </Box>
            {selectedFile && (
                <Box marginTop="2px">
                    <Text>Selected File: {selectedFile.name}</Text>
                    <Text>Size: {selectedFile.size} bytes</Text>
                    <Text>Type: {selectedFile.type}</Text>
                </Box>
            )}
            {urlToImageUpload ? urlToImageUpload : "no url"}
        </Box>
    )
}

export default UserProfileInfo