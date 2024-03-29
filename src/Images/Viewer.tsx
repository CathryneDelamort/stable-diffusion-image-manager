import Box from '../layout/Box'
import Stack from '../layout/Stack'
import { KeyboardEvent, SyntheticEvent, useEffect, useState } from 'react'
import { useFilteredImages, useMoveImages, useSetViewerImage, useViewerImage, useViewerIndex } from './ImagesProvider'

const KeyListener = () => {
  const [viewerIndex, setViewerIndex] = useViewerIndex()
  const setViewerImage = useSetViewerImage()
  const filteredImages = useFilteredImages()
  const image = useViewerImage()
  const moveImages = useMoveImages()
  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent<Element>) => {
      if(e.key == 'ArrowLeft' && viewerIndex > 0) {
        setViewerIndex(viewerIndex - 1)
      }
      if(e.key == 'ArrowRight' && viewerIndex < filteredImages.length - 1) {
        setViewerIndex(viewerIndex + 1)
      }
      if(e.key == 'Escape') setViewerImage(false)
      if(e.key === 'Delete') moveImages([image], 'trash')
    }
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keyup', handleKeyUp)

    }
  })
  return null
}

const Viewer = () => {
  const setViewerImage = useSetViewerImage()
  const image = useViewerImage()
  const [maxWidth, setMaxWidth] = useState(Infinity)
  if (!image) return null
  const imgSrc = '/' + ['images', image.folder, image.file].filter(f => f).join('/')
  const handleImageLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    setMaxWidth(e.target.naturalWidth)
  }

  return image
    ? <Box style={{ maxWidth: `${maxWidth}px` }}>
      <Stack style={{ minWidth: '50vw', backgroundColor: 'yellow' }} position="relative">
        <KeyListener />
        <Box position="fixed">
          <img src={imgSrc} style={{ width: '100%' }} onLoad={handleImageLoad} />
          <button
            onClick={() => setViewerImage(false)}
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