import { Box } from '../layout/Box'

const BackToTop = () =>
  <Box
    position="fixed"
    elevation="1"
    background="card"
    style={{
      bottom: 0,
      right: '1.5rem',
      cursor: 'pointer',
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