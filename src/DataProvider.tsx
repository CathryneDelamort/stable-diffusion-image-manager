import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import defaultSettings from './settings.default.json'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DataContext = createContext(null as any)

export const DataProvider = ({ children }: PropsWithChildren) => {
  const [settings, setSettings] = useState(defaultSettings)
  const [settingsLoaded, setSettingsLoaded] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const folder = searchParams.get('folder') || ''

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(v => {
        setSettings(v)
        setSettingsLoaded(true)
      })
  }, [])

  const setFolder = (folder: string) => {
    if(folder) searchParams.set('folder', folder)
    else searchParams.delete('folder')
    setSearchParams(searchParams)
  }

  return (
    <DataContext.Provider value={{ 
      settings: {...settings, loaded: settingsLoaded},
      folder,
      setFolder
    }}>
      {children}
    </DataContext.Provider>
  )
}

export const useSettings = () => useContext(DataContext).settings

export const useFolder = (): [string, (folder: string) => void] => {
  const ctx = useContext(DataContext)
  return [ctx.folder, ctx.setFolder]
}
