import { createTheme, style } from '@vanilla-extract/css'
import { defineProperties, createSprinkles } from '@vanilla-extract/sprinkles'

export const [themeClass, vars] = createTheme({
  space: {
		none: '0',
		xs: '.25rem',
		sm: '.5rem',
		md: '1rem',
		lg: '1.5rem',
		xl: '2rem',
		xxl: '2.5rem'
	},
  width: {
    full: '100%',
    viewport: '100vw',
    xs: '10ch',
    sm: '15ch',
    md: '25ch',
    lg: '40ch',
    xl: '60ch'
  },
  colors: {
    paper: '#333'
  }
})

const responsiveProperties = defineProperties({
  conditions: {
    sm: {},
    md: { '@media': 'screen and (min-width: 768px)' },
    lg: { '@media': 'screen and (min-width: 1024px)' }
  },
  defaultCondition: 'sm',
  properties: {
    display: ['none', 'flex', 'block', 'inline', 'grid'],
    flexDirection: ['row', 'column'],
    flexWrap: ['nowrap', 'wrap', 'wrap-reverse'],
    justifyContent: [
      'stretch',
      'flex-start',
      'center',
      'flex-end',
      'space-around',
      'space-between'
    ],
    alignItems: [
      'stretch',
      'flex-start',
      'center',
      'flex-end'
    ],
    borderRadius: vars.space,
    gap: vars.space,
    paddingTop: vars.space,
    paddingBottom: vars.space,
    paddingLeft: vars.space,
    paddingRight: vars.space,
    position: ['absolute', 'relative', 'fixed'],
    width: vars.width
  },
  shorthands: {
    direction: ['flexDirection'],
    padding: [
      'paddingTop',
      'paddingBottom',
      'paddingLeft',
      'paddingRight'
    ],
    paddingX: ['paddingLeft', 'paddingRight'],
    paddingY: ['paddingTop', 'paddingBottom'],
    placeItems: ['justifyContent', 'alignItems'],
    wrap: ['flexWrap']
  }
})

const colorProperties = defineProperties({
  conditions: {
    lightMode: {},
    darkMode: { '@media': '(prefers-color-scheme: dark)' }
  },
  defaultCondition: 'darkMode',
  properties: {
    boxShadow: {
      '1': '0px 0px .5rem #111',
      '2': '0px 0px .75rem #000'
    },
    background: vars.colors
  },
  shorthands: {
    elevation: ['boxShadow']
  }
})

export const sprinkles = createSprinkles(
  responsiveProperties,
  colorProperties
)

export type Sprinkles = Parameters<typeof sprinkles>[0]
