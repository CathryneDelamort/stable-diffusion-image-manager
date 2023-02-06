import { MouseEvent, useEffect, useRef } from 'react'
import Filterable from './Filterable'
import { Box } from '../layout/Box'
import { Stack } from '../layout/Stack'
import type { ImageData } from '../types/ImageData.type'
import { useFolder } from '../DataProvider'
import { useCheckedImages, useDisplaySize, useSetViewerImage, useShow, useViewerIndex } from './ImagesProvider'
import removeItem from '../removeItem'
import details from './details'

type Props = ImageData & {
  checked: boolean,
  index: number
}

function isElementInViewport(el: Element) {
  var rect = el.getBoundingClientRect();
  return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /* or $(window).height() */
      rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
  );
}

const Image = ({ checked, index, ...image  }: Props) => {
  const ref = useRef<HTMLImageElement>()
  const { file } = image
  const [checkedImages, setCheckedImages] = useCheckedImages()
  const [viewerIndex] = useViewerIndex()
  const setViewerImage = useSetViewerImage()
  const [folder] = useFolder()
  const imgSrc = '/' + ['images', folder, file].filter(f => f).join('/')
  const [displaySize] =  useDisplaySize()
  const show = useShow()

  const handleImageChecked = (file: string, checked: boolean) => {
    if(checked) setCheckedImages(checkedImages.concat([file]))
    else setCheckedImages(removeItem(checkedImages, file))
  }

  const detailsToShow = (Object.keys(details) as (keyof typeof details)[]).filter(show)

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if(window.innerWidth > 1024) {
      setViewerImage(image)
      if(!e.metaKey) e.preventDefault()
    }
  }

  useEffect(() => {
    if(index === viewerIndex && ref.current && !isElementInViewport(ref.current)) {
      ref.current.scrollIntoView({ block: 'center', inline: 'nearest' })
    }
  }, [viewerIndex])

  return <Stack width={displaySize} gap="sm" ref={ref}>
    <Box position="relative">
      <Box position="absolute" style={{ top: '1rem', right: '1rem' }}>
        <input
          type="checkbox"
          style={{ height: '1.5rem', width: '1.5rem' }}
          onChange={e => handleImageChecked(file, e.target.checked)}
          checked={checked} />
      </Box>
      <a href={imgSrc} target="_blank" onClick={handleClick}>
        <img 
          src={imgSrc}
          style={{ 
            maxWidth: '100%', 
            maxHeight: '100%', 
            display: 'block',
            border: viewerIndex == index ? '2px inset' : 'none'
          }} />
      </a>
    </Box>
    {detailsToShow.length > 0 && 
      <Stack justifyContent="center" gap="xs">
        {detailsToShow.map(key =>
          <Box title={`Model`} key={key}>
            {details[key].title}: <Filterable type={key}>{image[key]}</Filterable>
          </Box>
        )}
      </Stack>
    }
  </Stack>
}

export default Image
