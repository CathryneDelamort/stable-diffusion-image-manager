import { useLocation, useNavigate} from 'react-router-dom'
import { useSettings } from './DataProvider'
import { FlexBox } from './layout/FlexBox'
import ListView from './ListView'
import SettingsView from './SettingsView'
import { Link, Routes, Route } from 'react-router-dom'

const App = () => {
  const { imagePath } = useSettings()
  const navigate = useNavigate()
  const location = useLocation()
  if(!imagePath && location.pathname != '/settings') {
    navigate('/settings')
  }
  
  return <>
    <Routes>
      <Route path="/" element={<ListView />} />
      <Route path="/settings" element={<SettingsView />} />
    </Routes>
  </>
}

export default App
