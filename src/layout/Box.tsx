// import { CSSProperties, forwardRef, PropsWithChildren } from 'react'
import { style as createStyle } from '@vanilla-extract/css'
import { createElement, ElementType, forwardRef, HTMLAttributes, PropsWithChildren } from 'react'
import { sprinkles, Sprinkles } from '../styles.css'

export type Style = Parameters<typeof createStyle>[0]

type NativeProps = HTMLAttributes<HTMLElement>
type AsComponentProp = { component?: ElementType }
type Props = PropsWithChildren<Sprinkles & AsComponentProp & NativeProps & {
  wrap?: boolean | Sprinkles['wrap']
  paper?: boolean
}>

export const Box = forwardRef<HTMLElement, Props>(({ component = 'div', ...rest }, ref) => {
  const className: Record<string, unknown> = {}
  const nativeProps: Record<string, unknown> = {}

  if (rest.paper) {
    rest.elevation = rest.elevation || "1"
    rest.background = rest.background || "paper"
    rest.borderRadius = rest.borderRadius || "sm"
  }

  for (const key in rest) {
    if (sprinkles.properties.has(key as keyof Sprinkles)) {
      className[key] = rest[key as keyof typeof rest]
    } else {
      nativeProps[key] = rest[key as keyof typeof rest]
    }
  }

  if (rest.wrap) className.wrap = typeof rest.wrap === 'boolean' ? 'wrap' : rest.wrap
  

  return createElement(component, {
    ref,
    className: sprinkles(className),
    ...nativeProps
  })
})
