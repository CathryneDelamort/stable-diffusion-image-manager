import { useSearchParams } from 'react-router-dom'
import ListView from './ListView'

const App = () => {
  const [searchParams] = useSearchParams()
  return (
    <ListView />
  )
}

export default App
