import SortSelector from './SortSelector'
import Search from './Search'
import Box from '../../layout/Box'
import FlexBox from '../../layout/FlexBox'
import SizeSelector from './SizeSelector'
import DetailOptions from './DetailOptions'
import Stack from '../../layout/Stack'

const Options = () => {
  return (
    <Box display="grid">
      <Stack style={{ justifySelf: 'center' }} paddingX="md" gap="md" >
        <Stack padding="lg" gap="md" paper>
          <FlexBox placeItems="center" gap="lg" wrap>
            <Search />
            <SortSelector />
            <SizeSelector />
          </FlexBox>
        </Stack>
        <Stack padding="lg" gap="md" paper>
          <DetailOptions />
        </Stack>
      </Stack>
    </Box>
  )
}

export default Options
