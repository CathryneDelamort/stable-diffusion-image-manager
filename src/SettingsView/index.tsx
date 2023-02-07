import { useEffect, useState } from 'react'
import { useSettings } from '../DataProvider'
import Box from '../layout/Box'
import Stack from '../layout/Stack'
import FlexBox from '../layout/FlexBox'
import { Link, useNavigate } from 'react-router-dom'
import AppBar from '../AppBar'

const SettingsView = () => {
  const settings = useSettings()
  const [imagePath, setImagePathValue] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    setImagePathValue(settings.imagePath)
  }, [settings])

  const handleSave = () => { 
    fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ imagePath })
    })
      .then(r => {
        if(r.ok) navigate('/')
        else r.text().then(setError)
      })
      .catch(() => {
        console.log('error')
      })
  }

  return <>
    <AppBar>
      <Box style={{fontSize: '1.5rem'}}>Settings</Box>
      {settings.imagePath && 
                <Link to="/"><button>X</button></Link>
      }
    </AppBar>
    <FlexBox justifyContent="flex-start" padding="md">
      <form onSubmit={(e) => {
        e.preventDefault()
        handleSave()
      }}>
        <Stack gap="xl">
          <Stack gap="sm">
            <strong>Image Path</strong>
            <input value={imagePath} onChange={e => setImagePathValue(e.target.value)} />
            <Box>
                            This is the path to where your Stable Diffusion images are stored (e.g <em>/home/someuser/stablediffusion/output</em>)
            </Box>
          </Stack>
          {!settings.imagePath && <Box>
                        ⛔️ Image path must be defined in order to show your images
          </Box>}
          {error && <Box>⛔️ {error}</Box>}
          <Stack flexDirection="row" gap="md" justifyContent="flex-end">
            <button type="submit" disabled={!imagePath || imagePath == settings.imagePath} onClick={handleSave}>
                            Save
            </button>
            {settings.imagePath &&
                            <Link to="/">
                              <button>Cancel</button>
                            </Link>
            }
          </Stack>
        </Stack>
      </form>
    </FlexBox>
  </>
}

export default SettingsView