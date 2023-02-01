import { ComponentProps, forwardRef } from 'react'
import { FlexBox } from '../ListView/FlexBox'

type StackProps = Omit<ComponentProps<typeof FlexBox>, 'direction' | 'wrap'>

export const Stack = forwardRef<HTMLDivElement, StackProps>(props => <FlexBox {...props} direction="column"  />)
