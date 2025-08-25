export default function Controls({
  dimension,
  changeDimension,
  count,
  reset,
  threadSize,
  beadSizes,
  changeBeadSizes,
}) {
  return (
    <div
      style={{
        position: "fixed",
        padding: "1rem",
        top: "1rem",
        left: "1rem",
        color: "white",
        border: "1px solid yellow",
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(3px)'
      }}
    >
      <div
        style={{
          margin: "0 0 1rem 0",
          display: "grid",
          columnGap: "0.5rem",
          gridTemplateColumns: "2rem 2rem 2rem",
        }}
      >
        <p>row</p>
        <button onClick={() => changeDimension(-1, true, false)}>-</button>
        <button onClick={() => changeDimension(1, true, false)}>+</button>
      </div>
      <div
        style={{
          margin: "1rem 0 0 0",
          display: "grid",
          columnGap: "0.5rem",
          gridTemplateColumns: "2rem 2rem 2rem",
        }}
      >
        <p>col</p>
        <button onClick={() => changeDimension(-1, false, true)}>-</button>
        <button onClick={() => changeDimension(1, false, true)}>+</button>
      </div>
      <div
        style={{
          margin: "1rem 0 0 0",
          display: "grid",
          columnGap: "0.5rem",
          gridTemplateColumns: "2rem 12rem",
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
      </div>
      <button style={{ margin: "1rem 0" }} onClick={reset}>
        reset
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', rowGap: '0.75rem', paddingTop: '1rem', borderTop: '1px dashed'}}>
        <p>
          {dimension[0]} x {dimension[1]}, {count} beads
        </p>
        <p>
          {(beadSizes[0])} mm beads
        </p>
        <p>
          {((beadSizes[0] * (1 + dimension[0] * 1.5)) / 25.4).toFixed(1)} " wide
        </p>
        <p>
          {((beadSizes[0] * (1 + dimension[1] * 1.5)) / 25.4).toFixed(1)} " high
        </p>
        <p>{(threadSize / 25.4).toFixed(1)} " thread</p>
      </div>
    </div>
  );
}
