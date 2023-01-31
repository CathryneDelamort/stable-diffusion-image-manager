import metadata from '../public/metadata.json'
import Filterable from './Filterable'

type Props = typeof metadata[0] & {
    onSeedSelect: (seed: string) => void,
    onSamplerSelect: (seed: string) => void,
    selectedSeed?: string,
    selectedSampler?: string
}

const Image = ({ 
    file, 
    model,
    prompt, 
    steps, 
    seed, 
    sampler,
    onSeedSelect,
    onSamplerSelect,
    selectedSeed,
    selectedSampler
}: Props) => <div style={{ width: '200px'}}>
    <a href={`/images/${file}`} target="_blank" style={{ display: 'block'}}>
        <img src={`/images/${file}`} style={{ width: '200px' }} />
    </a>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '.5rem', flexDirection: 'column' }}>
        <div title={`Model`}>{model}</div>
        <div>
            {seed === selectedSeed 
                ? seed
                : <Filterable onFilter={() => onSeedSelect(seed)}>{seed}</Filterable>
            }
        </div>
        <div>
            {sampler === selectedSampler
                ? sampler
                : <Filterable onFilter={() => onSamplerSelect(sampler)}>{sampler}</Filterable>
            }
            {' '} at {steps} steps
        </div>
        <div>{prompt}</div>
    </div>
</div>

export default Image
