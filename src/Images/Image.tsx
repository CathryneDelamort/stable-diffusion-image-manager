import Filterable from './Filterable'
import { Box } from '../layout/Box'
import { Stack } from '../layout/Stack'
import type { ImageData } from '../types/ImageData.type'
import { useFolder } from '../DataProvider'
import { useCheckedImages, useDisplaySize, useShow } from './ImagesProvider'
import { vars } from '../styles.css'
import removeItem from '../removeItem'
import details from './details'

type Props = ImageData & {
  checked: boolean
  size: keyof typeof vars.width
}

const Image = ({ checked, size, ...image  }: Props) => {
  const {
    file,
  } = image
  const [checkedImages, setCheckedImages] = useCheckedImages()
  const [folder] = useFolder()
  const imgSrc = '/' + ['images', folder, file].filter(f => f).join('/')
  const [displaySize] =  useDisplaySize()
  const show = useShow()

  const handleImageChecked = (file: string, checked: boolean) => {
    if(checked) setCheckedImages(checkedImages.concat([file]))
    else setCheckedImages(removeItem(checkedImages, file))
  }

  const detailsToShow = (Object.keys(details) as (keyof typeof details)[]).filter(show)

  return <Stack width={displaySize} gap="sm">
    <Box position="relative">
      <Box position="absolute" style={{ top: '1rem', right: '1rem' }}>
        <input
          type="checkbox"
          style={{ height: '1.5rem', width: '1.5rem' }}
          onChange={e => handleImageChecked(file, e.target.checked)}
          checked={checked} />
      </Box>
      <a href={imgSrc} target="_blank">
        <img src={imgSrc} style={{ maxWidth: '100%', maxHeight: '100%', display: 'block' }} />
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
