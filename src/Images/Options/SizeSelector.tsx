import FlexBox from '../../layout/FlexBox'
import { useDisplaySize } from '../ImagesProvider'
import { vars } from '../../styles.css'

const SizeSelector = () => {
  const [displaySize, setDisplaySize] =  useDisplaySize()
  
  return <FlexBox gap="sm">
    Size {displaySize}
    <select
      onChange={e => setDisplaySize(e.target.value as keyof typeof vars.width)}
      value={displaySize}
    >
      <option value="xs">Extra Small</option>
      <option value="sm">Small</option>
      <option value="md">Medium</option>
      <option value="lg">Large</option>
      <option value="xl">Extra Large</option>
    </select>
  </FlexBox>
}

export default SizeSelector