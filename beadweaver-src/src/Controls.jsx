import { useState, Fragment } from "react";

export default function Controls({
  dimension,
  changeDimension,
  count,
  reset,
  randomize,
  shuffle,
  threadSize,
  beadSizes,
  beadScale,
  changeBeadSizes,
  changeBeadScale,
}) {
  const [collapse, setCollapse] = useState(false);
  return (
    <div className="dialog controls">
      <button
        style={{
          position: "absolute",
          right: "0.5rem",
          top: "0.375rem",
          padding: 0,
        }}
        onClick={() => setCollapse((prev) => !prev)}
      >
        {collapse ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20px"
            height="20px"
            viewBox="0 0 25 25"
            fill="none"
          >
            <path
              d="M14 6.5H18.5V11M11 18.5H6.5V14"
              stroke="#121923"
              strokeWidth="1.2"
            />
            <path
              d="M18.5 6.5L14 11M6.5 18.5L11 14"
              stroke="#121923"
              strokeWidth="1.2"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20px"
            height="20px"
            viewBox="0 0 25 25"
            fill="none"
          >
            <path
              d="M6 14.5L10.5 14.5V19M19 10.5H14.5L14.5 6"
              stroke="#121923"
              stroke-width="1.2"
            />
            <path d="M10.5 14.5L6 19" stroke="#121923" stroke-width="1.2" />
            <path d="M14.5 10.5L19 6" stroke="#121923" stroke-width="1.2" />
          </svg>
        )}
      </button>
      {collapse ? (
        <></>
      ) : (
        <Fragment>
          <div
            className="grid"
            style={{
              margin: "0 0 1rem 0",
              display: "grid",
              gridTemplateColumns: "3.5rem 2rem 2rem 2rem",
            }}
          >
            <p>row</p>
            <button onClick={() => changeDimension(-1, true, false)}>-</button>
            <button onClick={() => changeDimension(1, true, false)}>+</button>
            <p>{dimension[1]}</p>
          </div>
          <div
            className="grid"
            style={{
              margin: "1rem 0 0 0",
              gridTemplateColumns: "3.5rem 2rem 2rem 2rem",
            }}
          >
            <p>col</p>
            <button onClick={() => changeDimension(-1, false, true)}>-</button>
            <button onClick={() => changeDimension(1, false, true)}>+</button>
            <p>{dimension[0]}</p>
          </div>
          <div
            className="grid"
            style={{
              margin: "1rem 0 0 0",
              gridTemplateColumns: "3.5rem 12rem",
            }}
          >
            <p>size</p>
            <input
              type="range"
              min={1}
              max={20}
              value={beadSizes[0]}
              onInput={(e) => changeBeadSizes(e.target.value)}
            />
            <p></p>
            <input
              type="range"
              min={5}
              max={20}
              value={beadScale * 20}
              onInput={(e) => changeBeadScale(e.target.value / 20)}
            />
          </div>
          <div
            className="grid"
            style={{
              margin: "1rem 0 0 0",
              gridTemplateColumns: "3.5rem 6rem 6rem",
              rowGap: "1rem",
            }}
          >
            <p>color</p>
            <button onClick={() => randomize("bead")}>beads</button>
            <button onClick={() => randomize("thread")}>thread</button>
          </div>
          <div
            className="grid"
            style={{
              margin: "1rem 0 0 0",
              gridTemplateColumns: "3.5rem 6rem 6rem",
              rowGap: "1rem",
            }}
          >
            <p></p>
            <button onClick={() => shuffle("color")}>shuffle</button>
            {/* <button onClick={() => randomize("size")}>size</button> */}
          </div>

          <div>
            <button
              style={{
                margin: "1.5rem 0 1rem 0",
              }}
              onClick={reset}
            >
              reset
            </button>
          </div>
          <div
            style={{
              paddingTop: "1rem",
              borderTop: "1px dashed",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                rowGap: "0.75rem",
              }}
            >
              <p>
                <span style={{ textTransform: "none" }}>
                  {count} x {parseFloat((beadSizes[0] * beadScale).toFixed(1))}{" "}
                  mm
                </span>{" "}
                beads
              </p>
              <p>
                {((beadSizes[0] * (1 + dimension[0] * 1.5)) / 25.4).toFixed(1)}"
                wide
              </p>
              <p>
                {((beadSizes[0] * (1 + dimension[1] * 1.5)) / 25.4).toFixed(1)}"
                high
              </p>
              <p>{(threadSize / 25.4).toFixed(1)}" thread</p>
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
}
