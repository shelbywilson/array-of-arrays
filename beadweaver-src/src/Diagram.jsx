import { useState } from "react";

export default function Diagram({ grid, color }) {
  const [collapse, setCollapse] = useState(false);
  const svgDim = [
    (grid.length) * 7 * 1.42 + 10,
    (grid[grid.length - 1].length + 1) * 7 * 1.42 + 10,
  ];

  return (
    <div
      onClick={() => setCollapse((prev) => !prev)}
      className="dialog"
      style={{
        left: 10,
        bottom: 10,
        height: collapse ? 30 : "",
        width: collapse ? 30 : "",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {collapse ? (
        <svg height={20} width={20}>
          <rect
            width={14}
            height={14}
            style={{
              fill: "#fff",
              stroke: "black",
              transform: `translate(${10}px, ${0}px) rotate(45deg)`,
            }}
          ></rect>
        </svg>
      ) : (
        <svg height={svgDim[1]} width={svgDim[0]}>
          <g>
            {grid.map((row, i) => (
              <g key={i} style={{ transform: `translate(14px, -5px)` }}>
                {row.map((cell, j) => {
                  if (cell > 0) {
                    return (
                      <rect
                        key={`${i}_${j}`}
                        width={14}
                        height={14}
                        style={{
                          fill: color[Math.ceil(cell) - 1],
                          stroke: "black",
                          transform: `translate(${(i - 1) * 10}px, ${
                            svgDim[1] - (j + 2) * 10
                          }px) rotate(45deg)`,
                        }}
                      ></rect>
                    );
                  }

                  return <g key={`${i}_${j}`}></g>;
                })}
              </g>
            ))}
          </g>
        </svg>
      )}
    </div>
  );
}
