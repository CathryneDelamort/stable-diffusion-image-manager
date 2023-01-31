import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const SearchContext = createContext({ search: '', setSearch: (search: string) => {}})

export const SearchProvider = ({ children }: PropsWithChildren) => {
  const [searchParams] = useSearchParams()
  const searchFromUrl = searchParams.get('q') || ''
  const [search, setSearch] = useState(searchFromUrl)

  useEffect(() => setSearch(searchFromUrl), [searchFromUrl])

  return (
    <SearchContext.Provider value={{ search, setSearch }}>
      {children}
    </SearchContext.Provider>
  )
}

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { search, setSearch } = useContext(SearchContext)

  return <div style={{ display: 'flex', gap: '.5rem' }}>
    Search
    <input 
      type="text" 
      value={search}
      onChange={e => setSearch(e.target.value)}
      onBlur={({ target: { value }}) => {
        if(value) searchParams.set('q', value)
        else searchParams.delete('q')
        setSearchParams(searchParams)
        setSearch(value)
      }}
    />
  </div>
}

export const useSearch = (): string => useContext(SearchContext).search

export default Search