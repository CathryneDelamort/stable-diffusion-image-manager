import { useFolder } from "../../DataProvider"
import { useImages } from "../ImagesProvider"

const FolderSelector = () => {
  const [folder, setFolder] = useFolder()
  const [_, setImages] = useImages()

  return <select
    onChange={e => {
      setImages([])
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