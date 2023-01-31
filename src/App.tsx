import { sortBy } from 'sort-by-typescript'
import { findBestMatch } from 'string-similarity'
import { useSearchParams } from 'react-router-dom'
import images from './metadata.json'
import Image from './Image'
import FilterPill from './FilterPill'
import SortSelector from './SortSelector'
import Search, { useSearch } from './Search'

type ImageMetadata = typeof images[0]
type ImageGroups = { [key: string]: ImageMetadata[] }

const seedGroupPrompts: { [key: string]: string[]} = {}
const getGroupKey = ({ seed, prompt}: ImageMetadata) => {
  const sanitizedPrompt = prompt.replace(/\s|-|\[|\]|\(|\)/g, '')
  seedGroupPrompts[seed] = seedGroupPrompts[seed] || []
  if(seedGroupPrompts[seed].length === 0) {
    seedGroupPrompts[seed].push(sanitizedPrompt)
    return seed + sanitizedPrompt
  }
  
  const { bestMatch: { rating, target }} = findBestMatch(sanitizedPrompt, seedGroupPrompts[seed])
  if(rating > .7) return seed + target
  seedGroupPrompts[seed].push(sanitizedPrompt)
  return seed + sanitizedPrompt
}
const imageGroups = images.reduce(
  (acc, image) => {
    const groupKey = getGroupKey(image)
    acc[groupKey] = acc[groupKey] || []
    acc[groupKey].push(image)
    return acc
  }, 
  {} as ImageGroups
)

const App = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const search = useSearch()
  const sort = searchParams.get('sort') || '-created'
  const groupImages = searchParams.get('groupImages') == 'true' || false
  const filters = Array.from(searchParams)
    .filter(([key]) => key.match(/^filter-/))
    .map(([key, value]) => [key.replace(/^filter-/, ''), value]) as Array<[keyof ImageMetadata, string]>

  const filterImage = (image: ImageMetadata) => 
    (image.prompt + image.seed).match(search) && 
    filters.reduce(
      (passing, [key, value]) => passing && image[key] === value,
      true
    )

  const representsGroup = (image: ImageMetadata) => {
    const candidates = imageGroups[getGroupKey(image)].filter(filterImage).sort(sortBy(sort))
    return candidates.length === 1 || image == candidates[0]
  }

  const filteredImages = images.filter((image: ImageMetadata) =>
    filterImage(image) &&
    (filters.length > 0 || !groupImages || representsGroup(image))
  )

  return (
    <div style={{ display: 'flex', gap: '2rem', flexDirection: 'column', padding: '2rem' }}>
      <div style={{ display: 'flex', placeContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <Search />
        <div style={{ display: 'flex', gap: '.5rem' }}>
          Sort by <SortSelector />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        {filters.length === 0 && 
            <div style={{ display: 'flex', gap: '.5rem' }} title="Groups images by same seed and prompt">
              Group variations
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
        {filters.map(([key, value]) =>
          <FilterPill key={`${key}+${value}`} type={key.replace(/^filter-/, '')} value={value} />
        )}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem'}}>
        {filteredImages.sort(sortBy(sort)).map(image => 
          <Image {...image} key={image.file} /> 
        )}
      </div>
    </div>
  )
}

export default App
