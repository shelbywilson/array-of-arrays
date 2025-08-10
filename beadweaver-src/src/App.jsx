import * as THREE from "three";
import { Fragment, useEffect, useState } from "react";
import { Canvas, directionalLight } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { BackSide } from "three";
import { Subtraction } from "@react-three/csg";
import Diagram from "./Diagram";
import Controls from "./Controls";

export default function App() {
  const [dimension, setDimension] = useState([5, 5]);
  const [beadSizes, setBeadSizes] = useState([4]);
  const [keyPressed, setKeyPressed] = useState(null);

  const handleKeyDown = (event) => {
    setKeyPressed(event.key);
  };

  const reset = () => {
    setDimension([5, 5]);
  };

  const getGrid = () => {
    let grid = [[]];
    while (i < dimension[0] * 2 + 1) {
      i += 1;
      let arr = [];
      j = 0;
      while (j < dimension[1] * 2 + 1) {
        j += 1;
        if (i % 2 === 0) {
          if (j % 2 === 1) {
            arr.push(1);
          } else {
            arr.push(0);
          }
        } else {
          if (j % 2 === 0) {
            arr.push(1);
          } else {
            arr.push(0);
          }
        }
      }
      grid.push(arr);
    }

    return grid;
  };

  const [grid, setGrid] = useState(getGrid());

  useEffect(() => {
    setGrid(getGrid());
  }, [dimension]);

  let allBeads = [];
  let allLoops = [];

  let i = 0;
  let j = 0;
  const color = ["rgb(255, 255, 255)", "#555", "red"];

  const removeBead = (i, j) => {
    let newGrid = [...grid];
    newGrid[i][j] = 0;

    setGrid(newGrid);
  };

  const changeColor = (i, j) => {
    let newGrid = [...grid];
    newGrid[i][j] += 1;

    if (newGrid[i][j] > color.length) {
      newGrid[i][j] = 1;
    }

    setGrid(newGrid);
  };

  const handleClick = (i, j) => {
    if (keyPressed == "x") {
      removeBead(i, j);
    } else {
      changeColor(i, j);
    }
  };

  let count = 0;

  grid.forEach((row, i) => {
    row.forEach((cell, j, cells) => {
      let position = [beadSizes[0] * 1.5 * i, beadSizes[0] * 1.5 * j, 0];
      if (cell) {
        count += 1;
        allBeads.push(
          <group key={`${i}_${j}`} position={position}>
            <mesh onClick={() => handleClick(i, j)}>
              <sphereGeometry args={[beadSizes[0], 12, 10]} />
              <meshPhysicalMaterial
                key={`${i}_${j}`}
                color={color[cell - 1]}
                // shininess={10}
                specular={"#fff"}
                emissive={color[1]}
                metalness={0.9}
                roughness={0.5}
                envMapIntensity={0.1}
                clearcoat={1}
                transparent={true}
                opacity={0.9}
                reflectivity={0.2}
                // refactionRatio={0.985}
                ior={0.9}
                // side={BackSide}
              />
            </mesh>
            <mesh
              rotation={[0, 0, i % 2 === 0 ? -Math.PI / 2 : 0]}
              operation="subtract"
            >
              <cylinderGeometry args={[0.2, 0.2, beadSizes[0] * 2]} />
            </mesh>
          </group>
        );
      }

      if (j % 2 == 1) {
        if (i % 2 == 1 && i > 1) {
          position = [beadSizes[0] * 1.5 * (i - 1), beadSizes[0] * 1.5 * j, 0];
          allLoops.push(
            <group position={position}>
              <mesh>
                <torusGeometry
                  args={[beadSizes[0] * 1.625, beadSizes[0] * 1.625 * 0.05]}
                />
                <meshPhysicalMaterial
                  color={"#ffff00"}
                  specular={"#ff0000"}
                  metalness={0.9}
                  roughness={0.5}
                  envMapIntensity={0.1}
                  clearcoat={1}
                  transparent={true}
                  opacity={0.9}
                  reflectivity={0.2}
                  // refactionRatio={0.985}
                  ior={0.9}
                  // side={BackSide}
                />
              </mesh>
            </group>
          );
        }
      }
    });
  });

  const changeDimension = (dir, row = true, col = true) => {
    setDimension((prev) => {
      let newDim = [...prev];
      if (row) {
        newDim[1] += dir;
      }
      if (col) {
        newDim[0] += dir;
      }
      return newDim;
    });
  };

  const svgDim = [
    (dimension[0] + 1) * 14 * 1.42 + 10,
    (dimension[1] + 1) * 14 * 1.42 + 10,
  ];

  console.log(dimension, beadSizes[0]);

  return (
    <Fragment>
      <Canvas
        camera={{ position: [0, 0, 100], far: 50000, near: 0.1 }}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {/* <color attach="background" args={["transparent"]} /> */}
        <ambientLight intensity={5} />
        <directionalLight position={[100, 100, 104]} />
        <OrbitControls />

        <group
          position={[
            -dimension[0] * 1.5 * beadSizes[0],
            -dimension[1] * 1.5 * beadSizes[0],
            0,
          ]}
        >
          {allLoops}
          {allBeads}
        </group>
      </Canvas>

      <Controls
        dimension={dimension}
        changeDimension={changeDimension}
        count={count}
        reset={reset}
      />

      {/* <input type='range' value={beadSizes[0]} onChange={(e) => setBeadSizes(prev => [e.target.value])} /> */}
      <Diagram svgDim={svgDim} grid={grid} color={color} />
    </Fragment>
  );
}
