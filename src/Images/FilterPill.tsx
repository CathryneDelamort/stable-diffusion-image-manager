import { useSearchParams } from 'react-router-dom'
import { Box } from '../layout/Box'

const types = {
  cfg: { title: 'CFG value', prefix: 'CFG' },
  denoise: { title: 'Denoise strength', prefix: '🔇' },
  faceRestoration: { title: 'Face restoration', prefix: '🥸' },
  model: { title: 'Model hash', prefix: '📦' },
  prompt: { title: 'Prompt', prefix: '💬' },
  sampler: { title: 'Sampler', prefix: '👀' },
  seed: { title: 'Seed', prefix: '🌱' },
  steps: { title: 'Steps', prefix: '🚶' }
}

type Props = {
  type: keyof typeof types
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

  return <Box
    onClick={handleClick}
    title={`Remove ${types[type].title} filter`}
    style={{
      border: '1px solid',
      borderRadius: '.5rem',
      padding: '.25rem .5rem',
      cursor: 'pointer',
      backgroundColor: '#444'
    }}
  >
    {types[type].prefix}
    {' '}
    {value}
  </Box>
}

export default FilterPill
