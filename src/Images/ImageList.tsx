import Image from './Image'
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
            <FlexBox padding="xl" placeItems="center" style={{ textAlign: 'center' }}>
              No images found matching your search criteria. 😔
            </FlexBox>
          }
          <FlexBox gap="sm" wrap justifyContent="center" alignItems="flex-start">
            {filteredImages.map((image: ImageData, i: number) =>
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
