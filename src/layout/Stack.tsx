import { ComponentProps, ForwardedRef, forwardRef } from 'react'
import FlexBox from './FlexBox'

type StackProps = Omit<ComponentProps<typeof FlexBox>, 'direction' | 'wrap'>

const Stack = (
  (props: StackProps, ref: ForwardedRef<HTMLDivElement>) => 
    <FlexBox {...props} direction="column" ref={ref} />
)

export default forwardRef(Stack)
