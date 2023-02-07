import { useSearchParams } from 'react-router-dom'
import FlexBox from '../../layout/FlexBox'

const SortSelector = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  return <FlexBox gap="sm">
    Sort by 
    <select
      onChange={e => {
        searchParams.set('sort', e.target.value)
        setSearchParams(searchParams)
      }}
      value={searchParams.get('sort') || '-created'}
    >
      <option value="created">Created ⬆</option>
      <option value="-created">Created ⬇</option>
      <option value="denoise">Denoise ⬆</option>
      <option value="-denoise">Denoise ⬇</option>
      <option value="prompt">Prompt ⬆</option>
      <option value="-prompt">Prompt ⬇</option>
      <option value="prompt,seed">Prompt ⬆, Seed ⬆</option>
      <option value="-prompt">Prompt ⬇</option>
      <option value="seed,prompt">Seed ⬆, Prompt, ⬆</option>
      <option value="seed,-prompt">Seed ⬆, Prompt, ⬇</option>
      <option value="-seed">Seed ⬇</option>
      <option value="steps,sampler">Steps ⬆, Sampler ⬆</option>
      <option value="-steps,sampler">Steps ⬇, Sampler ⬆</option>
      <option value="steps">Steps ⬆</option>
      <option value="-steps">Steps ⬇</option>
    </select>
  </FlexBox>
}

export default SortSelector