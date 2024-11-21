import { auth, db } from './firebase-config.js';
import { updateProfile, deleteUser, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userDoc = doc(db, 'users', user.uid);
            const userSnapshot = await getDoc(userDoc);

            if (userSnapshot.exists()) {
                const userData = userSnapshot.data();
                document.getElementById('displayName').value = userData.displayName || '';
                document.getElementById('displayNameHeader').innerText = userData.displayName || 'Profile';
                if (userData.profilePicture) {
                    displayProfilePicture(userData.profilePicture);
                }
            }

            document.getElementById('email').value = user.email || '';
        } else {
            console.error('No user is currently signed in.');
        }

        document.getElementById('profileForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const displayName = document.getElementById('displayName').value;
            const profilePictureInput = document.getElementById('profilePicture');
            const profilePictureFile = profilePictureInput.files[0];

            try {
                if (user) {
                    let profilePictureBase64 = null;
                    if (profilePictureFile) {
                        profilePictureBase64 = await compressAndConvertToBase64(profilePictureFile);
                    }

                    await updateProfile(user, { displayName });
                    await setDoc(doc(db, 'users', user.uid), { displayName, profilePicture: profilePictureBase64 }, { merge: true });
                    document.getElementById('displayNameHeader').innerText = displayName;
                    if (profilePictureBase64) {
                        displayProfilePicture(profilePictureBase64);
                    }
                    alert('Profile updated successfully.');
                } else {
                    console.error('No user is currently signed in.');
                    alert('No user is currently signed in.');
                }
            } catch (error) {
                console.error('Error updating profile: ', error);
                alert('Error updating profile: ' + error.message);
            }
        });

        document.getElementById('deleteAccountButton').addEventListener('click', async () => {
            if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                try {
                    if (user) {
                        const userDoc = doc(db, 'users', user.uid);
                        await deleteDoc(userDoc);
                        await deleteUser(user);
                        alert('Account deleted successfully.');
                        window.location.href = 'index.html';
                    } else {
                        console.error('No user is currently signed in.');
                        alert('No user is currently signed in.');
                    }
                } catch (error) {
                    console.error('Error deleting account: ', error);
                    alert('Error deleting account: ' + error.message);
                }
            }
        });

        document.getElementById('homeButton').addEventListener('click', () => {
            window.location.href = 'index.html'; // Navigate to the home page
        });
    });
});

function compressAndConvertToBase64(file) {
    return new Promise((resolve, reject) => {
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
                resolve(dataUrl.split(',')[1]);
            };
            img.src = event.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function displayProfilePicture(base64String) {
    const dataUrl = 'data:image/jpeg;base64,' + base64String;
    const imgElement = document.getElementById('profileImage');
    imgElement.src = dataUrl;
}