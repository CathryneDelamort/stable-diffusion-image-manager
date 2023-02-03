import { Box } from "../layout/Box"
import { Stack } from "../layout/Stack"
import type { ImageData } from "../types/ImageData.type"
import { useSwipeable } from "react-swipeable"
import { useState } from "react"

type Props = {
  folder: string
  images: ImageData[]
  onClose: () => void,
  onAction: (diection: 'review' | 'delete' ) => void,
}

const SwipeMode = ({ folder, images, onClose, onAction}: Props) => {
  const [swipeImages, setSwipeImages] = useState<ImageData[]>(images)
  const [index, setIndex] = useState(0)
  const handlers = useSwipeable({
    onSwipedLeft: () => handleMove('trash'),
    onSwipedRight: () => handleMove('review'),
    onSwipedUp: () => setIndex(index + 1),
    onSwipedDown: () => index > 0 && setIndex(index - 1)
  });
  const handleMove = (to: string) => {
    const file = swipeImages[index].file
    fetch('/api/move', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ from: folder, to, images: [file] })
    })
    setSwipeImages(swipeImages.filter(i => i.file !== file))
  }
  const { file, prompt } = swipeImages[index]
  const imgSrc = '/' + ['images', folder, file].filter(f => f).join('/')

  return <Stack
    position="fixed"
    alignItems="center"
    justifyContent="center"
    gap="md"
    style={{ top: 0, left:0, width: '100vw', height: '100vh', backgroundColor: '#333'}}
  >
    <Box>← Delete | ↑ Skip | ↓ Previous | → Review</Box>
    <Box {...handlers}>
      <img src={imgSrc} style={{ maxWidth: '100vw' }} />
    </Box>
    <Box style={{ textAlign: 'center' }} paddingX="md">{prompt}</Box>
    <Box position="absolute" style={{ top: '1rem', right: '1rem' }}>
      <button onClick={onClose}>X</button>
    </Box>
  </Stack>
}

export default SwipeMode