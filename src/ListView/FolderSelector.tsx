import { useSearchParams } from "react-router-dom"

const FolderSelector = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const folder = searchParams.get('folder') || 'images'

  return <select
    onChange={e => {
      searchParams.set('folder', e.target.value)
      setSearchParams(searchParams)
    }}
    value={folder}
  >
    <option value="images">Generated</option>
    <option value="review">Review</option>
    <option value="queue">Queue</option>
    <option value="archive">Archive</option>
    <option value="trash">Trash</option>

  </select>
}

export default FolderSelector