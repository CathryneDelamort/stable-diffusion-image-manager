import { Box } from "../layout/Box"
import { Stack } from "../layout/Stack"
import type { ImageData } from "../types/ImageData.type"
import { useSwipeable } from "react-swipeable"
import { ReactEventHandler, SyntheticEvent, useState } from "react"
import { useFilteredImages, useMoveImages, useViewerImage, useViewerIndex } from "./ImagesProvider"
import { useFolder } from "../DataProvider"

type Props = {
  onClose: () => void
}

const Viewer = () => {
  const image = useViewerImage()
  const [maxWidth, setMaxWidth] = useState(Infinity)
  if(!image) return null
  const [viewerIndex, setViewerIndex] = useViewerIndex()
  const [folder] = useFolder()
  const imgSrc = '/' + ['images', folder, image.file].filter(f => f).join('/')
  const handleImageLoad = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    setMaxWidth(e.target.naturalWidth)
  }
  return image
    ? <Box style={{ maxWidth: `${maxWidth}px` }}>
      <Stack style={{ minWidth: '50vw', backgroundColor: 'yellow' }} position="relative">
        <Box position="fixed">
          <img src={imgSrc} style={{ width: '100%' }} onLoad={handleImageLoad} />
          <button 
            onClick={() => setViewerIndex(false)}
            style={{ position: 'absolute', top: '1rem', right: '1rem' }}
          >
            X
          </button>
        </Box>
      </Stack>
    </Box>
  : null
}

export default Viewer