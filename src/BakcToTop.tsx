import { Box } from './Box'

const BackToTop = () =>
  <Box
    position="fixed"
    style={{
      bottom: 0,
      right: '1.5rem',
      cursor: 'pointer',
      backgroundColor: '#444',
      border: '1px solid',
      borderBottom: 'none',
      borderTopRightRadius: '1rem',
      borderTopLeftRadius: '1rem',
    }}
    paddingX="md"
    paddingY="sm"
    onClick={() => window.scrollTo(0, 0)}
  >
    Back to top ⬆
  </Box>

export default BackToTop