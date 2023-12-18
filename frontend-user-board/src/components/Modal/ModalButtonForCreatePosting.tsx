import { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

interface ModalButtonProps {
    button_text: string;
}

const ModalButtonForCreatePosting: React.FC<ModalButtonProps> = ({ button_text }) => {
    const { register, handleSubmit } = useForm();
    const [isOpen, setIsOpen] = useState(false);

    const onSubmit = (data: any) => {
        console.log('제출된 데이터:', data);
        // 여기서 데이터를 사용하여 무언가를 할 수 있습니다.
    };

    return (
        <>
            <Button variant={"outline"} onClick={() => setIsOpen(true)}>{button_text}</Button>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>포스팅 생성</ModalHeader>
                    <ModalCloseButton />

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <ModalBody>
                            <FormControl>
                                <FormLabel htmlFor="title">제목</FormLabel>
                                <Input {...register('title')} id="title" />
                            </FormControl>

                            <FormControl mt={4}>
                                <FormLabel htmlFor="content">내용</FormLabel>
                                <Input {...register('content')} id="content" />
                            </FormControl>
                        </ModalBody>

                        <ModalFooter>
                            <Button variant="ghost" mr={3} onClick={() => setIsOpen(false)}>
                                취소
                            </Button>
                            <Button type="submit">제출</Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        </>
    );
};

export default ModalButtonForCreatePosting;
