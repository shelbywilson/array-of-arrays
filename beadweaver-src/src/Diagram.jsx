import { useState } from 'react'

export default function Diagram({ svgDim, grid, color }) {
  const [collapse, setCollapse] = useState(false)
  return (
    <div
      onClick={() => setCollapse((prev) => !prev)}
      style={{
        position: 'fixed',
        left: 10,
        bottom: 10,
        height: collapse ? 20 : '',
        width: collapse ? 20 : '',
        border: '1px solid yellow',
        overflow: 'hidden'
      }}>
      {collapse ? (
        <svg height={20} width={20}>
          <rect
            width={14}
            height={14}
            style={{
              fill: '#fff',
              stroke: 'black',
              transform: `translate(${10}px, ${0}px) rotate(45deg)`
            }}></rect>
        </svg>
      ) : (
        <svg height={svgDim[1]} width={svgDim[0]}>
          {grid.map((row, i) => (
            <g key={i} style={{ transform: `translate(14px, 0)` }}>
              {row.map((cell, j) => {
                if (cell > 0) {
                  return (
                    <rect
                      key={`${i}_${j}`}
                      width={14}
                      height={14}
                      style={{
                        fill: color[cell - 1],
                        stroke: 'black',
                        transform: `translate(${(i - 1) * 10}px, ${
                          svgDim[1] - (j + 2) * 10
                        }px) rotate(45deg)`
                      }}></rect>
                  )
                }

                return <g key={`${i}_${j}`}></g>
              })}
            </g>
          ))}
        </svg>
      )}
    </div>
  )
}
