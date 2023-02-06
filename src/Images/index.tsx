import { Link } from 'react-router-dom'
import FilterPill from './FilterPill'
import { FlexBox } from '../layout/FlexBox'
import { Stack } from '../layout/Stack'
import { useEffect, useState } from 'react'
import { SearchProvider } from './Options/Search'
import SwipeMode from './SwipeMode'
import { ImagesProvider, useCheckedImages, useFilters, useLoadImages } from './ImagesProvider'
import { useFolder } from '../DataProvider'
import AppBar from '../AppBar'
import Options from './Options'
import CheckedImages from './CheckedImages'
import details from './details'
import Viewer from './Viewer'
import ImageList from './ImageList'
import { Box } from '../layout/Box'

const ImagesComponent = () => {
  const [swipeMode, setSwipeMode] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [_, setCheckedImages] = useCheckedImages()
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
            <Stack gap="sm" width="full">
              <FlexBox alignItems="center" justifyContent="space-between">
                <Box style={{fontSize: '1.5rem'}}>Images</Box>
                <Stack>
                  <Stack flexDirection="row" gap="sm">
                    <CheckedImages />
                    <button title="Reload images" onClick={() => loadImages()}>🔃</button>
                    <button title="Swipe mode" onClick={() => setSwipeMode(true)}>👆</button>
                    <button title="Options" onClick={() => setShowOptions(!showOptions)}>👁</button>
                    <Link title="Settings" to="settings"><button>⚙️</button></Link>
                  </Stack>
                </Stack>
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
