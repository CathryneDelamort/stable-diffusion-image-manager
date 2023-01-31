import { PropsWithChildren } from "react"

type Props = PropsWithChildren<{
    onFilter: () => void
}>

const Filterable = ({ children, onFilter }: Props) =>
    <span onClick={onFilter} style={{ cursor: 'pointer', color: '#646cff'}}>
        {children}
    </span>

export default Filterable
