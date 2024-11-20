import { auth } from './Firebase-config.js';
import { updateProfile, deleteUser, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const db = getFirestore();

document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userDoc = doc(db, 'users', user.uid);
            const userSnapshot = await getDoc(userDoc);

            if (userSnapshot.exists()) {
                const userData = userSnapshot.data();
                document.getElementById('displayName').value = userData.displayName || '';
                document.getElementById('displayNameHeader').innerText = userData.displayName || 'Profile';
            }

            document.getElementById('email').value = user.email || '';
        } else {
            console.error('No user is currently signed in.');
        }

        document.getElementById('profileForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const displayName = document.getElementById('displayName').value;

            try {
                if (user) {
                    await updateProfile(user, { displayName });
                    await setDoc(doc(db, 'users', user.uid), { displayName }, { merge: true });
                    document.getElementById('displayNameHeader').innerText = displayName;
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
                        await deleteUser(user);
                        alert('Account deleted successfully.');
                        window.location.href = 'index.html'; // Navigate to the main page after account deletion
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