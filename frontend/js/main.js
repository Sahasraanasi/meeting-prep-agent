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
 * Currently uses localStorage. 
 * NOTE FOR BACKEND INTEGRATION: Replace these methods with fetch() calls to Express API endpoints.
 */
const DataService = {
    getUser: () => JSON.parse(localStorage.getItem('meetingAgentUser')) || {},
    saveUser: (userData) => {
        localStorage.setItem('meetingAgentUser', JSON.stringify(userData));
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

document.addEventListener('DOMContentLoaded', () => {

    /* ================= 1. PROFILE PAGE LOGIC ================= */
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        const user = DataService.getUser();
        if (user.name) {
            document.getElementById('name').value = user.name || '';
            document.getElementById('email').value = user.email || '';
            document.getElementById('company').value = user.company || '';
            document.getElementById('role').value = user.role || '';
        }

        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value.trim();

            if (!isValidEmail(email)) {
                showToast('Please enter a valid email address.', 'error');
                return;
            }

            const userData = {
                name: document.getElementById('name').value.trim(),
                email: email,
                company: document.getElementById('company').value.trim(),
                role: document.getElementById('role').value.trim()
            };

            DataService.saveUser(userData).then(() => {
                showToast('Profile saved successfully!');
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
            contacts.forEach((contact) => {
                const card = document.createElement('div');
                card.className = 'contact-card';
                card.innerHTML = `
                    <h4>${contact.name} (${contact.jobTitle})</h4>
                    <p><strong>Company:</strong> ${contact.company}</p>
                    <p><strong>Email:</strong> ${contact.email}</p>
                    <p><strong>Phone:</strong> ${contact.phone}</p>
                `;
                contactsList.appendChild(card);
            });
        };

        renderContacts();

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('contactEmail').value.trim();

            if (!isValidEmail(email)) {
                showToast('Please enter a valid email address for the contact.', 'error');
                return;
            }

            const newContact = {
                name: document.getElementById('contactName').value.trim(),
                company: document.getElementById('contactCompany').value.trim(),
                jobTitle: document.getElementById('contactJobTitle').value.trim(),
                email: email,
                phone: document.getElementById('contactPhone').value.trim()
            };

            DataService.addContact(newContact).then(() => {
                contactForm.reset();
                renderContacts();
                showToast('Contact added successfully!');
            });
        });
    }

    /* ================= 3. MEETING NOTES PAGE LOGIC ================= */
    const meetingForm = document.getElementById('meetingForm');
    if (meetingForm) {
        const contactSelect = document.getElementById('contactSelect');
        const generateSummaryBtn = document.getElementById('generateSummaryBtn');
        const meetingsList = document.getElementById('meetingsList');

        // Populate contacts dropdown
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
            meetings.forEach((meeting) => {
                const card = document.createElement('div');
                card.className = 'meeting-card';
                card.innerHTML = `
                    <h4>${meeting.title}</h4>
                    <p><strong>Date:</strong> ${new Date(meeting.date).toLocaleString()}</p>
                    <p><strong>Contact:</strong> ${meeting.contactId}</p>
                    <p><strong>Notes:</strong> ${meeting.notes}</p>
                    <p><strong>Summary:</strong> ${meeting.summary || 'No summary provided.'}</p>
                `;
                meetingsList.appendChild(card);
            });
        };

        renderMeetings();

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

        meetingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const newMeeting = {
                title: document.getElementById('meetingTitle').value.trim(),
                date: document.getElementById('meetingDate').value,
                contactId: contactSelect.value,
                notes: document.getElementById('meetingNotes').value.trim(),
                summary: document.getElementById('meetingSummary').value.trim()
            };

            DataService.addMeeting(newMeeting).then(() => {
                meetingForm.reset();
                renderMeetings();
                showToast('Meeting saved successfully!');
            });
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
});