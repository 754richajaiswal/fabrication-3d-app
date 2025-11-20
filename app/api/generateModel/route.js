// // app/api/generateModel/route.js
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     const formData = await req.formData();
//     const files = formData.getAll("files");

//     if (!files || files.length === 0) {
//       return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
//     }

//     // Convert first file to base64 (Meshy needs image_url as public URL or base64)
//     const file = files[0];
//     const arrayBuffer = await file.arrayBuffer();
//     const base64 = Buffer.from(arrayBuffer).toString("base64");
//     const dataUri = `data:${file.type};base64,${base64}`;

//     // Prepare payload for Meshy
//     const payload = {
//       image_url: dataUri,
//       ai_model: "latest",
//       should_remesh: true,
//       should_texture: true,
//       enable_pbr: false,
//     };

//     const meshyApiKey = process.env.MESHY_API_KEY; // set this in .env.local

//     // Call Meshy API to create 3D task
//     const res = await fetch("https://api.meshy.ai/openapi/v1/image-to-3d", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${meshyApiKey}`,
//       },
//       body: JSON.stringify(payload),
//     });

//     const task = await res.json();
//     const taskId = task.result; // Meshy returns task ID

//     // Poll for completion (every 3 seconds, max 20 times)
//     let modelUrls = null;
//     for (let i = 0; i < 20; i++) {
//       await new Promise((r) => setTimeout(r, 3000));

//       const statusRes = await fetch(
//         `https://api.meshy.ai/openapi/v1/image-to-3d/${taskId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${meshyApiKey}`,
//           },
//         }
//       );

//       const statusJson = await statusRes.json();
//       if (statusJson.status === "SUCCEEDED") {
//         modelUrls = statusJson.model_urls;
//         break;
//       }
//       if (statusJson.status === "FAILED") {
//         return NextResponse.json({ error: "Meshy task failed", details: statusJson }, { status: 500 });
//       }
//     }

//     if (!modelUrls) {
//       return NextResponse.json({ error: "Meshy task timed out" }, { status: 500 });
//     }

//     return NextResponse.json({ modelUrls });
//   } catch (err) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }


import { NextResponse } from "next/server";

export async function POST(req) {
  const form = await req.formData();
  const file = form.get("image");

  if (!file) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Call HuggingFace TripoSR
  const response = await fetch(
    "https://api-inference.huggingface.co/models/stabilityai/triposr",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_TOKEN}`,
        "Content-Type": "image/png",
      },
      body: buffer,
    }
  );

  if (!response.ok) {
    const err = await response.text();
    console.log("HF ERROR:", err);
    return NextResponse.json({ error: err }, { status: 500 });
  }

  const modelArray = await response.arrayBuffer();

  return new NextResponse(modelArray, {
    status: 200,
    headers: { "Content-Type": "model/gltf-binary" },
  });
}

