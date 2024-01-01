import { useRouter } from 'next/router';
import React from 'react'

type Props = {}

const SkilNoteContents = (props: Props) => {
    const router = useRouter();
    const { techNoteId } = router.query;
    return (
        <div>[userId]</div>
    )
}

export default SkilNoteContents