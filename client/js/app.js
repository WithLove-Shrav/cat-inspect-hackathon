import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';
import { getFirestore, collection, addDoc } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyAsXnNxF9ptqTWDSUHz51tkfF2-oLCbz9I",
  authDomain: "shravyadasshravya.firebaseapp.com",
  projectId: "shravyadasshravya",
  messagingSenderId: "1011795880766",
  appId: "1:1011795880766:web:cb4413e5f5edf77fb29a6f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Handle Login
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('inspection-form').style.display = 'block';
  } catch (error) {
    alert('Login failed: ' + error.message);
  }
});

// Handle Form Submission
document.getElementById('inspection-data').addEventListener('submit', async (e) => {
  e.preventDefault();
  const inspectionData = {
    truckSerial: document.getElementById('truckSerial').value,
    truckModel: document.getElementById('truckModel').value,
    inspectorName: document.getElementById('inspectorName').value,
    tires: {
      leftFrontPressure: parseInt(document.getElementById('leftFrontPressure').value),
      leftFrontCondition: document.getElementById('leftFrontCondition').value,
      summary: document.getElementById('tireSummary').value
    }
    // Add other sections similarly
  };

  // Upload images to Cloudinary
  const tireImages = document.getElementById('tireImages').files;
  const imageUrls = [];
  for (let file of tireImages) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'cat_inspect'); // Create preset in Cloudinary Dashboard
    const response = await fetch('https://api.cloudinary.com/v1_1/ddj17ecaj/image/upload', {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    imageUrls.push(data.secure_url);
  }
  inspectionData.tires.images = imageUrls;
  console.log('Inspection Data to Save:', inspectionData);
  if (imageUrls.includes(undefined)) {
  alert("Image upload failed. Please check your Cloudinary config.");
  return;
}


  // Save to Firestore
  try {
    await addDoc(collection(db, 'inspections'), {
      ...inspectionData,
      inspectionId: Date.now().toString(), // Simple auto-increment
      createdBy: auth.currentUser.uid,
      timestamp: new Date()
    });
    alert('Inspection saved!');
    document.getElementById('download-pdf').style.display = 'block';
  } catch (error) {
    alert('Error saving inspection: ' + error.message);
  }
});