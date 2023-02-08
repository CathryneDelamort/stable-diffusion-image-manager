import Image from './Image'
import Box from '../layout/Box'
import FlexBox from '../layout/FlexBox'
import { useFilteredImages, useLoadImages } from './ImagesProvider'
import BackToTop from './BackToTop'

const ImageList = () => {
  const imagesAreLoading = useLoadImages()[1]
  const filteredImages = useFilteredImages()

  return (
    <FlexBox justifyContent="center" alignItems="flex-start">
      {imagesAreLoading
        ? <>Loading images ...</>
        : <FlexBox justifyContent="center">
          {filteredImages.length == 0 &&
            <Box>
              No images found matching your search criteria.
            </Box>
          }
          <FlexBox gap="sm" wrap justifyContent="center" alignItems="flex-start">
            {filteredImages.slice(0, 100).map((image, i) =>
              <Image {...image} key={JSON.stringify(image)} index={i} />
            )}
          </FlexBox>
        </FlexBox>
      }
      <BackToTop />
    </FlexBox> 
  )
}

export default ImageList
