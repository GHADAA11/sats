/**
 * calendar.js
 * Renders the calendar and highlights attendance
 */

document.addEventListener('DOMContentLoaded', () => {
    const calendarGrid = document.getElementById('calendarGrid');
    // Header elements are now separate
    const monthLabel = document.getElementById('currentMonth');
    const yearLabel = document.getElementById('currentYear');
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');

    let currentDate = new Date(); // Start with current date
    const user = DataManager.getCurrentUser();

    // Modal elements
    const modal = document.getElementById('attendanceModal');
    const modalDate = document.getElementById('modalDate');
    const modalBody = document.getElementById('modalBody');
    const closeModal = document.querySelector('.close-modal');

    // Close modal handling
    if (closeModal) {
        closeModal.onclick = () => modal.style.display = "none";
    }
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    if (calendarGrid) {
        renderCalendar(currentDate);

        prevBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar(currentDate);
        });

        nextBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar(currentDate);
        });
    }

    function renderCalendar(date) {
        calendarGrid.innerHTML = '';
        const year = date.getFullYear();
        const month = date.getMonth();

        // Update Header
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        if (monthLabel) monthLabel.textContent = monthNames[month];

        if (yearLabel) {
            yearLabel.textContent = year;

            // Re-attach listener as we might re-render? 
            // Actually, yearLabel is static in DOM, so we can attach listener once?
            // But if we used innerHTML on parent it would be lost. 
            // Currently structure is static headers. 
            // Let's ensure we attach the click handler safely.
            yearLabel.onclick = function () {
                const currentVal = this.textContent;
                const input = document.createElement('input');
                input.type = 'number';
                input.value = currentVal;
                input.className = 'year-input';

                input.onblur = function () {
                    let newYear = parseInt(this.value);
                    if (isNaN(newYear) || newYear < 1900 || newYear > 2100) {
                        newYear = year; // Revert if invalid
                    }
                    currentDate.setFullYear(newYear);
                    renderCalendar(currentDate);
                    // No need to revert specifically, renderCalendar will update textContent
                };

                input.onkeydown = function (e) {
                    if (e.key === 'Enter') {
                        this.blur();
                    }
                };

                this.textContent = '';
                this.appendChild(input);
                input.focus();
            };
        }

        // Get user attendance for this month
        let attendanceRecords = [];
        if (user) {
            attendanceRecords = DataManager.getAttendance(user.studentId);
        }

        // Days of Week Headers
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        days.forEach(day => {
            const div = document.createElement('div');
            div.className = 'calendar-day-header';
            div.textContent = day;
            calendarGrid.appendChild(div);
        });

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Empty slots for previous month
        for (let i = 0; i < firstDay; i++) {
            const div = document.createElement('div');
            div.className = 'calendar-day empty';
            calendarGrid.appendChild(div);
        }

        // Days of current month
        for (let i = 1; i <= daysInMonth; i++) {
            const dayDate = new Date(year, month, i);
            const div = document.createElement('div');
            div.className = 'calendar-day';
            div.textContent = i;

            // Check if today
            if (dayDate.toDateString() === new Date().toDateString()) {
                div.classList.add('today');
            }

            // Check attendance for this specific day
            const dailyRecords = attendanceRecords.filter(r =>
                new Date(r.timestamp).toDateString() === dayDate.toDateString()
            );

            if (dailyRecords.length > 0) {
                div.classList.add('has-attendance');
                div.title = 'Click to view details';
            }

            // Click Handler
            div.addEventListener('click', () => {
                showDayDetails(dayDate, dailyRecords);
            });

            calendarGrid.appendChild(div);
        }
    }

    function showDayDetails(date, records) {
        modalDate.textContent = date.toDateString();
        modalBody.innerHTML = '';

        if (records.length === 0) {
            modalBody.innerHTML = '<div class="no-sessions">No attendance records for this day.</div>';
        } else {
            records.forEach(record => {
                // Determine time
                const recordDate = new Date(record.timestamp);
                const timeString = recordDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                const item = document.createElement('div');
                item.className = 'session-item';
                item.innerHTML = `
                    <div style="font-weight: bold; margin-bottom: 0.25rem;">${record.classCode}</div>
                    <div style="font-size: 0.9rem; color: #666;">
                        <span style="display: inline-block; width: 20px;">🕒</span> ${timeString}
                    </div>
                `;
                modalBody.appendChild(item);
            });
        }

        modal.style.display = "block";
    }
});
