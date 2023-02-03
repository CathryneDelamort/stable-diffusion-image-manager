import { ComponentProps, forwardRef } from 'react'
import { Box } from './Box'

export const FlexBox = forwardRef<HTMLDivElement, ComponentProps<typeof Box>>(({ ...props }, ref) => (
	<Box {...props} display="flex" ref={ref} />
))
