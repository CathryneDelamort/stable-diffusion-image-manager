import { ComponentProps, forwardRef } from 'react'
import { FlexBox } from './FlexBox'

type StackProps = Omit<ComponentProps<typeof FlexBox>, 'direction' | 'wrap'>

export const Stack = forwardRef<HTMLDivElement, StackProps>(
    (props, ref) => <FlexBox {...props} direction="column" ref={ref} />
)
