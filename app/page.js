// "use client";
// import React, { useState } from "react";

// export default function Home() {
//   const [images, setImages] = useState([]);
//   const [modelUrl, setModelUrl] = useState("");

//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files);
//     const urls = files.map((file) => ({
//       name: file.name,
//       url: URL.createObjectURL(file),
//       file,
//     }));
//     setImages(urls);
//   };

//   const generate3DModel = async () => {
//     if (images.length === 0) {
//       alert("Please upload at least one image!");
//       return;
//     }

//     const file = images[0].file;

//     const formData = new FormData();
//     formData.append("image", file);

//     const res = await fetch("/api/generateModel", {
//       method: "POST",
//       body: formData,
//     });

//     if (!res.ok) {
//       const error = (await res.text());
//       console.error("API Error:", error);
//       alert("3D generation failed! - see console for details");
//       return;
//     }

//     const blob = await res.blob();
//     const url = URL.createObjectURL(blob);

//     setModelUrl(url);
//     alert("3D Model Generated!");
//   };


//   return (
//     <div style={{ minHeight: "100vh", padding: "2rem", background: "#f8f9fa" }}>
//       <h1 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>
//          Fabrication 3D App 
//       </h1>

//       <input
//         type="file"
//         multiple
//         accept="image/*"
//         onChange={handleFileChange}
//         style={{
//           padding: "1rem",
//           border: "2px dashed #888",
//           borderRadius: "8px",
//           cursor: "pointer",
//           background: "#fff",
//         }}
//       />

//       {/* Preview Section */}
//       <div
//         style={{
//           marginTop: "2rem",
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
//           gap: "1rem",
//         }}
//       >
//         {images.map((img) => (
//           <div
//             key={img.name}
//             style={{
//               border: "1px solid #ccc",
//               borderRadius: "8px",
//               padding: "0.5rem",
//               background: "#fff",
//               textAlign: "center",
//             }}
//           >
//             <img
//               src={img.url}
//               alt={img.name}
//               style={{
//                 width: "100%",
//                 height: "150px",
//                 objectFit: "cover",
//                 borderRadius: "6px",
//               }}
//             />
//             <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>{img.name}</p>
//           </div>
//         ))}
//       </div>
//       <button onClick={generate3DModel}>Generate 3D Model</button>

//       {/* 3D download link */}
//       {modelUrl && (
//         <a
//           href={modelUrl}
//           download="model.glb"
//           style={{ display: "block", marginTop: "1rem", color: "blue" }}
//         >
//           Download 3D Model (GLB)
//         </a>
//       )}
//     </div>
//   )};



// "use client";
// import React, { useState, useMemo } from "react";
// import * as THREE from "three";
// import { Canvas } from "@react-three/fiber";
// import { OrbitControls } from "@react-three/drei";

// export default function Home() {
//   const [files, setFiles] = useState([]);
//   const [previews, setPreviews] = useState([]);
//   const [selectedColor, setSelectedColor] = useState("#ffffff");

//   const handleFileChange = (e) => {
//     const selectedFiles = Array.from(e.target.files || []);
//     setFiles(selectedFiles);

//     const previewURLs = selectedFiles.map((file) => ({
//       name: file.name,
//       url: URL.createObjectURL(file),
//     }));
//     setPreviews(previewURLs);
//   };

//   // Load textures for all images
//   const textures = useMemo(
//     () =>
//       files.map((file) => new THREE.TextureLoader().load(URL.createObjectURL(file))),
//     [files]
//   );

//   return (
//     <div style={{ padding: 24 }}>
//       <h1>Fabrication 3D App</h1>

//       {/* File input */}
//       <input
//         type="file"
//         multiple
//         accept="image/*"
//         onChange={handleFileChange}
//         style={{
//           display: "block",
//           marginTop: 16,
//           padding: 12,
//           border: "2px dashed #999",
//           borderRadius: 8,
//           cursor: "pointer",
//         }}
//       />

//       {/* Previews */}
//       <div
//         style={{
//           marginTop: 16,
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
//           gap: 12,
//         }}
//       >
//         {previews.map((p) => (
//           <div
//             key={p.name}
//             style={{
//               border: "1px solid #ddd",
//               borderRadius: 8,
//               overflow: "hidden",
//               background: "#fff",
//             }}
//           >
//             <img
//               src={p.url}
//               alt={p.name}
//               style={{
//                 width: "100%",
//                 height: 120,
//                 objectFit: "cover",
//                 display: "block",
//               }}
//             />
//             <div style={{ padding: 8, fontSize: 12 }}>{p.name}</div>
//           </div>
//         ))}
//       </div>

