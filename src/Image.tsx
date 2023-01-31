import metadata from './metadata.json'
import Filterable from './Filterable'
import { Box } from './Box'
import { FlexBox } from './FlexBox'
import { Stack } from './Stack'

type Props = typeof metadata[0] 

const Image = ({ 
    cfg,
    file, 
    model,
    prompt, 
    steps, 
    seed, 
    sampler,
}: Props) => <Box style={{ width: '200px'}}>
    <a href={`/images/${file}`} target="_blank" style={{ display: 'block'}}>
        <img src={`/images/${file}`} style={{ width: '200px' }} />
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
            <Filterable type="steps" value={steps}>{steps} steps</Filterable> |{' '}
            <span title="Classified Free Guidance Scale">
                <Filterable type="cfg" value={cfg}>
                    {cfg} cfg
                </Filterable>
            </span>
        </Box>
        <Box>
            <Filterable type="prompt">{prompt}</Filterable>
        </Box>
    </Stack>
</Box>

export default Image
