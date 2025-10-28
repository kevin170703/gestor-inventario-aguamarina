// app/api/upload/route.ts
import { NextResponse } from "next/server";
import sharp from "sharp";
import { initializeApp, getApps } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

if (!getApps().length) {
  initializeApp({
    credential: require("firebase-admin").credential.cert(
      JSON.parse(process.env.FIREBASE_ADMIN_KEY as string)
    ),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

const bucket = getStorage().bucket();

export async function POST(req: Request) {
  try {
    const { imageBase64, fileName } = await req.json();

    const buffer = Buffer.from(imageBase64.split(",")[1], "base64");

    // Optimiza con sharp (reduce tamaño y cambia formato)
    const optimized = await sharp(buffer)
      .resize({ width: 1200 }) // ajusta ancho máximo
      .jpeg({ quality: 80 }) // comprime
      .toBuffer();

    const file = bucket.file(`products/${fileName}.jpg`);
    await file.save(optimized, {
      contentType: "image/jpeg",
      public: true,
    });

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json({ error: "Failed to upload" }, { status: 500 });
  }
}