//       {/* Color palette */}
//       <div style={{ marginTop: 20 }}>
//         <span>Select color: </span>
//         {["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ffffff"].map((c) => (
//           <button
//             key={c}
//             onClick={() => setSelectedColor(c)}
//             style={{
//               background: c,
//               width: 30,
//               height: 30,
//               margin: 5,
//               border: "1px solid #000",
//               cursor: "pointer",
//             }}
//           />
//         ))}
//       </div>

//       {/* 3D Viewer */}
//       {files.length > 0 && (
//         <div style={{ width: "100%", height: "400px", marginTop: 20 }}>
//           <Canvas camera={{ position: [0, 0, 5] }}>
//             <ambientLight intensity={0.5} />
//             <directionalLight position={[0, 5, 5]} intensity={1} />
//             <group>
//               {textures.map((tex, i) => (
//                 <mesh key={i} position={[0, 0, i * 0.05]}>
//                   <planeGeometry args={[2, 2]} />
//                   <meshStandardMaterial
//                     map={tex}
//                     color={i === 0 ? selectedColor : 0xffffff} // only first plane colored
//                   />
//                 </mesh>
//               ))}
//             </group>
//             <OrbitControls />
//           </Canvas>
//         </div>
//       )}
//     </div>
//   );
// }


"use client";
import React, { useState, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

// Preset colors
const presetColors = [
  "#ffffff", "#000000", "#ff0000", "#00ff00", "#0000ff",
  "#ffff00", "#ff00ff", "#00ffff", "#ff8800", "#8844ff",
  "#00aa55", "#ccddee", "#aa00aa", "#ff5555", "#55ff55"
];

// Tint material (texture + color)
function TintedMaterial({ texture, tint }) {
  const materialRef = useRef();

  useMemo(() => {
    if (materialRef.current) {
      materialRef.current.color = new THREE.Color(tint);
      materialRef.current.needsUpdate = true;
    }
  }, [tint]);

  return <meshStandardMaterial ref={materialRef} map={texture} />;
}

export default function Home() {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [selectedColor, setSelectedColor] = useState("#ffffff");

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);

    const previewURLs = selectedFiles.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    setPreviews(previewURLs);
  };

  // Load textures
  const textures = useMemo(
    () =>
      files.map((file) =>
        new THREE.TextureLoader().load(URL.createObjectURL(file))
      ),
    [files]
  );

  return (
    <div style={{ padding: 24 }}>
      <h1>Fabrication 3D App</h1>

      {/* File input */}
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        style={{
          display: "block",
          marginTop: 16,
          padding: 12,
          border: "2px dashed #999",
          borderRadius: 8,
          cursor: "pointer",
        }}
      />

      {/* Previews */}
      <div
        style={{
          marginTop: 16,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: 12,
        }}
      >
        {previews.map((p) => (
          <div
            key={p.name}
            style={{
              border: "1px solid #ddd",
              borderRadius: 8,
              overflow: "hidden",
              background: "#fff",
            }}
          >
            <img
              src={p.url}
              alt={p.name}
              style={{
                width: "100%",
                height: 120,
                objectFit: "cover",
                display: "block",
              }}
            />
            <div style={{ padding: 8, fontSize: 12 }}>{p.name}</div>
          </div>
        ))}
      </div>

      {/* Color palette */}
      <div style={{ marginTop: 20 }}>
        <span>Select Color: </span>

        {presetColors.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedColor(c)}
            style={{
              background: c,
              width: 28,
              height: 28,
              margin: "0 5px",
              borderRadius: "50%",
              border: "1px solid #444",
              cursor: "pointer",
            }}
          />
        ))}

        {/* Color picker */}
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
          style={{
            marginLeft: 15,
            width: 40,
            height: 40,
            cursor: "pointer",
            border: "none",
          }}
        />
      </div>

      {/* 3D Viewer */}
      {files.length > 0 && (
        <div style={{ width: "100%", height: "400px", marginTop: 20 }}>
          <Canvas camera={{ position: [0, 0, 5] }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[0, 5, 5]} intensity={1} />

            <group>
              {textures.map((tex, i) => (
                <mesh key={i} position={[0, 0, i * 0.05]}>
                  <planeGeometry args={[2, 2]} />
                  <TintedMaterial
                    texture={tex}
                    tint={i === 0 ? selectedColor : "#ffffff"} // tint only 1st image
                  />
                </mesh>
              ))}
            </group>

            <OrbitControls />
          </Canvas>
        </div>
      )}
    </div>
  );
}

