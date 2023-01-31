import { PropsWithChildren } from 'react'

type Props = PropsWithChildren<{
    onRemove: () => void
}>

const FilterPill = ({ children, onRemove }: Props) => 
    <div onClick={onRemove} style={{ 
        border: '1px solid',
        borderRadius: '.5rem',
        padding: '.25rem .5rem',
        cursor: 'pointer',
        backgroundColor: '#444'
    }}>
        {children}
    </div>

export default FilterPill
