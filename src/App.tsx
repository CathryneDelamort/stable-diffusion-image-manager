import { sortBy } from 'sort-by-typescript'
import { findBestMatch } from 'string-similarity'
import { useSearchParams } from 'react-router-dom'
import images from './metadata.json'
import Image from './Image'
import FilterPill from './FilterPill'
import SortSelector from './SortSelector'
import Search, { useSearch } from './Search'
import { Box } from './Box'
import { FlexBox } from './FlexBox'
import { Stack } from './Stack'

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

  const filterImage = (image: ImageMetadata) => {
    const searchTargets = image.prompt.toLowerCase().split(' ')
    const searchSanitized = search.replace(/^\s*/, '').replace(/\s*$/, '').toLowerCase()
    const promptWords = searchSanitized.split(' ')
    const searchTests = promptWords.filter(word => word.length > 2)
      .map(word => word.match(/^-/) // word should not be present?
        ? .6 - findBestMatch(word, searchTargets).bestMatch.rating
        : findBestMatch(word, searchTargets).bestMatch.rating
      )
    return (
      searchTests.length == 0 || // there is nothing to search
      (searchSanitized.match(/^\d/) && image.seed.match(searchSanitized)) || //match seed
      Math.min(...searchTests) > .4
    ) &&
    filters.reduce(
      (passing, [key, value]) => passing && image[key] === value,
      true
    )
  }

  const representsGroup = (image: ImageMetadata) => {
    const candidates = imageGroups[getGroupKey(image)].filter(filterImage).sort(sortBy(sort))
    return candidates.length === 1 || image == candidates[0]
  }

  const filteredImages = images.filter((image: ImageMetadata) =>
    filterImage(image) &&
    (filters.length > 0 || !groupImages || representsGroup(image))
  )

  return (
    <Stack gap="xl" padding="xl">
      <FlexBox placeItems="center" gap="md" wrap>
        <Search />
        <FlexBox gap="sm">
          Sort by <SortSelector />
        </FlexBox>
      </FlexBox>
      <FlexBox gap="md" justifyContent="center">
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
      </FlexBox>
      <FlexBox gap="xl" wrap>
        {filteredImages.sort(sortBy(sort)).map(image => 
          <Image {...image} key={image.file} /> 
        )}
      </FlexBox>
    </Stack>
  )
}

export default App
