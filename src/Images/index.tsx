import { Link, useSearchParams } from 'react-router-dom'
import Image from './Image'
import FilterPill from './FilterPill'
import { Box } from '../layout/Box'
import { FlexBox } from '../layout/FlexBox'
import { Stack } from '../layout/Stack'
import { useEffect, useState } from 'react'
import { SearchProvider } from './Options/Search'
import BackToTop from './BackToTop'
import SwipeMode from './SwipeMode'
import { ImagesProvider, useCheckedImages, useFilteredImages, useFilters, useImages, useLoadImages } from './ImagesProvider'
import { useFolder } from '../DataProvider'
import AppBar from '../AppBar'
import Options from './Options'
import CheckedImages from './CheckedImages'

const ImagesComponent = () => {
  const [swipeMode, setSwipeMode] = useState(false)
  const [checkedImages, setCheckedImages] = useCheckedImages()
  const [loadImages, imagesAreLoading] = useLoadImages()
  const [folder] = useFolder()
  const filteredImages = useFilteredImages()
  const filters = useFilters()

  useEffect(() => {
    setCheckedImages([])
    loadImages()
  }, [folder])

  return (
    <Stack gap="xl">
      {!swipeMode && 
        <AppBar title="Images">
          <Stack flexDirection="row" gap="sm">
            <CheckedImages />
            <button title="Reload images" onClick={() => loadImages()}>🔃</button>
            <button title="Swipe mode" onClick={() => setSwipeMode(true)}>👆</button>
            <Link title="Settings" to="settings"><button>⚙️</button></Link>
          </Stack>
        </AppBar>
      }
      {swipeMode &&
        <SwipeMode
          images={filteredImages}
          onClose={() => { loadImages(); setSwipeMode(false) }}
        />
      }
      <Options />
      {filters.length > 0 && 
        <FlexBox gap="md" placeItems="center">
          {filters.map(([key, value]) =>
            <FilterPill key={`${key}+${value}`} type={key.replace(/^filter-/, '')} value={value} />
          )}
        </FlexBox>
      }
      <FlexBox justifyContent="center">
        {imagesAreLoading
          ? <>Loading images ...</>
          : <FlexBox justifyContent="center">
            {filteredImages.length == 0 &&
              <Box>
                No images found matching your search criteria.
              </Box>
            }
            <FlexBox gap="sm" wrap justifyContent="center">
              {!swipeMode && filteredImages.slice(0, 100).map(image =>
                <Image {...image} key={image.file} checked={checkedImages.indexOf(image.file) > -1} />
              )}
            </FlexBox>
          </FlexBox>
        }
      </FlexBox>
      {!swipeMode && <BackToTop />}
    </Stack>
  )
}

const Images = () => 
  <SearchProvider>
    <ImagesProvider>
      <ImagesComponent />
    </ImagesProvider>
  </SearchProvider>

export default Images
