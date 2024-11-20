import { db } from "./Firebase-config.js";
import {doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

function compressImage(file, callback) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const maxWidth = 800;
            const maxHeight = 800;
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
            callback(dataUrl);
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

// Function to upload image
window.uploadImage = async function() {
    const fileInput = document.getElementById('imageInput');
    const file = fileInput.files[0];

    if (file) {
        compressImage(file, async function(dataUrl) {
            const base64String = dataUrl.split(',')[1];
            try {
                await setDoc(doc(db, 'images', 'latestImage'), {
                    image: base64String
                });
                alert('Image uploaded successfully!');
                displayImage(dataUrl);
            } catch (error) {
                console.error('Error uploading image: ', error);
            }
        });
    }
}

// Function to display image
function displayImage(dataUrl) {
    const imgElement = document.createElement('img');
    imgElement.src = dataUrl;
    const uploadedImageDiv = document.getElementById('uploadedImage');
    uploadedImageDiv.innerHTML = '';
    uploadedImageDiv.appendChild(imgElement);
}

// Retrieve and display the image on page load
window.onload = async function() {
    try {
        const docRef = doc(db, 'images', 'latestImage');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const base64String = docSnap.data().image;
            const dataUrl = 'data:image/jpeg;base64,' + base64String;
            displayImage(dataUrl);
        } else {
            console.log('No image found!');
        }
    } catch (error) {
        console.error('Error retrieving image: ', error);
    }
};