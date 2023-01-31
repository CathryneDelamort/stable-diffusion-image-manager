import { PropsWithChildren } from "react"
import { useSearchParams } from "react-router-dom"

type Props = PropsWithChildren<{
    type: string,
    value?: string
}>

const Filterable = ({ children, type, value }: Props) => {
    const [searchParams, setSearchParams] = useSearchParams()
    value = value || children?.toString()
    const paramKey = `filter-${type}`
    const isAlreadyApplied = searchParams.getAll(paramKey).filter(v => v == value).length > 0
    
    const handleClick = () => {
        if(!isAlreadyApplied) {
            searchParams.append(paramKey, `${value}`)
            setSearchParams(searchParams)
        }
    }

    return <span 
        onClick={handleClick} 
        style={{ 
            cursor: isAlreadyApplied ? 'inherit' : 'pointer', 
            color: isAlreadyApplied ? 'inherit' : '#646cff'
        }}
    >
        {children}
    </span>
}

export default Filterable
