import { useSearchParams } from "react-router-dom"
import { useFolder } from "../DataProvider"

const FolderSelector = () => {
  const [folder, setFolder] = useFolder()

  return <select
    onChange={e => setFolder(e.target.value)}
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