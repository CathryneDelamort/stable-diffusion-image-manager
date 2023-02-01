import { ComponentProps, forwardRef } from 'react'
import { Box } from '../layout/Box'

export const FlexBox = forwardRef<HTMLDivElement, ComponentProps<typeof Box>>(({ ...props }) => (
	<Box {...props} display="flex" />
))
