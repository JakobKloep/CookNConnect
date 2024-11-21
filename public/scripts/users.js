import { db } from './Firebase-config.js';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

document.addEventListener('DOMContentLoaded', async () => {
    const userList = document.getElementById('userList');
    const searchInput = document.getElementById('searchInput');

    try {
        // Fetch users from Firestore
        const querySnapshot = await getDocs(collection(db, 'users'));
        const users = querySnapshot.docs.map(doc => doc.data());

        // Display users
        const displayUsers = (users) => {
            userList.innerHTML = '';
            users.forEach(user => {
                const li = document.createElement('li');
                const img = document.createElement('img');
                img.src = user.profilePicture ? `data:image/jpeg;base64,${user.profilePicture}` : 'default-profile.png';
                img.alt = user.displayName || 'User';
                const span = document.createElement('span');
                span.textContent = user.displayName || 'Unknown User';
                li.appendChild(img);
                li.appendChild(span);
                userList.appendChild(li);
            });
        };

        displayUsers(users);

        // Search functionality
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredUsers = users.filter(user => user.displayName.toLowerCase().includes(searchTerm));
            displayUsers(filteredUsers);
        });
    } catch (error) {
        console.error('Error fetching users: ', error);
        userList.innerHTML = '<li>Error fetching users. Please try again later.</li>';
    }
});