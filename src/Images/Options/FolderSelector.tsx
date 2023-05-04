import { useFolder } from '../../DataProvider'
import { useImages, useSetViewerImage } from '../ImagesProvider'

const FolderSelector = () => {
  const [folder, setFolder] = useFolder()
  const setImages = useImages()[1]
  const setViewerImage = useSetViewerImage()

  return <select
    onChange={e => {
      setImages([])
      setViewerImage(false)
      setFolder(e.target.value)
    }}
    value={folder}
    style={{ fontSize: '1.5rem', padding: '.5rem', border: 'none', background: 'none' }}
  >
    <option value="_ALL_">🌄&nbsp; All Images</option>
    <option value="">📁&nbsp; Root</option>
    <option value="review">📁&nbsp; Review</option>
    <option value="queue">📁&nbsp; Queue</option>
    <option value="upscaled">📁&nbsp; Upscaled</option>
    <option value="archive">📁&nbsp; Archive</option>
    <option value="trash">🗑 Trash</option>

  </select>
}

export default FolderSelector