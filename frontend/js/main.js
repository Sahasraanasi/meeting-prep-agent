/**
 * Global Editing State & Helpers
 */
let editingContactId = null;
let editingMeetingId = null;

/**
 * Custom Toast Notification System
 */
function showToast(message, type = 'success') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

/**
 * Loading State Helper
 */
function setLoadingState(buttonElement, spinnerElement, isLoading, defaultText = "Generate Summary") {
    if (isLoading) {
        buttonElement.disabled = true;
        buttonElement.textContent = "Analyzing...";
        if (spinnerElement) spinnerElement.style.display = 'flex';
    } else {
        buttonElement.disabled = false;
        buttonElement.textContent = defaultText;
        if (spinnerElement) spinnerElement.style.display = 'none';
    }
}

/**
 * Validation Helper
 */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * DataService: Abstraction layer for data persistence.
 * Updated to isolate user profile data by current user identifier.
 */
const DataService = {
    getCurrentUserEmail: () => {
        try {
            const currentUser = JSON.parse(localStorage.getItem('mpa_current_user'));
            return currentUser ? currentUser.email : null;
        } catch (e) {
            return null;
        }
    },

    getUser: () => {
        const email = DataService.getCurrentUserEmail();
        if (!email) return {};
        return JSON.parse(localStorage.getItem(`meetingAgentUser_${email}`)) || {};
    },
    
    saveUser: (userData) => {
        const email = DataService.getCurrentUserEmail();
        if (email) {
            localStorage.setItem(`meetingAgentUser_${email}`, JSON.stringify(userData));
        }
        return Promise.resolve(userData);
    },

    getContacts: () => JSON.parse(localStorage.getItem('meetingAgentContacts')) || [],
    addContact: (contactData) => {
        const contacts = DataService.getContacts();
        contacts.push(contactData);
        localStorage.setItem('meetingAgentContacts', JSON.stringify(contacts));
        return Promise.resolve(contactData);
    },

    getMeetings: () => JSON.parse(localStorage.getItem('meetingAgentMeetings')) || [],
    addMeeting: (meetingData) => {
        const meetings = DataService.getMeetings();
        meetings.push(meetingData);
        localStorage.setItem('meetingAgentMeetings', JSON.stringify(meetings));
        return Promise.resolve(meetingData);
    }
};

/**
 * Milestone C: Edit Helper Functions (Global Scope)
 */
window.editContact = function(contactEmail) {
    const contacts = DataService.getContacts();
    const contact = contacts.find(c => c.email === contactEmail);
    if (contact) {
        document.getElementById('contactName').value = contact.name || '';
        document.getElementById('contactCompany').value = contact.company || '';
        document.getElementById('contactJobTitle').value = contact.jobTitle || '';
        document.getElementById('contactEmail').value = contact.email || '';
        document.getElementById('contactPhone').value = contact.phone || '';
        
        editingContactId = contactEmail;
        const submitBtn = document.querySelector('#contactForm button[type="submit"]');
        if (submitBtn) submitBtn.textContent = 'Update Contact';
        showToast('Contact loaded for editing.', 'info');
    }
};

window.editMeeting = function(meetingIndex) {
    const meetings = DataService.getMeetings();
    const meeting = meetings[meetingIndex];
    if (meeting) {
        const contactSelect = document.getElementById('contactSelect');
        if (contactSelect) contactSelect.value = meeting.contactId || '';
        
        const meetingTitle = document.getElementById('meetingTitle');
        if (meetingTitle) meetingTitle.value = meeting.title || '';
        
        const meetingDate = document.getElementById('meetingDate');
        if (meetingDate) meetingDate.value = meeting.date || '';
        
        const meetingNotes = document.getElementById('meetingNotes');
        if (meetingNotes) meetingNotes.value = meeting.notes || '';
        
        const meetingSummary = document.getElementById('meetingSummary');
        if (meetingSummary) meetingSummary.value = meeting.summary || '';
        
        editingMeetingId = meetingIndex;
        const saveBtn = document.querySelector('#meetingForm button[type="submit"]');
        if (saveBtn) saveBtn.textContent = 'Update Meeting';
        showToast('Meeting loaded for editing.', 'info');
    }
};

