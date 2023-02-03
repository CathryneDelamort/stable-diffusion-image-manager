import Filterable from './Filterable'
import { Box } from '../layout/Box'
import { Stack } from '../layout/Stack'
import type { ImageData } from '../types/ImageData.type'
import { useFolder } from '../DataProvider'

type Props = ImageData & {
  onCheckChanged: (fileName: string, checked: boolean) => void,
  checked: boolean
}

const Image = ({
  cfg,
  file,
  model,
  prompt,
  steps,
  seed,
  sampler,
  onCheckChanged,
  checked
}: Props) => {
  const [folder] = useFolder()
  const imgSrc = '/' + ['images', folder, file].filter(f => f).join('/')

  return <Box style={{ maxWidth: '40ch' }} position="relative">
    <Box position="absolute" style={{ top: '1rem', right: '1rem' }}>
      <input
        type="checkbox"
        style={{ height: '1.5rem', width: '1.5rem' }}
        onChange={e => onCheckChanged(file, e.target.checked)}
        checked={checked} />
    </Box>
    <a href={imgSrc} target="_blank" style={{ display: 'block', maxWidth: '40ch', height: '40ch' }}>
      <img src={imgSrc} style={{ maxWidth: '100%', maxHeight: '100%' }} />
    </a>
    <Stack justifyContent="center" gap="sm">
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
        <Filterable type="prompt">{prompt}</Filterable>
      </Box>
    </Stack>
  </Box>
}

export default Image
