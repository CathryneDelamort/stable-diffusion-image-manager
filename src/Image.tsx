import { useSearchParams } from 'react-router-dom'
import Filterable from './Filterable'
import { Box } from './Box'
import { Stack } from './Stack'

export type ImageData = {
  file: string
  seed: string
  prompt: string
  styles: string
  model: string
  sampler: string
  steps: string
  cfg: string
  width: string
  height: string
  created: string
}

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
  const [searchParams] = useSearchParams()
  const folder = searchParams.get('folder') || 'images'

  return <Box style={{ maxWidth: '40ch' }} position="relative">
    <Box position="absolute" style={{ top: '1rem', right: '1rem' }}>
      <input
        type="checkbox"
        style={{ height: '1.5rem', width: '1.5rem' }}
        onChange={e => onCheckChanged(file, e.target.checked)}
        checked={checked} />
    </Box>
    <a href={`/${folder}/${file}`} target="_blank" style={{ display: 'block', maxWidth: '40ch', height: '40ch' }}>
      <img src={`/${folder}/${file}`} style={{ maxWidth: '100%', maxHeight: '100%' }} />
    </a>
    <Stack justifyContent="center" gap="sm">
      <Box title={`Model`}>
        <Filterable type="model">{model}</Filterable>
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
