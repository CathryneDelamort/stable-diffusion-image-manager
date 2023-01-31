import { sortBy } from 'sort-by-typescript'
import { findBestMatch } from 'string-similarity'
import { useSearchParams } from 'react-router-dom'
import Image, { type ImageData } from './Image'
import FilterPill from './FilterPill'
import SortSelector from './SortSelector'
import Search, { useSearch } from './Search'
import { Box } from './Box'
import { FlexBox } from './FlexBox'
import { Stack } from './Stack'
import { useEffect, useState } from 'react'
import FolderSelector from './FolderSelector'
import BackToTop from './BakcToTop'
import SwipeMode from './SwipeMode'

function removeItem<T>(arr: Array<T>, value: T): Array<T> {
  const index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return [...arr]
}

const App = () => {
  const [swipeMode, setSwipeMode] = useState(false)
  const [checkedImages, setCheckedImages] = useState<string[]>([])
  const [searchParams] = useSearchParams()
  const [images, setImages] = useState<ImageData[]>([])
  const search = useSearch()
  const sort = searchParams.get('sort') || '-created'
  const folder = searchParams.get('folder') || 'images'
  const filters = Array.from(searchParams)
    .filter(([key]) => key.match(/^filter-/))
    .map(([key, value]) => [key.replace(/^filter-/, ''), value]) as Array<[keyof ImageData, string]>

  const filteredImages = images.filter((image: ImageData) => {
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
  }).sort(sortBy(sort))

  const handleImageChecked = (file: string, checked: boolean) => {
    if(checked) setCheckedImages(checkedImages.concat([file]))
    else setCheckedImages(removeItem(checkedImages, file))
  }

  const handleCheckedImagesAction = (to: string) => {
    if(to != 'uncheck') {
      setImages(images.filter(({ file }) => checkedImages.indexOf(file) == -1))
      fetch('/api/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ from: folder, to, images: checkedImages })
      })
        .then(() => loadImages())
    }
    setCheckedImages([])
  }

  const loadImages = () => {
    fetch('/api/images?folder=' + folder).then(r => r.json())
      .then(setImages)
  }

  useEffect(() => {
    setCheckedImages([])
    loadImages()
  }, [folder])

  return (
    <Stack gap="xl" paddingY="xl">
      {swipeMode &&
        <SwipeMode
          folder={folder}
          images={filteredImages}
          onClose={() => { loadImages(); setSwipeMode(false) }}
          onAction={handleCheckedImagesAction}
        />
      }
      <FlexBox placeItems="center" gap="md" wrap>
        <FlexBox gap="sm">
          Folder <FolderSelector />
        </FlexBox>
        <Search />
        <FlexBox gap="sm">
          Sort by <SortSelector />
        </FlexBox>
        <button onClick={() => setSwipeMode(true)}>Swipe Mode</button>
        {checkedImages.length > 0 &&
          <Box position="fixed" style={{ top: 0, right: 0, backgroundColor: '#444', zIndex: 9999, borderBottomLeftRadius: '1rem', border: '1px solid', borderTop: 'none', borderRight: 'none' }} paddingY="lg" paddingX="xl">
            <select onChange={e => handleCheckedImagesAction(e.target.value)}>
              <option>{checkedImages.length} checked images{' '}</option>
              <option value="uncheck">Uncheck {checkedImages.length} images</option>
              <option value="generated">Return {checkedImages.length} images to generated</option>
              <option value="review">Review {checkedImages.length} images</option>
              <option value="queue">Queue {checkedImages.length} images</option>
              <option value="archive">Archive {checkedImages.length} images</option>
              <option value="trash">Delete {checkedImages.length} images</option>
            </select>
          </Box>
        }
      </FlexBox>
      <FlexBox gap="md" placeItems="center">
        {filters.map(([key, value]) =>
          <FilterPill key={`${key}+${value}`} type={key.replace(/^filter-/, '')} value={value} />
        )}
      </FlexBox>
      <FlexBox gap="xl" wrap justifyContent="center">
        {!swipeMode && filteredImages.slice(0, 100).map(image =>
          <Image {...image} key={image.file} onCheckChanged={handleImageChecked} checked={checkedImages.indexOf(image.file) > -1} />
        )}
      </FlexBox>
      {!swipeMode && <BackToTop />}
    </Stack>
  )
}

export default App
