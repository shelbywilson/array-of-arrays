import * as THREE from "three";
import React, {
  Fragment,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, MeshTransmissionMaterial } from "@react-three/drei";
import { Subtraction, Addition, Base, Geometry } from "@react-three/csg";
import Controls from "./Controls";
import Diagram from "./Diagram";
import { Stats } from "@react-three/drei";

const loopMultiplier = 1.55;
const color = [
  "white",
  "blue",
  "fuchsia",
  "green",
  "lime",
  "maroon",
  "olive",
  "orange",
  "purple",
  "red",
  "teal",
  "yellow",
  "violet",
  "crimson",
  "tomato",
  "saddlebrown",
  "goldenrod",
  "#d3eaff",
  "turquoise",
];

const Bead = React.memo(
  ({
    position,
    cell,
    beadSizes,
    beadScale,
    threadColor,
    onBeadClick,
    i,
    j,
    hasLoop,
  }) => {
    const geometries = useMemo(
      () => ({
        sphere: new THREE.SphereGeometry(beadSizes[0] * beadScale, 16, 16),
        cylinder: new THREE.CylinderGeometry(
          beadSizes[0] * (beadScale * 0.3),
          beadSizes[0] * (beadScale * 0.3),
          beadSizes[0] * 2,
          18
        ),
        torus: new THREE.TorusGeometry(
          beadSizes[0] * loopMultiplier + (loopMultiplier * beadScale) / 2,
          0.4,
          8,
          32
        ),
      }),
      [beadSizes, beadScale]
    );

    const handleClick = useCallback(() => {
      onBeadClick(i, j);
    }, [onBeadClick, i, j]);

    if (!cell) return null;

    return (
      <group position={position}>
        <mesh onClick={handleClick} receiveShadow castShadow>
          <Geometry useGroups>
            <Base geometry={geometries.sphere}>
              <MeshTransmissionMaterial
                color={color[cell - 1]}
                transmissionSampler
                samples={3}
                thickness={3}
                anisotropy={0.1}
                transmission={1}
                chromaticAberration={0.5}
                roughness={0.1}
              />
            </Base>
            <Subtraction
              geometry={geometries.cylinder}
              rotation={[0, 0, i % 2 === 0 ? -Math.PI / 2 : 0]}
            >
              <meshPhysicalMaterial color={color[cell - 1]} opacity={0.6} />
            </Subtraction>
            {hasLoop && (
              <group position={[-beadSizes[0] * 1.5, 0, 0]}>
                <Addition>
                  <Geometry useGroups>
                    <Base geometry={geometries.torus}>
                      <meshStandardMaterial
                        color={threadColor}
                        metalness={0}
                        roughness={1}
                      />
                    </Base>
                  </Geometry>
                </Addition>
              </group>
            )}
          </Geometry>
        </mesh>
      </group>
    );
  }
);

export default function App() {
  const [dimension, setDimension] = useState([3, 3]);
  const [beadSizes, setBeadSizes] = useState([5]);
  const [beadScale, setBeadScale] = useState(1);
  const [keyPressed, setKeyPressed] = useState(null);
  const [threadColor, setThreadColor] = useState("tomato");
  const [uniformBeadColor, setUniformBeadColor] = useState(1);
  const [shuffledColor, setShuffledColor] = useState(false);
  const [grid, setGrid] = useState([[]]);

  const handleKeyDown = useCallback((event) => {
    setKeyPressed(event.key);
  }, []);

  const reset = useCallback(() => {
    setShuffledColor(false);
    setUniformBeadColor(1);
    setDimension([3, 3]);
    setBeadSizes([5]);
  }, []);

  const getGrid = useMemo(() => {
    return () => {
      let newGrid = [[]];
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
              arr.push(
                shuffledColor
                  ? Math.floor(Math.random() * color.length) + 1
                  : uniformBeadColor
              );
            } else {
              arr.push(0);
            }
          } else {
            if (j % 2 === 0) {
              arr.push(
                shuffledColor
                  ? Math.floor(Math.random() * color.length) + 1
                  : uniformBeadColor
              );
            } else {
              arr.push(0);
            }
          }
        }
        newGrid.push(arr);
      }
      return newGrid;
    };
  }, [dimension, uniformBeadColor, shuffledColor]);

  useEffect(() => {
    setGrid(getGrid());
  }, [getGrid]);

  const removeBead = useCallback((i, j) => {
    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      newGrid[i][j] = 0;
      return newGrid;
    });
  }, []);

  const changeColor = useCallback((i, j) => {
    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      newGrid[i][j] += 1;
      if (newGrid[i][j] > color.length) {
        newGrid[i][j] = 1;
      }
      return newGrid;
    });
  }, []);

  const handleBeadClick = useCallback(
    (i, j) => {
      if (keyPressed === "x") {
        removeBead(i, j);
      }
    },
    [keyPressed, removeBead]
  );

  const allBeads = useMemo(() => {
    const beads = [];

    grid.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (!cell) return;

        const position = [beadSizes[0] * 1.5 * i, beadSizes[0] * 1.5 * j, 0];
        const hasLoop = j % 2 === 1 && i % 2 === 1 && i > 1;

        beads.push(
          <Bead
            key={`${i}_${j}`}
            position={position}
            cell={cell}
            beadSizes={beadSizes}
            beadScale={beadScale}
            threadColor={threadColor}
            onBeadClick={handleBeadClick}
            i={i}
            j={j}
            hasLoop={hasLoop}
          />
        );
      });
    });

    return beads;
  }, [grid, beadSizes, beadScale, threadColor, handleBeadClick]);

  const changeDimension = useCallback((dir, row = true, col = true) => {
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
  }, []);

  const randomize = useCallback((type) => {
    if (type === "bead") {
      setShuffledColor(false);
      setUniformBeadColor(Math.floor(Math.random() * color.length) + 1);
    } else {
      setThreadColor(color[Math.floor(Math.random() * color.length)]);
    }
  }, []);

  const shuffle = useCallback(
    (type) => {
      if (type === "color") {
        setShuffledColor(true);
        setGrid(getGrid());
      }
    },
    [getGrid]
  );

  return (
    <Fragment>
      <Canvas
        camera={{ position: [0, 0, 80], far: 1000, near: 0.001, fov: 50 }}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        performance={{ min: 0.5 }}
        dpr={[1, 2]} // Limit device pixel ratio
        frameloop="demand"
      >
        {/* <color attach="background" args={["aliceblue"]} /> */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 104]} intensity={0.8} />
        <OrbitControls
          rotateSpeed={2}
          enableDamping={true}
          dampingFactor={0.05}
        />
        <group
          position={[
            -dimension[0] * 1.5 * beadSizes[0] - beadSizes[0] * 1.5,
            -dimension[1] * 1.5 * beadSizes[0],
            0,
          ]}
        >
          {allBeads}
        </group>
      </Canvas>
      <Controls
        dimension={dimension}
        changeDimension={changeDimension}
        count={allBeads.length}
        reset={reset}
        threadSize={
          dimension[0] * dimension[1] * beadSizes[0] * loopMultiplier * Math.PI
        }
        beadSizes={beadSizes}
        beadScale={beadScale}
        changeBeadSizes={(size) => setBeadSizes([size, size])}
        changeBeadScale={(scale) => setBeadScale(scale)}
        randomize={randomize}
        shuffle={shuffle}
      />
      <Diagram grid={grid} color={color} />
      {/* <Stats /> */}
    </Fragment>
  );
}
