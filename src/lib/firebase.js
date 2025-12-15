import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPqAresxV9OciDMhTftMRojmiddZ5mTvo",
  authDomain: "unitedassociatesagencies-aa019.firebaseapp.com",
  projectId: "unitedassociatesagencies-aa019",
  storageBucket: "unitedassociatesagencies-aa019.firebasestorage.app",
  messagingSenderId: "97262620754",
  appId: "1:97262620754:web:e41882433fbe968635cf8b",
  measurementId: "G-Y9WJKHERMN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); // Initialized as requested
export const db = getFirestore(app); // Exported for the app to use