document.addEventListener('DOMContentLoaded', () => {

    /* ================= 1. PROFILE PAGE LOGIC ================= */
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        const user = DataService.getUser();
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const companyInput = document.getElementById('company');
        const roleInput = document.getElementById('role');
        const editProfileBtn = document.getElementById('editProfileBtn');
        const saveProfileBtn = document.getElementById('saveProfileBtn');

        // Populate initial user data if available for the current user, otherwise leave empty
        if (user.name) {
            nameInput.value = user.name || '';
            emailInput.value = user.email || '';
            companyInput.value = user.company || '';
            roleInput.value = user.role || '';
        } else {
            nameInput.value = '';
            // Pre-fill email from session if available, else blank
            const sessionEmail = DataService.getCurrentUserEmail();
            emailInput.value = sessionEmail || '';
            companyInput.value = '';
            roleInput.value = '';
        }

        // Enable editing when "Edit Profile" is clicked
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', () => {
                nameInput.disabled = false;
                emailInput.disabled = false;
                companyInput.disabled = false;
                roleInput.disabled = false;

                editProfileBtn.style.display = 'none';
                saveProfileBtn.style.display = 'inline-block';
                showToast('Profile unlocked for editing.', 'info');
            });
        }

        // Save updated profile data
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = emailInput.value.trim();

            if (!isValidEmail(email)) {
                showToast('Please enter a valid email address.', 'error');
                return;
            }

            const userData = {
                name: nameInput.value.trim(),
                email: email,
                company: companyInput.value.trim(),
                role: roleInput.value.trim()
            };

            DataService.saveUser(userData).then(() => {
                showToast('Profile saved successfully!');

                // Re-lock fields after saving
                nameInput.disabled = true;
                emailInput.disabled = true;
                companyInput.disabled = true;
                roleInput.disabled = true;

                saveProfileBtn.style.display = 'none';
                editProfileBtn.style.display = 'inline-block';
            });
        });
    }

    /* ================= 2. CONTACTS PAGE LOGIC ================= */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const contactsList = document.getElementById('contactsList');

        const renderContacts = () => {
            const contacts = DataService.getContacts();
            if (contacts.length === 0) {
                contactsList.innerHTML = '<p style="color: #7f8c8d;">No contacts added yet.</p>';
                return;
            }

            contactsList.innerHTML = '';
            contacts.forEach((contact, index) => {
                const card = document.createElement('div');
                card.className = 'contact-card';

                card.innerHTML = `
                    <h4>${contact.name} (${contact.jobTitle})</h4>
                    <p><strong>Company:</strong> ${contact.company}</p>
                    <p><strong>Email:</strong> ${contact.email}</p>
                    <p><strong>Phone:</strong> ${contact.phone}</p>

                    <div style="display: flex; gap: 8px; margin-top: 10px;">
                        <button onclick="editContact('${contact.email}')"
                                type="button"
                                style="background:#3b82f6; color:white; border:none; padding:8px 12px; border-radius:4px; cursor:pointer;">
                            Edit
                        </button>
                        <button class="delete-contact-btn"
                                data-index="${index}"
                                type="button"
                                style="background:#e74c3c; color:white; border:none; padding:8px 12px; border-radius:4px; cursor:pointer;">
                            Delete
                        </button>
                    </div>
                `;
                contactsList.appendChild(card);
            });

            document.querySelectorAll('.delete-contact-btn').forEach(button => {
                button.addEventListener('click', () => {
                    const index = button.dataset.index;
                    const contacts = DataService.getContacts();
                    contacts.splice(index, 1);
                    localStorage.setItem('meetingAgentContacts', JSON.stringify(contacts));
                    renderContacts();
                    showToast('Contact deleted successfully!');
                });
            });
        };

        renderContacts();

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('contactEmail').value.trim();
            const phone = document.getElementById('contactPhone').value.trim();
            const name = document.getElementById('contactName').value.trim();
            const company = document.getElementById('contactCompany').value.trim();
            const jobTitle = document.getElementById('contactJobTitle').value.trim();

            if (!isValidEmail(email)) {
                showToast('Please enter a valid email address for the contact.', 'error');
                return;
            }

            if (!/^[0-9]{10}$/.test(phone)) {
                showToast('Please enter a valid 10-digit phone number.', 'error');
                return;
            }

            if (editingContactId !== null) {
                let contacts = DataService.getContacts();
                contacts = contacts.map(c => {
                    if (c.email === editingContactId) {
                        return { ...c, name, company, jobTitle, email, phone };
                    }
                    return c;
                });
                localStorage.setItem('meetingAgentContacts', JSON.stringify(contacts));
                
                editingContactId = null;
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                if (submitBtn) submitBtn.textContent = 'Add Contact';

                contactForm.reset();
                renderContacts();
                showToast('Contact updated successfully!');
            } else {
                const newContact = { name, company, jobTitle, email, phone };
                DataService.addContact(newContact).then(() => {
                    contactForm.reset();
                    renderContacts();
                    showToast('Contact added successfully!');
                });
            }
        });
    }

    /* ================= 3. MEETING NOTES PAGE LOGIC ================= */
    const meetingForm = document.getElementById('meetingForm');
    if (meetingForm) {
        const contactSelect = document.getElementById('contactSelect');
        const generateSummaryBtn = document.getElementById('generateSummaryBtn');
        const meetingsList = document.getElementById('meetingsList');

        const contacts = DataService.getContacts();
        contacts.forEach((contact) => {
            const option = document.createElement('option');
            option.value = contact.name;
            option.textContent = `${contact.name} (${contact.company} - ${contact.jobTitle})`;
            contactSelect.appendChild(option);
        });

        const renderMeetings = () => {
            const meetings = DataService.getMeetings();
            if (meetings.length === 0) {
                meetingsList.innerHTML = '<p style="color: #7f8c8d;">No meetings saved yet.</p>';
                return;
            }

            meetingsList.innerHTML = '';
            meetings.forEach((meeting, index) => {
                const card = document.createElement('div');
                card.className = 'meeting-card';

                card.innerHTML = `
                    <h4>${meeting.title}</h4>
                    <p><strong>Date:</strong> ${new Date(meeting.date).toLocaleString()}</p>
                    <p><strong>Contact:</strong> ${meeting.contactId}</p>
                    <p><strong>Notes:</strong> ${meeting.notes}</p>
                    <p><strong>Summary:</strong> ${meeting.summary || 'No summary provided.'}</p>

                    <div style="display: flex; gap: 8px; margin-top: 10px;">
                        <button onclick="editMeeting(${index})"
                                type="button"
                                style="background:#3b82f6; color:white; border:none; padding:8px 12px; border-radius:4px; cursor:pointer;">
                            Edit
                        </button>
                        <button class="delete-meeting-btn"
                                data-index="${index}"
                                type="button"
                                style="background:#e74c3c; color:white; border:none; padding:8px 12px; border-radius:4px; cursor:pointer;">
                            Delete Meeting
                        </button>
                    </div>
                `;
                meetingsList.appendChild(card);
            });

            document.querySelectorAll('.delete-meeting-btn').forEach(button => {
                button.addEventListener('click', () => {
                    const index = button.dataset.index;
                    const meetings = DataService.getMeetings();
                    meetings.splice(index, 1);
                    localStorage.setItem('meetingAgentMeetings', JSON.stringify(meetings));
                    renderMeetings();
                    showToast('Meeting deleted successfully!');
                });
            });
        };

        renderMeetings();

        if (generateSummaryBtn) {
            generateSummaryBtn.addEventListener('click', async () => {
                const notes = document.getElementById('meetingNotes').value.trim();

                if (!notes) {
                    showToast('Please enter some meeting notes first!', 'error');
                    return;
                }

                setLoadingState(generateSummaryBtn, null, true);

                try {
                    const response = await fetch('http://localhost:5000/ai/summary', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ notes })
                    });

                    const result = await response.json();

                    if (result.success) {
                        document.getElementById('meetingSummary').value = result.data;
                        showToast('Summary generated successfully!');
                    } else {
                        showToast('Failed to generate summary.', 'error');
                    }
                } catch (error) {
                    console.error(error);
                    showToast('Backend connection failed.', 'error');
                }

                setLoadingState(generateSummaryBtn, null, false, "Generate Summary");
            });
        }

        meetingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const title = document.getElementById('meetingTitle').value.trim();
            const date = document.getElementById('meetingDate').value;
            const contactId = contactSelect.value;
            const notes = document.getElementById('meetingNotes').value.trim();
            const summary = document.getElementById('meetingSummary').value.trim();

            if (editingMeetingId !== null) {
                let meetings = DataService.getMeetings();
                meetings[editingMeetingId] = { title, date, contactId, notes, summary };
                localStorage.setItem('meetingAgentMeetings', JSON.stringify(meetings));

                editingMeetingId = null;
                const saveBtn = meetingForm.querySelector('button[type="submit"]');
                if (saveBtn) saveBtn.textContent = 'Save Meeting';

                meetingForm.reset();
                renderMeetings();
                showToast('Meeting updated successfully!');
            } else {
                const newMeeting = { title, date, contactId, notes, summary };
                DataService.addMeeting(newMeeting).then(() => {
                    meetingForm.reset();
                    renderMeetings();
                    showToast('Meeting saved successfully!');
                });
            }
        });
    }

    /* ================= 4. MEETING BRIEF PAGE LOGIC ================= */
    const selectMeetingBrief = document.getElementById('selectMeetingBrief');
    if (selectMeetingBrief) {
        const briefOutputContainer = document.getElementById('briefOutputContainer');
        const meetings = DataService.getMeetings();
        const contacts = DataService.getContacts();
        const user = DataService.getUser();

        meetings.forEach((meeting, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${meeting.title} (${new Date(meeting.date).toLocaleDateString()})`;
            selectMeetingBrief.appendChild(option);
        });

        selectMeetingBrief.addEventListener('change', (e) => {
            const selectedIndex = e.target.value;
            if (selectedIndex === "") {
                briefOutputContainer.innerHTML = '';
                return;
            }

            const meeting = meetings[selectedIndex];
            const contact = contacts.find(c => c.name === meeting.contactId) || { company: 'N/A', jobTitle: 'N/A', email: 'N/A', phone: 'N/A' };

            briefOutputContainer.innerHTML = `
                <div class="brief-box" style="background: #fff; border: 1px solid #dcdde1; padding: 2rem; border-radius: 8px; margin-top: 1.5rem;">
                    <div style="margin-bottom: 1.5rem;">
                        <h3 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 0.3rem; margin-bottom: 0.8rem;">Meeting Overview</h3>
                        <p><strong>Title:</strong> ${meeting.title}</p>
                        <p><strong>Date & Time:</strong> ${new Date(meeting.date).toLocaleString()}</p>
                    </div>

                    <div style="margin-bottom: 1.5rem;">
                        <h3 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 0.3rem; margin-bottom: 0.8rem;">Organizer Profile</h3>
                        <p><strong>Name:</strong> ${user.name || 'Not set'} (${user.role || 'N/A'} at ${user.company || 'N/A'})</p>
                        <p><strong>Email:</strong> ${user.email || 'N/A'}</p>
                    </div>

                    <div style="margin-bottom: 1.5rem;">
                        <h3 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 0.3rem; margin-bottom: 0.8rem;">Attendee / Contact Details</h3>
                        <p><strong>Name:</strong> ${meeting.contactId}</p>
                        <p><strong>Company:</strong> ${contact.company}</p>
                        <p><strong>Job Title:</strong> ${contact.jobTitle}</p>
                        <p><strong>Email:</strong> ${contact.email} | <strong>Phone:</strong> ${contact.phone}</p>
                    </div>

                    <div style="margin-bottom: 1.5rem;">
                        <h3 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 0.3rem; margin-bottom: 0.8rem;">Structured Summary</h3>
                        <p>${meeting.summary || 'No summary generated.'}</p>
                    </div>

                    <div>
                        <h3 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 0.3rem; margin-bottom: 0.8rem;">Raw Notes</h3>
                        <p style="white-space: pre-wrap; background: #f8f9fa; padding: 1rem; border-radius: 4px;">${meeting.notes}</p>
                    </div>
                </div>
            `;
        });
    }

    /* ================= 5. AUTHENTICATION PAGES LOGIC ================= */
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const username = document.getElementById('signupUsername').value.trim();
            const email = document.getElementById('signupEmail').value.trim();
            const password = document.getElementById('signupPassword').value;

            if (!username || !email || !password) {
                showToast('Please fill in all required fields.', 'error');
                return;
            }

            try {
                const existingUsers = JSON.parse(localStorage.getItem('mpa_users')) || [];
                const userExists = existingUsers.some(u => u.email === email || u.username === username);
                if (userExists) {
                    showToast('An account with this email or username already exists.', 'error');
                    return;
                }

                existingUsers.push({ username, email, password, createdAt: new Date().toISOString() });
                localStorage.setItem('mpa_users', JSON.stringify(existingUsers));

                showToast('Account created successfully! Redirecting to login...', 'success');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            } catch (error) {
                console.error('Signup error:', error);
                showToast('Error saving account. Please try again.', 'error');
            }
        });
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const identifier = document.getElementById('loginIdentifier').value.trim();
            const password = document.getElementById('loginPassword').value;

            if (!identifier || !password) {
                showToast('Please fill in all required fields.', 'error');
                return;
            }

            try {
                const existingUsers = JSON.parse(localStorage.getItem('mpa_users')) || [];
                const validUser = existingUsers.find(u => 
                    (u.username === identifier || u.email === identifier) && u.password === password
                );

                if (validUser) {
                    localStorage.setItem('mpa_current_user', JSON.stringify(validUser));
                    showToast('Login successful! Redirecting...', 'success');
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);
                } else {
                    showToast('Invalid username/email or password.', 'error');
                }
            } catch (error) {
                console.error('Login error:', error);
                showToast('An error occurred during login. Please try again.', 'error');
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Clear user session from localStorage
            localStorage.removeItem('mpa_current_user');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('isLoggedIn');

            // Redirect to login page
            window.location.href = 'login.html';
        });
    }
});