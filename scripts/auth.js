import { auth, db } from './Firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('signUpForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('newEmail').value;
        const password = document.getElementById('newPassword').value;
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await sendEmailVerification(userCredential.user);
            alert('Sign Up Successful. Please check your email to verify your account.');
            await signOut(auth); // Sign out the user immediately after sign up
            document.getElementById('formTitle').innerText = 'Login';
            document.getElementById('signUpForm').style.display = 'none';
            document.getElementById('loginForm').style.display = 'block';
            document.getElementById('registerLink').style.display = 'block';
            document.getElementById('loginLink').style.display = 'none';
        } catch (error) {
            console.error('Error signing up: ', error);
            alert('Error signing up: ' + error.message);
        }
    });

    document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            if (userCredential.user.emailVerified) {
                alert('Sign In Successful');
                window.location.href = 'index.html'; // Navigate to the main page after sign-in
            } else {
                alert('Please verify your email before signing in.');
                await signOut(auth); // Sign out the user if email is not verified
            }
        } catch (error) {
            console.error('Error signing in: ', error);
            alert('Error signing in: ' + error.message);
        }
    });

    onAuthStateChanged(auth, async (user) => {
        const navList = document.getElementById('navList');
        if (navList) {
            navList.innerHTML = ''; // Clear existing items
            if (user) {
                // User is signed in
                const userDoc = doc(db, 'users', user.uid);
                const userSnapshot = await getDoc(userDoc);
                let displayName = 'Profile';
                let profilePicture = '';

                if (userSnapshot.exists()) {
                    const userData = userSnapshot.data();
                    displayName = userData.displayName || 'Profile';
                    profilePicture = userData.profilePicture || '';
                }

                const profileItem = document.createElement('li');
                profileItem.innerHTML = `
                    <div class="profile-info" id="profileInfo">
                        <img src="${profilePicture ? 'data:image/jpeg;base64,' + profilePicture : 'default-profile.png'}" class="profile-picture" alt="Profile Picture">
                        <span>${displayName}</span>
                    </div>
                `;
                navList.appendChild(profileItem);

                const signOutButton = document.createElement('li');
                signOutButton.innerHTML = '<a href="#" id="signOutButton">Sign Out</a>';
                navList.appendChild(signOutButton);

                document.getElementById('signOutButton').addEventListener('click', async () => {
                    await signOut(auth);
                    alert('Sign Out Successful');
                    window.location.href = 'index.html'; // Navigate to the main page after sign-out
                });

                document.getElementById('profileInfo').addEventListener('click', () => {
                    window.location.href = 'profile.html'; // Navigate to the profile page
                });
            } else {
                // User is signed out
                const signUpButton = document.createElement('li');
                signUpButton.innerHTML = '<a href="login.html">Login</a>';
                navList.appendChild(signUpButton);
            }
        }
    });
});