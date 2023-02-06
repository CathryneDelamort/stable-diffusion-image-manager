import { useLocation, useNavigate} from 'react-router-dom'
import { useSettings } from './DataProvider'
import { FlexBox } from './layout/FlexBox'
import Images from './Images'
import SettingsView from './SettingsView'
import { Link, Routes, Route } from 'react-router-dom'
import { Box } from './layout/Box'

const App = () => {
  const settings = useSettings()
  const navigate = useNavigate()
  const location = useLocation()
  if(settings.loaded && !settings.imagePath && location.pathname != '/settings') {
    navigate('/settings')
  }
  
  return <Box paddingBottom="xl">
    <Routes>
      <Route path="/" element={<Images />} />
      <Route path="/settings" element={<SettingsView />} />
    </Routes>
  </Box>
}

export default App
