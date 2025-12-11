/**
 * attendance.js
 * Handle check-in and history display
 */

document.addEventListener('DOMContentLoaded', () => {
    const checkinForm = document.getElementById('checkinForm');
    const historyTableBody = document.getElementById('historyTableBody');
    const user = DataManager.getCurrentUser();

    // Check-in Page Logic
    if (checkinForm) {
        if (!user) {
            document.getElementById('authCheck').style.display = 'block';
            checkinForm.style.opacity = '0.5';
            checkinForm.querySelectorAll('input, button').forEach(el => el.disabled = true);
        }

        checkinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!user) return; // Should be disabled, but double check

            const classCode = document.getElementById('classCode').value;
            const securityAnswer = document.getElementById('securityAnswer').value;

            // In a real app, we would validate the Class Code against a database of active classes
            // For this frontend demo, we accept any code.

            const record = {
                studentId: user.studentId,
                studentName: user.name,
                classCode: classCode,
                securityAnswer: securityAnswer,
                timestamp: new Date().toISOString(),
                status: 'Present'
            };

            const result = DataManager.saveAttendance(record);

            if (result.success) {
                showMessage('Check-in successful!', 'success');
                checkinForm.reset();
            } else {
                showMessage(result.message, 'error');
            }
        });
    }

    // History Page Logic
    if (historyTableBody) {
        if (!user) {
            historyTableBody.innerHTML = '<tr><td colspan="4" class="text-center">Please log in to view history.</td></tr>';
            return;
        }

        const records = DataManager.getAttendance(user.studentId);

        if (records.length === 0) {
            historyTableBody.innerHTML = '<tr><td colspan="4" class="text-center">No attendance records found.</td></tr>';
        } else {
            // Sort by new
            records.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            historyTableBody.innerHTML = records.map(record => {
                const date = new Date(record.timestamp);
                return `
                    <tr>
                        <td>${date.toLocaleDateString()}</td>
                        <td>${date.toLocaleTimeString()}</td>
                        <td>${record.classCode}</td>
                        <td><span class="badge-success">${record.status}</span></td>
                    </tr>
                `;
            }).join('');
        }
    }

    function showMessage(text, type) {
        const messageDiv = document.getElementById('message');
        if (messageDiv) {
            messageDiv.textContent = text;
            messageDiv.className = type === 'error' ? 'mb-1 text-center text-danger' : 'mb-1 text-center text-success';
        }
    }
});
