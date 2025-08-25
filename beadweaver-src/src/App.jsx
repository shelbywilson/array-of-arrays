import * as THREE from "three";
import { Fragment, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  MeshTransmissionMaterial,
  Environment,
} from "@react-three/drei";
import { Subtraction, Addition, Base, Geometry } from "@react-three/csg";
import Controls from "./Controls";
import Diagram from "./Diagram";
import { Stats } from '@react-three/drei'

const loopMultiplier = 1.67;

export default function App() {
  const [dimension, setDimension] = useState([3, 3]);
  const [beadSizes, setBeadSizes] = useState([6]);
  const [keyPressed, setKeyPressed] = useState(null);

  const handleKeyDown = (event) => {
    setKeyPressed(event.key);
  };

  const reset = () => {
    setDimension([5, 5]);
    setBeadSizes([6])
  };

  const getGrid = () => {
    let grid = [[]];
    let i = 0;
    let j = 0;
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
      // changeColor(i, j);
    }
  };

  let count = 0;

  grid.forEach((row, i) => {
    row.forEach((cell, j, cells) => {
      let position = [beadSizes[0] * 1.5 * i, beadSizes[0] * 1.5 * j, 0];
      let loopPosition = null;

      if (j % 2 == 1) {
        if (i % 2 == 1 && i > 1) {
          loopPosition = [
            beadSizes[0] * 1.5 * (i - 2),
            beadSizes[0] * 1.5 * (j - 1),
            0,
          ];
        }
      }

      if (cell) {
        count += 1;

        try {
          const sphereGeom = new THREE.SphereGeometry(beadSizes[0], 20, 20);
          const cylinderGeom = new THREE.CylinderGeometry(
            beadSizes[0] * 0.2,
            beadSizes[0] * 0.2,
            beadSizes[0] * 2,
            16
          );
          const torusGeometry = new THREE.TorusGeometry(
            beadSizes[0] * loopMultiplier,
            0.4,
            12,
            48
            // Math.PI / 4
          );
          // const loopGeomSegement = new THREE.CylinderGeometry(
          //   0.4,
          //   0.4,
          //   beadSizes[0] * 1.3,
          //   16
          // );

          allBeads.push(
            <group key={`${i}_${j}`} position={position}>
              <mesh onClick={() => handleClick(i, j)} receiveShadow castShadow>
                <Geometry useGroups>
                  <Base geometry={sphereGeom}>
                    <MeshTransmissionMaterial
                      color={color[cell - 1]}
                      transmissionSampler
                      // backside
                      samples={3}
                      // resolution={10}
                      // // backsideResolution={128}
                      thickness={2.5}
                      // anisotropy={0.1}
                      transmission={1}
                      chromaticAberration={0.5}
                      roughness={0.2}
                      // opacity={0.2}
                    />
                  </Base>
                  <Subtraction
                    geometry={cylinderGeom}
                    rotation={[0, 0, i % 2 === 0 ? -Math.PI / 2 : 0]}
                  >
                    <meshPhysicalMaterial
                      color="rgb(255, 255, 255)"
                      // side={THREE.DoubleSide}
                      // transparent={true}
                      opacity={0.6}
                    />
                  </Subtraction>
                  {loopPosition ? (
                    <group position={[-beadSizes[0] * 1.5, 0, 0]}>
                      <group>
                        <Addition>
                          <Geometry useGroups>
                            <Base geometry={torusGeometry}>
                              <meshStandardMaterial
                                color={"#ffff00"}
                                metalness={0.2}
                                roughness={1}
                              />
                            </Base>

                            {/* <group rotation={[0, 0, Math.PI / 8 + Math.PI]}>
                              <Addition geometry={torusGeometry}>
                                <meshStandardMaterial
                                  color={"#ffff00"}
                                  metalness={0.2}
                                  roughness={1}
                                />
                              </Addition>
                            </group>

                            <Addition
                              position={[-beadSizes[0] * 1.7 * 0.85, 0, 0]}
                              geometry={loopGeomSegement}
                            >
                              <meshStandardMaterial
                                color={"#ffff00"}
                                metalness={0.2}
                                roughness={1}
                              />
                            </Addition> */}
                          </Geometry>
                        </Addition>
                      </group>
                    </group>
                  ) : (
                    <></>
                  )}
                </Geometry>
              </mesh>
            </group>
          );
        } catch (error) {
          console.error(`Error creating CSG bead at ${i}, ${j}:`, error);
          // Fallback to regular sphere if CSG fails
          allBeads.push(
            <group key={`${i}_${j}`} position={position}>
              <mesh onClick={() => handleClick(i, j)} receiveShadow castShadow>
                <sphereGeometry args={[beadSizes[0], 12, 10]} />
                <meshPhysicalMaterial
                  color="red" 
                  metalness={0.9}
                  roughness={0.5}
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
        newDim[1] = Math.max(0, newDim[1]);
      }
      if (col) {
        newDim[0] += dir;
        newDim[0] = Math.max(0, newDim[0]);
      }
      return newDim;
    });
  };

  const svgDim = [
    (dimension[0] + 1) * 14 * 1.42 + 10,
    (dimension[1] + 1) * 14 * 1.42 + 10,
  ];

  return (
    <Fragment>
      <Canvas
        camera={{ position: [0, 0, 200], far: 1000, near: 0.001, fov: 50 }}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 104]} intensity={0.8} />

        <OrbitControls rotateSpeed={2} />

        <group
          position={[
            (-dimension[0] * 1.5 * beadSizes[0]) - beadSizes[0] * 1.5,
            -dimension[1] * 1.5 * beadSizes[0],
            0,
          ]}
        >
          {/* {allLoops} */}
          {allBeads}
        </group>
      </Canvas>

      <Controls
        dimension={dimension}
        changeDimension={changeDimension}
        count={count}
        reset={reset}
        threadSize={dimension[0] * dimension[1] * beadSizes[0] * loopMultiplier * Math.PI}
        beadSizes={beadSizes}
        changeBeadSizes={(size) => setBeadSizes([size, size])}
      />

      <Diagram svgDim={svgDim} grid={grid} color={color} />
      {/* <Stats /> */}
    </Fragment>
  );
}
