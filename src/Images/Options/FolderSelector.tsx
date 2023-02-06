import { useFolder } from "../../DataProvider"
import { useImages, useSetViewerImage } from "../ImagesProvider"

const FolderSelector = () => {
  const [folder, setFolder] = useFolder()
  const [_, setImages] = useImages()
  const setViewerImage = useSetViewerImage()

  return <select
    onChange={e => {
      setImages([])
      setViewerImage(false)
      setFolder(e.target.value)
    }}
    value={folder}
  >
    <option value="">Generated</option>
    <option value="review">Review</option>
    <option value="queue">Queue</option>
    <option value="archive">Archive</option>
    <option value="trash">Trash</option>

  </select>
}

export default FolderSelector