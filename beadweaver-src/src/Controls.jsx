export default function Controls({ dimension, changeDimension, count, reset }) {

  return (
    <div
      style={{
        position: 'fixed',
        padding: '1rem',
        top: '1rem',
        left: '1rem',
        color: 'white',
        border: '1px solid yellow'
      }}>
      <p>
        {dimension[0]} x {dimension[1]}, {count} beads
      </p>
      <div
        style={{
          margin: '1rem 0',
          display: 'grid',
          columnGap: '0.5rem',
          gridTemplateColumns: '2rem 2rem 2rem'
        }}>
        <p>row</p>
        <button onClick={() => changeDimension(-1, true, false)}>-</button>
        <button onClick={() => changeDimension(1, true, false)}>+</button>
      </div>
      <div
        style={{
          margin: '1rem 0 0 0',
          display: 'grid',
          columnGap: '0.5rem',
          gridTemplateColumns: '2rem 2rem 2rem'
        }}>
        <p>col</p>
        <button onClick={() => changeDimension(-1, false, true)}>-</button>
        <button onClick={() => changeDimension(1, false, true)}>+</button>
      </div>
      <button style={{margin: '1rem 0 0 0'}} onClick={reset}>reset</button>
    </div>
  )
}
