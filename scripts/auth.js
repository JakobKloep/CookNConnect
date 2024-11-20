import { auth } from './Firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const provider = new GoogleAuthProvider();

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('signUpForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('newEmail').value;
        const password = document.getElementById('newPassword').value;
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await sendEmailVerification(userCredential.user);
            alert('Sign Up Successful. Please check your email to verify your account.');
            window.location.href = 'index.html'; // Navigate to the main page after sign-up
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
            }
        } catch (error) {
            console.error('Error signing in: ', error);
            alert('Error signing in: ' + error.message);
        }
    });


    onAuthStateChanged(auth, (user) => {
        const navList = document.getElementById('navList');
        if (navList) {
            navList.innerHTML = ''; // Clear existing items
            if (user) {
                // User is signed in
                const profileButton = document.createElement('li');
                profileButton.innerHTML = '<a href="profile.html">Profile</a>';
                navList.appendChild(profileButton);

                const signOutButton = document.createElement('li');
                signOutButton.innerHTML = '<a href="#" id="signOutButton">Sign Out</a>';
                navList.appendChild(signOutButton);

                document.getElementById('signOutButton').addEventListener('click', async () => {
                    await signOut(auth);
                    window.location.reload();
                });
            } else {
                // No user is signed in
                const signInButton = document.createElement('li');
                signInButton.innerHTML = '<a href="login.html" id="signInButton">Sign Up/Sign In</a>';
                navList.appendChild(signInButton);
            }
        }
    });
});