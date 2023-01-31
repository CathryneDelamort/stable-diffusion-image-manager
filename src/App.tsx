import { sortBy } from 'sort-by-typescript'
import { useSearchParams } from "react-router-dom"
import './App.css'
import { useEffect, useState } from 'react'
import images from '../public/metadata.json'
import Image from './Image'
import FilterPill from './FilterPill'
import useDebounce from './use-debounce'
import SortSelector from './SortSelector'

type ImageMetadata = typeof images[0]
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
  const [searchParams, setSearchParams] = useSearchParams()
  const sort = searchParams.get('sort') || '-created'
  const groupImages = searchParams.get('groupImages') == 'true' || false
  const [search, setSearch] = useState('')
  const [seedFilter, setSeedFilter] = useState('')
  const [samplerFilter, setSamplerFilter] = useState('')
  const debouncedPromptFilter = useDebounce(search, 500);
  const [filteredImages, setFilteredImages] = useState(images)
  const pillFilterApplied = Boolean(seedFilter || samplerFilter)

  const filterImage = ({ seed, prompt, sampler }: ImageMetadata) => 
    (prompt + seed).match(debouncedPromptFilter) &&
    (!samplerFilter || sampler === samplerFilter) &&
    (!seedFilter || seed === seedFilter)

  const getFilteredImageGroup = (image: ImageMetadata) => 
    getImageGroup(image).filter(filterImage)

  const representsGroup = (image: ImageMetadata) => {
    const candidates = getFilteredImageGroup(image).sort(sortBy(sort))
    return candidates.length === 1 || image == candidates[0]
  }

  useEffect(() => {
    setFilteredImages(
      images
        .filter((image: ImageMetadata) =>
          filterImage(image) &&
          (pillFilterApplied || !groupImages || representsGroup(image))
        )
    )
  }, [debouncedPromptFilter, pillFilterApplied, groupImages, sort, seedFilter, imageGroups])

  return (
    <div className="App" style={{ display: 'flex', gap: '2rem', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '.5rem' }}>
          Filter
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: '.5rem' }}>
          Sort by <SortSelector />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        {!pillFilterApplied && 
            <div style={{ display: 'flex', gap: '.5rem' }} title="Groups images by same seed and prompt">
              Group similar images
              <input 
                type="checkbox" 
                checked={groupImages} 
                onChange={e => {
                  searchParams.delete('groupImages')
                  if(e.target.checked) searchParams.append('groupImages', 'true')
                  setSearchParams(searchParams)
                }}
              />
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
        {filteredImages.sort(sortBy(sort)).map(image => 
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
