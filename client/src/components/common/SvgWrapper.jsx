import React from 'react'
export default function SvgWrapper({children, width='24px', fill='black', viewBox='0 0 48 48'}) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} width={width} fill={fill}>
          {children}
      </svg>
    )
  }