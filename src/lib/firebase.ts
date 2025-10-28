import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import imageCompression from "browser-image-compression";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export const optimizeAndUploadImageWebP = async (
  base64: string,
  fileName: string
) => {
  // Convertir base64 a File
  const res = await fetch(base64);
  const blob = await res.blob();
  const file = new File([blob], fileName, { type: blob.type });

  // Optimizar y convertir a WebP en el navegador
  const compressedFile = await imageCompression(file, {
    maxWidthOrHeight: 1200,
    maxSizeMB: 0.5,
    fileType: "image/webp",
    useWebWorker: true,
  });

  // Convertir a base64
  const compressedBase64 = await imageCompression.getDataUrlFromFile(
    compressedFile
  );

  // Subir a Firebase Storage
  const storageRef = ref(storage, `products/${fileName}.webp`);
  await uploadString(storageRef, compressedBase64, "data_url");
  const url = await getDownloadURL(storageRef);
  return url;
};
