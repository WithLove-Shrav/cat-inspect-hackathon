const express = require('express');
const cors = require('cors');
const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');
const { getAuth } = require('firebase/auth');
const { v2: cloudinary } = require('cloudinary');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAsXnNxF9ptqTWDSUHz51tkfF2-oLCbz9I",
  authDomain: "shravyadasshravya.firebaseapp.com",
  projectId: "shravyadasshravya",
  messagingSenderId: "1011795880766",
  appId: "1:1011795880766:web:cb4413e5f5edf77fb29a6f"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

// Initialize Cloudinary
cloudinary.config({
  cloud_name: "ddj17ecaj",
  api_key: "648693838261631",
  api_secret: "XxrPrdfaPRkQ34n-JPQ-BuidhCA"
});

// Test endpoint
app.get('/', (req, res) => {
  res.send('CAT Inspect Backend with Cloudinary is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));