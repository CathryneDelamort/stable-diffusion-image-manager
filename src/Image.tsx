import metadata from './metadata.json'
import Filterable from './Filterable'

type Props = typeof metadata[0] 

const Image = ({ 
    cfg,
    file, 
    model,
    prompt, 
    steps, 
    seed, 
    sampler,
}: Props) => <div style={{ width: '200px'}}>
    <a href={`/images/${file}`} target="_blank" style={{ display: 'block'}}>
        <img src={`/images/${file}`} style={{ width: '200px' }} />
    </a>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '.5rem', flexDirection: 'column' }}>
        <div title={`Model`}>{model}</div>
        <div>
            <Filterable type="seed">{seed}</Filterable>
        </div>
        <div>
            <Filterable type="sampler">{sampler}</Filterable> |{' '}
            <Filterable type="steps" value={steps}>{steps} steps</Filterable> |{' '}
            <span title="Classified Free Guidance Scale">
                <Filterable type="cfg" value={cfg}>
                    {cfg} cfg
                </Filterable>
            </span>
        </div>
        <div>
            <Filterable type="prompt">{prompt}</Filterable>
        </div>
    </div>
</div>

export default Image
