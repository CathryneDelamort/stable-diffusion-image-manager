import './App.css'
import { useEffect, useState } from 'react'
import images from '../public/metadata.json'
import Image from './Image'
import FilterPill from './FilterPill'
import useDebounce from './use-debounce'

type MetaDataKey = keyof typeof images[0]
type MetaDataLists = Record<MetaDataKey, string[]>

const keys = images.reduce((acc, image) =>
  (Object.keys(image) as MetaDataKey[]).reduce((data, key) =>
    !data[key] || data[key].indexOf(image[key]) > -1 
      ? data
      : Object.assign(data, { [key]: [...(data[key] || [])].concat(image[key])}),
    acc
  ),
  {} as MetaDataLists 
)

function App() {
  const [promptFilter, setPromptFilter] = useState('')
  const [seedFilter, setSeedFilter] = useState('')
  const [samplerFilter, setSamplerFilter] = useState('')
  const debouncedPromptFilter = useDebounce(promptFilter, 500);
  const [filteredImages, setFilteredImages] = useState(images)
  const [sortBy, setSortBy] = useState<MetaDataKey>('seed')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  useEffect(() => {
    setFilteredImages(
      images.filter(
          ({ prompt, sampler, seed }) => 
            (prompt + seed).match(debouncedPromptFilter) &&
            (!samplerFilter || sampler === samplerFilter) &&
            (!seedFilter || seed === seedFilter)
        )
        .sort((a, b) => sortOrder === 'asc'
          ? a[sortBy].localeCompare(b[sortBy])
          : b[sortBy].localeCompare(a[sortBy])
        )
    )
  }, [debouncedPromptFilter, sortBy, sortOrder, seedFilter])

  return (
    <div className="App" style={{ display: 'flex', gap: '2rem', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        Filter
        <input type="text" value={promptFilter} onChange={e => setPromptFilter(e.target.value)} />
        <div style={{ display: 'flex', gap: '.5rem' }}>
          Sort by
          <select onChange={e => setSortBy(e.target.value as MetaDataKey)}>
            <option value="prompt">Prompt</option>
            <option value="seed">Seed</option>
            <option value="steps">Steps</option>
          </select>
          <select onChange={e => setSortOrder(e.target.value as 'asc' | 'desc')}>
            <option value="asc">ascending</option>
            <option value="desc">descending</option>
          </select>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        {seedFilter &&
          <FilterPill onRemove={() => setSeedFilter('')}>
            🌱 {seedFilter}
          </FilterPill>
        }
        {samplerFilter &&
          <FilterPill onRemove={() => setSamplerFilter('')}>
            {samplerFilter}
          </FilterPill>
        }
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', width: '100%', }}>
        {filteredImages.map(image => 
          <Image {...image} key={image.file} 
            onSeedSelect={seed => setSeedFilter(seed)} 
            onSamplerSelect={sampler => setSamplerFilter(sampler)} 
            selectedSampler={samplerFilter}
            selectedSeed={seedFilter}
          /> 
        )}
      </div>
    </div>
  )
}

export default App
