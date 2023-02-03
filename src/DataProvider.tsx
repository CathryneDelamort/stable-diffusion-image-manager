import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import defaultSettings from './settings.default.json'
import { SearchProvider } from './ListView/Search'

const DataContext = createContext({
  settings: defaultSettings,
  folder: '',
  setFolder: (folder: string) => {}
})

export const DataProvider = ({ children }: PropsWithChildren) => {
  const [settings, setSettings] = useState(defaultSettings)
  const [searchParams, setSearchParams] = useSearchParams()
  const folder = searchParams.get('folder') || ''

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(v => setSettings(v))
  }, [])

  const setFolder = (folder: string) => {
    if(folder) searchParams.set('folder', folder)
    else searchParams.delete('folder')
    setSearchParams(searchParams)
  }


  return (
    <DataContext.Provider value={{ 
      settings,
      folder,
      setFolder
    }}>
      <SearchProvider>
        {children}
      </SearchProvider>
    </DataContext.Provider>
  )
}

export const useSettings = () => useContext(DataContext).settings

export const useFolder = (): [string, (foldeR: string) => void] => {
  const ctx = useContext(DataContext)
  return [ctx.folder, ctx.setFolder]
}