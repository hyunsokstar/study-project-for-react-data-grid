import React, { useState } from 'react';
import { Box, Button, HStack, Input, Text, VStack } from '@chakra-ui/react';
import { SkilNoteContentsRow } from '@/types/typeForSkilNoteContents';
import EditorForCreateSkilNoteContents from '../RichEditor/EditorForCreateSkilNoteContents';
import EditorForUpdateSkilNotes from '../RichEditor/EditorForUpdateSkilNotes';

type Props = {
    skilNoteId?: any;
    index: number;
    noteObj?: SkilNoteContentsRow;
    pageNum: any;
}

const CardForSkilNoteContent = ({ noteObj, skilNoteId, index, pageNum }: Props) => {
    const [copied, setCopied] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    const copyHtmlToClipboard = () => {
        const textToCopy = stripHtmlTags(noteObj?.content || '');
        copyToClipboard(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500); // 1.5초 후에 copied 상태를 false로 변경
    };

    const stripHtmlTags = (html: string) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        return tempDiv.textContent || tempDiv.innerText || '';
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            // ...복사되었음을 사용자에게 알려주는 논리 추가
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    return (
        <>
            {isEditMode ?
                <Box>
                    <EditorForUpdateSkilNotes
                        skilNoteId={skilNoteId}
                        pageNum={pageNum}
                        // skilNoteContentId={noteObj?.id}
                        skilNoteContentId={noteObj?.order}
                        title={noteObj?.title}
                        file={noteObj?.file}
                        content={noteObj?.content}
                    />
                </Box>
                : ""}

            {!isEditMode && noteObj ?
                <Box
                    key={noteObj.id}
                    borderWidth="1px"
                    borderRadius="lg"
                    overflow="hidden"
                    display="flex"
                    flexDirection="column"
                    gap={2}
                >
                    <Box p={1} border="2px solid blue">
                        <HStack spacing={1} mb={1}>
                            <Text>
                                <Button variant="outlined" size="md" border="1px">
                                    {index}
                                </Button>
                            </Text>
                            <Input defaultValue={noteObj.title} />
                            <Input defaultValue={noteObj.file} />
                        </HStack>

                        <Box position="relative">
                            <Box
                                border="1px dotted black"
                                overflowY="scroll"
                                height="70vh"
                                dangerouslySetInnerHTML={{ __html: noteObj.content }}
                            />
                            <Button
                                position="absolute"
                                top="1px"
                                right="15px"
                                size="sm"
                                variant="outline"
                                onClick={copyHtmlToClipboard}
                            >
                                {copied ? 'Copied!' : 'Copy'}
                            </Button>
                        </Box>
                    </Box>
                    {/* hi */}
                </Box>
                : ""}
        </>
    )
}

export default CardForSkilNoteContent;
