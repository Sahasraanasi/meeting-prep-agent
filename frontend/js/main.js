document.addEventListener('DOMContentLoaded', () => {
    const profileForm = document.getElementById('profileForm');
    
    if (profileForm) {
        // Load existing profile data if available
        const savedUser = JSON.parse(localStorage.getItem('meetingAgentUser'));
        if (savedUser) {
            document.getElementById('name').value = savedUser.name || '';
            document.getElementById('email').value = savedUser.email || '';
            document.getElementById('company').value = savedUser.company || '';
            document.getElementById('role').value = savedUser.role || '';
        }

        // Handle form submission
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const userData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                company: document.getElementById('company').value,
                role: document.getElementById('role').value
            };

            // Save to localStorage matching the final data structure
            localStorage.setItem('meetingAgentUser', JSON.stringify(userData));

            // Show success feedback
            const successMsg = document.getElementById('successMessage');
            successMsg.style.display = 'block';
            setTimeout(() => {
                successMsg.style.display = 'none';
            }, 3000);
        });
    }
});
// Contact Management Logic
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    const renderContacts = () => {
        const contactsList = document.getElementById('contactsList');
        const contacts = JSON.parse(localStorage.getItem('meetingAgentContacts')) || [];
        
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

    // Render initially on page load
    renderContacts();

    // Handle form submission
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newContact = {
            name: document.getElementById('contactName').value,
            company: document.getElementById('contactCompany').value,
            jobTitle: document.getElementById('contactJobTitle').value,
            email: document.getElementById('contactEmail').value,
            phone: document.getElementById('contactPhone').value
        };

        const contacts = JSON.parse(localStorage.getItem('meetingAgentContacts')) || [];
        contacts.push(newContact);
        localStorage.setItem('meetingAgentContacts', JSON.stringify(contacts));

        contactForm.reset();
        renderContacts();
    });
}
// Meeting Notes and Summary Logic
const meetingForm = document.getElementById('meetingForm');
if (meetingForm) {
    const contactSelect = document.getElementById('contactSelect');
    const generateSummaryBtn = document.getElementById('generateSummaryBtn');
    const meetingsList = document.getElementById('meetingsList');

    // Populate contacts dropdown from localStorage
    const contacts = JSON.parse(localStorage.getItem('meetingAgentContacts')) || [];
    contacts.forEach((contact, index) => {
        const option = document.createElement('option');
        option.value = contact.name; // or index/ID
        option.textContent = `${contact.name} (${contact.company} - ${contact.jobTitle})`;
        contactSelect.appendChild(option);
    });

    // Render saved meetings
    const renderMeetings = () => {
        const meetings = JSON.parse(localStorage.getItem('meetingAgentMeetings')) || [];
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

    // Client-side simulated summary generator (no backend required)
    generateSummaryBtn.addEventListener('click', () => {
        const notes = document.getElementById('meetingNotes').value;
        if (!notes.trim()) {
            alert('Please enter some meeting notes first!');
            return;
        }
        // Generate a clean structured summary simulation
        const summaryBox = document.getElementById('meetingSummary');
        summaryBox.value = `• Key Discussion: Reviewed project requirements and milestones based on notes.\n• Action Items identified from notes.\n• Next follow-up scheduled.`;
    });

    // Handle form submission
    meetingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newMeeting = {
            title: document.getElementById('meetingTitle').value,
            date: document.getElementById('meetingDate').value,
            contactId: contactSelect.value,
            notes: document.getElementById('meetingNotes').value,
            summary: document.getElementById('meetingSummary').value
        };

        const meetings = JSON.parse(localStorage.getItem('meetingAgentMeetings')) || [];
        meetings.push(newMeeting);
        localStorage.setItem('meetingAgentMeetings', JSON.stringify(meetings));

        meetingForm.reset();
        renderMeetings();
        alert('Meeting saved successfully!');
    });
}
// Meeting Brief & Tasks Logic
const selectMeetingBrief = document.getElementById('selectMeetingBrief');
if (selectMeetingBrief) {
    const briefOutputContainer = document.getElementById('briefOutputContainer');

    // Load saved meetings into dropdown
    const meetings = JSON.parse(localStorage.getItem('meetingAgentMeetings')) || [];
    const contacts = JSON.parse(localStorage.getItem('meetingAgentContacts')) || [];
    const user = JSON.parse(localStorage.getItem('meetingAgentUser')) || {};

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
            <div class="brief-box">
                <div class="brief-section">
                    <h3>Meeting Overview</h3>
                    <p><strong>Title:</strong> ${meeting.title}</p>
                    <p><strong>Date & Time:</strong> ${new Date(meeting.date).toLocaleString()}</p>
                </div>

                <div class="brief-section">
                    <h3>Organizer Profile</h3>
                    <p><strong>Name:</strong> ${user.name || 'Not set'} (${user.role || 'N/A'} at ${user.company || 'N/A'})</p>
                    <p><strong>Email:</strong> ${user.email || 'N/A'}</p>
                </div>

                <div class="brief-section">
                    <h3>Attendee / Contact Details</h3>
                    <p><strong>Name:</strong> ${meeting.contactId}</p>
                    <p><strong>Company:</strong> ${contact.company}</p>
                    <p><strong>Job Title:</strong> ${contact.jobTitle}</p>
                    <p><strong>Email:</strong> ${contact.email} | <strong>Phone:</strong> ${contact.phone}</p>
                </div>

                <div class="brief-section">
                    <h3>AI / Structured Summary</h3>
                    <p>${meeting.summary || 'No summary generated.'}</p>
                </div>

                <div class="brief-section">
                    <h3>Raw Notes</h3>
                    <p style="white-space: pre-wrap; background: #f8f9fa; padding: 1rem; border-radius: 4px;">${meeting.notes}</p>
                </div>
            </div>
        `;
    });
}