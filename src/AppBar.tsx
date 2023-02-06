import { PropsWithChildren, ReactComponentElement, useEffect, useRef, useState } from 'react'
import { FlexBox } from "./layout/FlexBox"

const AppBar = ({ children }: PropsWithChildren) => {
  return <FlexBox>
    <FlexBox
      padding="md"
      justifyContent="space-between"
      alignItems="center"
      style={{ visibility: 'hidden' }}
    >
      {children}
    </FlexBox>
    <FlexBox
      position="fixed"
      padding="md"
      justifyContent="space-between"
      alignItems="center"
      elevation="2"
      style={{
        top: 0,
        left: 0,
        width: '100vw',
        background: '#222',
        zIndex: 999
      }}
    >
      {children}
    </FlexBox>

  </FlexBox>
}

export default AppBar