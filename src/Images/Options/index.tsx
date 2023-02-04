import SortSelector from './SortSelector'
import Search from './Search'
import { Box } from '../../layout/Box'
import { FlexBox } from '../../layout/FlexBox'
import FolderSelector from './FolderSelector'
import { useHideDetails } from '../ImagesProvider'
import SizeSelector from './SizeSelector'

const Options = () => {
  const [hideDetails, setHideDetails] = useHideDetails()
  return (
    <Box display="grid" paddingX="md">
      <FlexBox 
          placeItems="center"
          gap="lg"
          wrap elevation="1"
          padding="lg"
          background="card"
          style={{ justifySelf: 'center' }}
        >
          <FlexBox gap="sm">
            Folder <FolderSelector />
          </FlexBox>
          <Search />
          <SortSelector />
          <SizeSelector />
          <label htmlFor="hidedetails" style={{ display: 'flex', gap: '.5rem'}}>
            Hide Details
            <input 
              type="checkbox"
              id="hidedetails"
              checked={hideDetails}
              onChange={e => setHideDetails(e.target.checked)}
            />
          </label>
      </FlexBox>
    </Box>
  )
}

export default Options
