import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react'

type Props = {}

const SkilNoteContents = (props: Props) => {
    const router = useRouter();
    const { techNoteId } = router.query;
    return (
        <Box width={"98%"} m={"auto"}>
            {techNoteId}
        </Box>
    )
}

export default SkilNoteContents