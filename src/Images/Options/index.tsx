import SortSelector from './SortSelector'
import Search from './Search'
import { Box } from '../../layout/Box'
import { FlexBox } from '../../layout/FlexBox'
import FolderSelector from './FolderSelector'

const Options = () => {
  return (
    <Box display="grid" paddingX="md">
      <FlexBox 
          placeItems="center"
          gap="md"
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
      </FlexBox>
    </Box>
  )
}

export default Options
