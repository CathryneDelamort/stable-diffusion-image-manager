import { useSearchParams } from 'react-router-dom'
import { Box } from '../layout/Box'

type Props = {
    type: string
    value: string
}

const FilterPill = ({ type, value }: Props) => {
    const [searchParams, setSearchParams] = useSearchParams()
    
    const handleClick = () => {
        const paramKey = `filter-${type}`
        const remaining = searchParams.getAll(paramKey).filter(v => v != value)
        console.log(remaining)
        searchParams.delete(paramKey)
        remaining.forEach(v => searchParams.append(paramKey, v))
        setSearchParams(searchParams)
    }

    return <Box onClick={handleClick} title={`Remove ${type} filter`} style={{ 
        border: '1px solid',
        borderRadius: '.5rem',
        padding: '.25rem .5rem',
        cursor: 'pointer',
        backgroundColor: '#444'
    }}>
        {type == 'cfg' && 'CFG'}
        {type == 'faceRestoration' && '🥸'}
        {type == 'model' && '📦'}
        {type == 'prompt' && '💬'}
        {type == 'sampler' && '👀'}
        {type == 'seed' && '🌱'}
        {type == 'steps' && '🚶'}
        {' '}
        {value}
    </Box>
}

export default FilterPill
