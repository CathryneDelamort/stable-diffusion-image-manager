import Box from '../layout/Box'
import Stack from '../layout/Stack'
import type { ImageData } from '../types/ImageData.type'
import { useSwipeable } from 'react-swipeable'
import { useState } from 'react'
import { useFilteredImages, useMoveImages } from './ImagesProvider'

type Props = {
  onClose: () => void
}

const SwipeMode = ({ onClose }: Props) => {
  const images = useFilteredImages()
  const [swipeImages, setSwipeImages] = useState<ImageData[]>(images)
  const [index, setIndex] = useState(0)
  const moveImages = useMoveImages()
  const handleMove = (to: string) => {
    const image = swipeImages[index]
    moveImages([image], to)
    setSwipeImages(swipeImages.filter(i => JSON.stringify(i) !== JSON.stringify(image)))
  }
  const handlers = useSwipeable({
    onSwipedLeft: () => handleMove('trash'),
    onSwipedRight: () => handleMove('review'),
    onSwipedUp: () => setIndex(index + 1),
    onSwipedDown: () => index > 0 && setIndex(index - 1)
  })
  const { file, folder, prompt } = swipeImages[index]
  const imgSrc = '/' + ['images', folder, file].filter(f => f).join('/')

  return <Stack
    position="fixed"
    alignItems="center"
    justifyContent="center"
    gap="md"
    style={{ top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: '#333' }}
  >
    <Box position="absolute" style={{ top: '1rem', right: '1rem' }}>
      <button onClick={onClose}>X</button>
    </Box>
    <Box>← Delete | ↑ Next | ↓ Previous | → Review</Box>
    <Box {...handlers}>
      <img src={imgSrc} style={{ maxWidth: '100vw' }} />
    </Box>
    <Box
      paddingX="sm" style={{
        maxHeight: '1.5rem',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }}>
      {prompt}
    </Box>
  </Stack>
}

export default SwipeMode