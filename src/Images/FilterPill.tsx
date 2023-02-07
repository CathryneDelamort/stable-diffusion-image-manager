import { useSearchParams } from 'react-router-dom'
import Box from '../layout/Box'
import details from './details'

type Props = {
  type: keyof typeof details
  value: string
}

const FilterPill = ({ type, value }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams()

  const handleClick = () => {
    const paramKey = `filter-${type}`
    const remaining = searchParams.getAll(paramKey).filter(v => v != value)
    searchParams.delete(paramKey)
    remaining.forEach(v => searchParams.append(paramKey, v))
    setSearchParams(searchParams)
  }

  return <Box
    paper
    onClick={handleClick}
    title={`Remove ${details[type].title} filter`}
    paddingX="sm"
    paddingY="xs"
    style={{ cursor: 'pointer' }}
  >
    {details[type].prefix}
    {' '}
    {value}
  </Box>
}

export default FilterPill
