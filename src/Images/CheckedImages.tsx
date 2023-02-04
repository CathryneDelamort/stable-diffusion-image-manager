import { useFolder } from "../DataProvider"
import { useCheckedImages, useImages, useLoadImages, useMoveImages} from "./ImagesProvider"

const CheckedImages = () => {
  const [checkedImages, setCheckedImages] = useCheckedImages()
  const moveImages = useMoveImages()

  const handleCheckedImagesAction = (to: string) => {
    if(to != 'uncheck') moveImages(checkedImages, to)
    setCheckedImages([])
  }

  return <>
    {checkedImages.length > 0 &&
      <select onChange={e => handleCheckedImagesAction(e.target.value)}>
        <option>{checkedImages.length} checked ...</option>
        <option value="uncheck">Uncheck all</option>
        <option value="images">Move to root</option>
        <option value="review">Move to Review</option>
        <option value="queue">Move to Queue</option>
        <option value="archive">Move to Archive</option>
        <option value="trash">Delete</option>
      </select>
    }
  </>
}

export default CheckedImages