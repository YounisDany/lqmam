document.addEventListener('DOMContentLoaded', () => {
    const sessionForm = document.getElementById('sessionForm');
    const sessionTable = document.getElementById('sessionTable').getElementsByTagName('tbody')[0];
    const notificationSound = document.getElementById('notificationSound');

    sessionForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const sessionType = document.getElementById('sessionType').value;
        const sessionName = document.getElementById('sessionName').value;
        const minutes = document.getElementById('minutes').value;
        const reserverName = document.getElementById('reserverName').value;

        const row = sessionTable.insertRow();
        row.insertCell(0).innerText = sessionType;
        row.insertCell(1).innerText = sessionName;
        row.insertCell(2).innerText = minutes;
        row.insertCell(3).innerText = reserverName;

        saveSession(sessionType, sessionName, minutes, reserverName);
        setTimeout(() => {
            const message = `الجلسة ${sessionName} انتهى وقتها`;
            alert(message);
            notificationSound.play();
            speakMessage(message);
        }, minutes * 60000);

        sessionForm.reset();
    });

    function saveSession(sessionType, sessionName, minutes, reserverName) {
        const sessions = JSON.parse(localStorage.getItem('sessions')) || [];
        sessions.push({ sessionType, sessionName, minutes, reserverName });
        localStorage.setItem('sessions', JSON.stringify(sessions));
    }

    function loadSessions() {
        const sessions = JSON.parse(localStorage.getItem('sessions')) || [];
        sessions.forEach(session => {
            const row = sessionTable.insertRow();
            row.insertCell(0).innerText = session.sessionType;
            row.insertCell(1).innerText = session.sessionName;
            row.insertCell(2).innerText = session.minutes;
            row.insertCell(3).innerText = session.reserverName;
        });
    }

    function speakMessage(message) {
        const msg = new SpeechSynthesisUtterance(message);
        msg.lang = 'ar-SA';
        window.speechSynthesis.speak(msg);
    }

    loadSessions();
});
