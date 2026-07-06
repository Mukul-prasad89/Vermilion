import admin from "firebase-admin";
import "./env.js";

const projectId = process.env.FIREBASE_PROJECT_ID;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

let fcm = null;

const hasValidCredentials = projectId && privateKey && clientEmail && privateKey.includes("-----BEGIN");

if (hasValidCredentials && !admin.apps.length) {
  try {
    const serviceAccount = {
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, "\n"),
    };
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    fcm = admin.messaging();
    console.log("Firebase initialized successfully");
  } catch (err) {
    console.warn("Firebase init failed, push notifications disabled:", err.message);
  }
} else {
  console.warn("Firebase credentials not configured. Push notifications disabled.");
  console.warn("Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY (PEM)");
}

export { fcm };