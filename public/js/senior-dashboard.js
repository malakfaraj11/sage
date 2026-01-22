// Check authentication
const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');

if (!user || !token) {
    window.location.href = 'login.html';
}

// Display Name
document.getElementById('user-name').textContent = user.name;

// Fetch Profile Data (to get latest skills)
async function fetchProfile() {
    try {
        // Since we don't have a GET /profile yet, we rely on local data or setup a GET endpoint.
        // For MVP, we'll iterate on the user object from local storage if updated, 
        // OR ideally we fetch from a GET /profile endpoint.
        // Let's assume for now we use the stored user skills, but if we just added one, we need to refresh.
        // We will implement a simple refresh from the update response.
        renderSkills(user.skills || []);
    } catch (error) {
        console.error(error);
    }
}

// Render Skills List
function renderSkills(skills) {
    const list = document.getElementById('my-skills-list');
    list.innerHTML = '';

    if (skills.length === 0) {
        list.innerHTML = '<p style="color: #666;">Vous n\'avez pas encore ajouté de savoir.</p>';
        return;
    }

    skills.forEach((skill, index) => {
        const div = document.createElement('div');
        div.className = 'skill-item-large';
        div.innerHTML = `
            <div>
                <strong>${skill.name}</strong><br>
                <small>${skill.category} - ${skill.price} pts</small>
            </div>
            <button onclick="removeSkill(${index})" style="background:none; border:none; color: #EF4444; font-size: 1.2rem; cursor:pointer;">
                <i class="fas fa-trash"></i>
            </button>
        `;
        list.appendChild(div);
    });
}

// Add Skill
const form = document.getElementById('add-skill-form');
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newSkill = {
        name: document.getElementById('skill-name').value,
        description: document.getElementById('skill-desc').value,
        price: parseInt(document.getElementById('skill-price').value),
        category: document.getElementById('skill-category').value
    };

    const updatedSkills = [...(user.skills || []), newSkill];

    try {
        const res = await fetch('/api/auth/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ skills: updatedSkills })
        });

        const data = await res.json();

        if (res.ok) {
            // Update local storage
            localStorage.setItem('user', JSON.stringify(data));
            user.skills = data.skills; // Update local variable
            renderSkills(user.skills);
            form.reset();
            alert('Votre savoir a été ajouté avec succès !');
        } else {
            alert('Erreur: ' + data.message);
        }
    } catch (err) {
        console.error(err);
        alert('Erreur serveur');
    }
});

// Remove Skill
window.removeSkill = async (index) => {
    if (!confirm('Voulez-vous vraiment supprimer ce savoir ?')) return;

    const updatedSkills = [...user.skills];
    updatedSkills.splice(index, 1);

    try {
        const res = await fetch('/api/auth/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ skills: updatedSkills })
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('user', JSON.stringify(data));
            user.skills = data.skills;
            renderSkills(user.skills);
        }
    } catch (err) {
        console.error(err);
    }
};

// Init
fetchProfile();
