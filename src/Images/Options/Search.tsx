import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import FlexBox from '../../layout/FlexBox'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SearchContext = createContext(null as any)

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

  return <FlexBox gap="sm">
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
  </FlexBox>
}

export const useSearch = (): [string, (search: string) => void] => {
  const ctx = useContext(SearchContext)
  return [ctx.search, ctx.setSearch]
}

export default Search