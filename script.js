document.addEventListener('DOMContentLoaded', () => {
    const sessionForm = document.getElementById('sessionForm');
    const sessionTable = document.getElementById('sessionTable').getElementsByTagName('tbody')[0];
    const sessionEnded = document.getElementById('sessionEnded');
    const sessionCanceled = document.getElementById('sessionCanceled');
    const notificationSound = document.getElementById('notificationSound');
    let sessions = JSON.parse(localStorage.getItem('sessions')) || [];

    sessionForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const sessionType = document.getElementById('sessionType').value;
        const sessionName = document.getElementById('sessionName').value;
        const minutes = document.getElementById('minutes').value;
        const reserverName = document.getElementById('reserverName').value;

    

        const endTime = Date.now() + minutes * 60000;
        const session = { sessionType, sessionName, minutes, reserverName, endTime, status: 'active' };

        sessions.push(session);
        saveSessions();

        addSessionRow(session);
        sessionForm.reset();
    });

    function isSessionBooked(sessionName) {
        return sessions.some(session => session.sessionName === sessionName && session.status === 'active');
    }

    function saveSessions() {
        sessions.sort((a, b) => a.endTime - b.endTime);
        localStorage.setItem('sessions', JSON.stringify(sessions));
    }

    function addSessionRow(session) {
        const row = sessionTable.insertRow();
        row.insertCell(0).innerText = session.sessionType;
        row.insertCell(1).innerText = session.sessionName;
        row.insertCell(2).innerText = session.minutes;
        row.insertCell(3).innerText = session.reserverName;
        const timeCell = row.insertCell(4);
        const actionCell = row.insertCell(5);

        const extendButton = document.createElement('button');
        extendButton.innerText = 'تمديد الجلسة';
        extendButton.classList.add('btn');
        extendButton.onclick = () => extendSession(session.sessionName);
        actionCell.appendChild(extendButton);

        const cancelButton = document.createElement('button');
        cancelButton.innerText = 'إلغاء الجلسة';
        cancelButton.classList.add('btn');
        cancelButton.onclick = () => cancelSession(session.sessionName);
        actionCell.appendChild(cancelButton);

        updateCountdown(session, timeCell, row);
    }

    function updateCountdown(session, timeCell, row) {
        const interval = setInterval(() => {
            const now = Date.now();
            const remaining = session.endTime - now;
            if (remaining <= 0) {
                clearInterval(interval);
                timeCell.innerText = 'الوقت انتهى';
                session.status = 'ended';
                saveSessions();
                alert(`الجلسة ${session.sessionName} انتهى وقتها`);
                notificationSound.play();
                speakMessage(`الجلسة ${session.sessionName} انتهى وقتها`);
                addEndedSession(session);
                row.remove();
            } else {
                const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
                timeCell.innerText = `${minutes} دقيقة ${seconds} ثانية`;
            }
        }, 1000);
    }

    function extendSession(sessionName) {
        const session = sessions.find(s => s.sessionName === sessionName && s.status === 'active');
        const additionalMinutes = prompt('أدخل عدد الدقائق الإضافية:');
        session.endTime += additionalMinutes * 60000;
        saveSessions();
    }

    function cancelSession(sessionName) {
        const session = sessions.find(s => s.sessionName === sessionName && s.status === 'active');
        session.status = 'canceled';
        saveSessions();
        addCanceledSession(session);
    }

    function addEndedSession(session) {
        const div = document.createElement('div');
        div.classList.add('session-ended');
        div.innerText = `الجلسة ${session.sessionName} (${session.sessionType}) انتهت بتاريخ ${new Date(session.endTime).toLocaleString()}`;
        sessionEnded.appendChild(div);
    }

    function addCanceledSession(session) {
        const div = document.createElement('div');
        div.classList.add('session-canceled');
        div.innerText = `الجلسة ${session.sessionName} (${session.sessionType}) ألغيت`;
        sessionCanceled.appendChild(div);
    }

    function speakMessage(message) {
        const msg = new SpeechSynthesisUtterance(message);
        msg.lang = 'ar-SA';
        window.speechSynthesis.speak(msg);
    }
        if (isSessionBooked(sessionName)) {
            alert(`الجلسة ${sessionName} محجوزة حاليًا ولا يمكن حجزها مرة أخرى حتى ينتهي وقتها.`);
            return;
        }

    function loadSessions() {
        sessions.forEach(session => {
            if (session.status === 'active') {
                addSessionRow(session);
            } else if (session.status === 'ended') {
                addEndedSession(session);
            } else if (session.status === 'canceled') {
                addCanceledSession(session);
            }
        });
    }

    loadSessions();
});
