import Filterable from './Filterable'
import { Box } from '../layout/Box'
import { Stack } from '../layout/Stack'
import type { ImageData } from '../types/ImageData.type'
import { useFolder } from '../DataProvider'
import { useCheckedImages, useHideDetails } from './ImagesProvider'

type Props = ImageData & {
  checked: boolean
}

function removeItem<T>(arr: Array<T>, value: T): Array<T> {
  const index = arr.indexOf(value)
  if (index > -1) arr.splice(index, 1)
  return [...arr]
}

const Image = ({
  cfg,
  denoise,
  faceRestoration,
  file,
  hiresUpscaler,
  model,
  prompt,
  steps,
  seed,
  sampler,
  checked
}: Props) => {
  const [checkedImages, setCheckedImages] = useCheckedImages()
  const [folder] = useFolder()
  const imgSrc = '/' + ['images', folder, file].filter(f => f).join('/')
  const [hideDetails] = useHideDetails()

  const handleImageChecked = (file: string, checked: boolean) => {
    if(checked) setCheckedImages(checkedImages.concat([file]))
    else setCheckedImages(removeItem(checkedImages, file))
  }

  return <Stack style={{ maxWidth: '30ch' }} gap="sm">
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
    {!hideDetails &&
      <Stack justifyContent="center" gap="xs">
        <Box title={`Model`}>
          Model hash: <Filterable type="model">{model}</Filterable>
        </Box>
        <Box>
          <Filterable type="seed">{seed}</Filterable>
        </Box>
        <Box>
          <Filterable type="sampler">{sampler}</Filterable> |{' '}
          <Filterable type="steps" value={steps + ''}>{steps} steps</Filterable> |{' '}
          <span title="Classified Free Guidance Scale">
            <Filterable type="cfg" value={cfg + ''}>
              {cfg} cfg
            </Filterable>
          </span>
        </Box>
        <Box>
          Face restoration: <Filterable type="faceRestoration">{faceRestoration}</Filterable>
        </Box>
        <Box>
          Hires upscaler: <Filterable type="hiresUpscaler">{hiresUpscaler}</Filterable>
        </Box>
        <Box>
          Denoising strength: <Filterable type="denoise">{denoise}</Filterable>
        </Box>
        <Box>
          <Filterable type="prompt">{prompt}</Filterable>
        </Box>
      </Stack>
    }
  </Stack>
}

export default Image
