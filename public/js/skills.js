const API_URL_SKILLS = '/api/exchanges';

async function fetchSkills() {
    try {
        const response = await fetch(API_URL_SKILLS);
        const users = await response.json();

        const container = document.getElementById('skills-container');
        container.innerHTML = '';

        if (users.length === 0) {
            container.innerHTML = '<p class="text-center">Aucune compétence disponible pour le moment.</p>';
            return;
        }

        users.forEach(user => {
            user.skills.forEach(skill => {
                const card = document.createElement('div');
                card.className = 'skill-card';
                card.style.display = 'flex';
                card.style.flexDirection = 'column';
                card.style.justifyContent = 'space-between';
                card.style.textAlign = 'left';

                const categoryIcon = getIconForCategory(skill.category);

                card.innerHTML = `
                    <div>
                        <div class="skill-header" style="display: flex; align-items: center; margin-bottom: 1rem;">
                            <div class="skill-icon" style="margin: 0; width: 50px; height: 50px; font-size: 1.2rem; margin-right: 1rem;">
                                <i class="${categoryIcon}"></i>
                            </div>
                            <div>
                                <h3 class="skill-title" style="font-size: 1.1rem; margin-bottom: 0.2rem;">${skill.name}</h3>
                                <span class="badge" style="background-color: var(--secondary-light); color: var(--dark-color); padding: 2px 8px; border-radius: 12px; font-size: 0.8rem;">${user.role === 'senior' ? 'Senior Expert' : 'Jeune Talent'}</span>
                            </div>
                        </div>
                        <p class="skill-description" style="font-size: 0.95rem; margin-bottom: 1rem;">${skill.description}</p>
                        <div style="margin-bottom: 1rem; color: var(--primary-color); font-weight: 600;">
                            <i class="fas fa-coins"></i> ${skill.price} points
                        </div>
                    </div>
                    <div style="border-top: 1px solid var(--light-gray); padding-top: 1rem; margin-top: auto; display: flex; align-items: center;">
                        <div style="flex: 1; font-weight: 500;">
                            ${user.name}
                        </div>
                        <button class="btn btn-outline" style="padding: 0.4rem 1rem; font-size: 0.9rem; margin-right: 0.5rem;" onclick="window.location.href='chat.html?receiverId=${user._id}&receiverName=${encodeURIComponent(user.name)}'">Message</button>
                        <button class="btn btn-primary" style="padding: 0.4rem 1rem; font-size: 0.9rem;" onclick="showContactInfo('${user.name}', '${user.email}')">Contacter</button>
                    </div>
                `;
                container.appendChild(card);
            });
        });

    } catch (error) {
        console.error('Erreur:', error);
        document.getElementById('skills-container').innerHTML = '<p class="text-center error-alert">Erreur de chargement des compétences.</p>';
    }
}

function getIconForCategory(category) {
    if (!category) return 'fas fa-star';
    const lower = category.toLowerCase();
    if (lower.includes('cuisine')) return 'fas fa-utensils';
    if (lower.includes('bricolage') || lower.includes('bois')) return 'fas fa-tools';
    if (lower.includes('jardin')) return 'fas fa-seedling';
    if (lower.includes('info') || lower.includes('ordinateur')) return 'fas fa-laptop';
    if (lower.includes('langue') || lower.includes('français')) return 'fas fa-book-open';
    if (lower.includes('finance') || lower.includes('gestion')) return 'fas fa-calculator';
    return 'fas fa-lightbulb';
}

// functions available globally
window.showContactInfo = function (name, email) {
    const modal = document.getElementById('contact-modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');

    title.textContent = `Contacter ${name}`;
    body.innerHTML = `
        <div class="contact-info-item">
            <i class="fas fa-envelope"></i>
            <div>
                <small style="color: var(--gray-color);">Email</small>
                <div style="font-weight: 600; font-size: 1.1rem;">${email}</div>
            </div>
        </div>
        <p style="text-align: center; color: var(--gray-color); margin-top: 1rem;">
            Dites-lui que vous venez de la part de <strong>Symbiose</strong> !
        </p>
    `;

    modal.style.display = 'flex';
}

window.closeModal = function () {
    const modal = document.getElementById('contact-modal');
    modal.style.display = 'none';
}

// Close on outside click
window.onclick = function (event) {
    const modal = document.getElementById('contact-modal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Close button
document.querySelector('.close-modal').addEventListener('click', window.closeModal);

document.addEventListener('DOMContentLoaded', fetchSkills);
