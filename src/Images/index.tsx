import { Link } from 'react-router-dom'
import FilterPill from './FilterPill'
import FlexBox from '../layout/FlexBox'
import Stack from '../layout/Stack'
import { useEffect, useState } from 'react'
import Search, { SearchProvider } from './Options/Search'
import SwipeMode from './SwipeMode'
import { ImagesProvider, useCheckedImages, useFilters, useLoadImages } from './ImagesProvider'
import { useFolder } from '../DataProvider'
import AppBar from '../AppBar'
import Options from './Options'
import CheckedImages from './CheckedImages'
import details from './details'
import Viewer from './Viewer'
import ImageList from './ImageList'
import FolderSelector from './Options/FolderSelector'
import Box from '../layout/Box'
import SortSelector from './Options/SortSelector'
import SizeSelector from './Options/SizeSelector'

const ImagesComponent = () => {
  const [swipeMode, setSwipeMode] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const setCheckedImages = useCheckedImages()[1]
  const [loadImages] = useLoadImages()
  const [folder] = useFolder()
  const filters = useFilters()

  useEffect(() => {
    setCheckedImages([])
    loadImages()
  }, [folder])

  return (
    <Stack>
      {swipeMode &&
        <SwipeMode onClose={() => { loadImages(); setSwipeMode(false) }} />
      }
      {!swipeMode &&
        <Stack gap="md">
          <AppBar>
            <Stack gap="md" width="full">
              <FlexBox 
                alignItems="center"
                wrap gap="md"
                justifyContent={{ sm: 'flex-start', md: 'space-between' }}
                flexDirection={{ sm: 'column', md: 'row' }}
              >
                <FlexBox alignItems="center" gap="lg">
                  <FolderSelector />
                  <FlexBox alignItems="center" gap="lg" display={{ sm: 'none', lg: 'flex'}}>
                    <Search />
                    <SortSelector />
                    <SizeSelector />
                  </FlexBox>
                </FlexBox>
                <FlexBox gap="sm" justifyContent="flex-end">
                  <CheckedImages />
                  <button title="Reload images" onClick={() => loadImages()}>🔃</button>
                  <Box display={{ md: 'none' }}>
                    <button title="Swipe mode" onClick={() => setSwipeMode(true)}>👆</button>
                  </Box>
                  <button title="Options" onClick={() => setShowOptions(!showOptions)}>👁</button>
                  <Link title="Settings" to="settings"><button>⚙️</button></Link>
                </FlexBox>
              </FlexBox>
              {showOptions && <Options />}
            </Stack>
          </AppBar>
          {filters.length > 0 &&
            <FlexBox gap="md" placeItems="center">
              {filters.map(([key, value]) =>
                <FilterPill
                  key={`${key}+${value}`}
                  type={key.replace(/^filter-/, '') as keyof typeof details}
                  value={value}
                />
              )}
            </FlexBox>
          }
          <FlexBox gap="md">
            <ImageList />
            <Viewer />
          </FlexBox>
        </Stack>
      }
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
