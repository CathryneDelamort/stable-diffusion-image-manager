import { ComponentProps, ForwardedRef, forwardRef } from 'react'
import Box from './Box'

const FlexBox = ({ ...props }: ComponentProps<typeof Box>, ref: ForwardedRef<HTMLDivElement>) => (
  <Box {...props} display={props.display || 'flex'} ref={ref} />
)

export default forwardRef(FlexBox)