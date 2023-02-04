import { PropsWithChildren, ReactComponentElement, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Box } from './layout/Box'
import { FlexBox } from "./layout/FlexBox"
import { Stack } from './layout/Stack'

type Props = PropsWithChildren & {
    title: string
    buttons?: { content: string, to?: string }[]
}

const AppBar = ({ children, title, buttons }: Props) => {
    const ref = useRef<HTMLDivElement>(null)
    const { pathname } = useLocation()
    console.log(ref.current?.offsetHeight)
    return <>
        <Box style={{ height: ref.current?.offsetHeight + 'px' }} />
        <FlexBox 
            position="fixed" 
            padding="md" 
            ref={ref} 
            justifyContent="space-between"
            alignItems="center"
            elevation="2"
            style={{
                top: 0,
                left: 0,
                width: '100vw',
                background: '#222',
                zIndex: 999
            }}
        >
            <Box style={{fontSize: '1.5rem'}}>{title}</Box>
            <Box>{children}</Box>
        </FlexBox>
        
    </>
}

export default AppBar