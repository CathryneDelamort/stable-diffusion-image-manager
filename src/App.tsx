import { sortBy } from 'sort-by-typescript'
import './App.css'
import { useEffect, useState } from 'react'
import images from '../public/metadata.json'
import Image from './Image'
import FilterPill from './FilterPill'
import useDebounce from './use-debounce'

type ImageMetadata = typeof images[0]
type MetaDataKey = keyof ImageMetadata
type MetaDataLists = Record<MetaDataKey, string[]>
type ImageGroups = { [key: string]: ImageMetadata[] }

const getGroupKey = ({ seed, prompt}: ImageMetadata) => seed + prompt.replace(/\[|\]|\(|\)/g, '')
const imageGroups = images.reduce(
  (acc, image) => {
    const groupKey = getGroupKey(image)
    acc[groupKey] = acc[groupKey] || []
    acc[groupKey].push(image)
    return acc
  }, 
  {} as ImageGroups
)
const getImageGroup = (image: ImageMetadata) => imageGroups[getGroupKey(image)]

function App() {
  const [search, setSearch] = useState('')
  const [seedFilter, setSeedFilter] = useState('')
  const [groupImages, setGroupImages] = useState(false)
  const [samplerFilter, setSamplerFilter] = useState('')
  const debouncedPromptFilter = useDebounce(search, 500);
  const [filteredImages, setFilteredImages] = useState(images)
  const [sortKey, setSortBy] = useState('-created')
  const pillFilterApplied = Boolean(seedFilter || samplerFilter)

  const filterImage = ({ seed, prompt, sampler }: ImageMetadata) => 
    (prompt + seed).match(debouncedPromptFilter) &&
    (!samplerFilter || sampler === samplerFilter) &&
    (!seedFilter || seed === seedFilter)

  const getFilteredImageGroup = (image: ImageMetadata) => 
    getImageGroup(image).filter(filterImage)

  const representsGroup = (image: ImageMetadata) => {
    const candidates = getFilteredImageGroup(image).sort(sortBy(sortKey))
    return candidates.length === 1 || image == candidates[0]
  }

  useEffect(() => {
    setFilteredImages(
      images
        .filter((image: ImageMetadata) =>
          filterImage(image) &&
          (pillFilterApplied || !groupImages || representsGroup(image))
        )
        .sort(sortBy(sortKey))
    )
  }, [debouncedPromptFilter, pillFilterApplied, groupImages, sortKey, seedFilter, imageGroups])

  return (
    <div className="App" style={{ display: 'flex', gap: '2rem', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '.5rem' }}>
          Filter
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: '.5rem' }}>
          Sort by
          <select onChange={e => setSortBy(e.target.value as MetaDataKey)}>
            <option value="created" selected={sortKey === 'created'}>Created ⬆</option>
            <option value="-created" selected={sortKey === '-created'}>Created ⬇</option>
            <option value="prompt" selected={sortKey === 'prompt'}>Prompt ⬆</option>
            <option value="-prompt" selected={sortKey === '-prompt'}>Prompt ⬇</option>
            <option value="prompt,seed" selected={sortKey === 'prompt,seed'}>Prompt ⬆, Seed ⬆</option>
            <option value="-prompt" selected={sortKey === '-prompt'}>Prompt ⬇</option>
            <option value="seed" selected={sortKey === 'seed'}>Seed ⬆</option>
            <option value="-seed" selected={sortKey === '-seed'}>Seed ⬇</option>
            <option value="steps,sampler" selected={sortKey === 'steps'}>Steps ⬆, Sampler ⬆</option>
            <option value="-steps,sampler" selected={sortKey === '-steps'}>Steps ⬇, Sampler ⬆</option>
            <option value="steps" selected={sortKey === 'steps'}>Steps ⬆</option>
            <option value="-steps" selected={sortKey === '-steps'}>Steps ⬇</option>
          </select>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        {!pillFilterApplied && 
            <div style={{ display: 'flex', gap: '.5rem' }} title="Groups images by same seed and prompt">
              Group similar images
              <input type="checkbox" checked={groupImages} onChange={e => setGroupImages(e.target.checked)} />
            </div>
          }
        {seedFilter &&
          <FilterPill onRemove={() => setSeedFilter('')}>
            🌱 {seedFilter}
          </FilterPill>
        }
        {samplerFilter &&
          <FilterPill onRemove={() => setSamplerFilter('')}>
            🔎 {samplerFilter}
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
