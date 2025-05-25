// src/components/OrganizerAvailability.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { fetchApi } from '../utils/api'; // Assuming you have this utility
import styles from './OrganizerAvailability.module.css'; // Create this CSS Module

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const initialWorkingHours = () => daysOfWeek.map(day => ({
    dayOfWeek: day,
    startTime: (day === 'Sunday' || day === 'Saturday') ? "00:00" : "09:00",
    endTime: (day === 'Sunday' || day === 'Saturday') ? "00:00" : "17:00",
    isOff: (day === 'Sunday' || day === 'Saturday')
}));

function OrganizerAvailability() {
    const [workingHours, setWorkingHours] = useState(initialWorkingHours());
    const [absences, setAbsences] = useState([]);
    const [newAbsence, setNewAbsence] = useState({ startDate: '', endDate: '', reason: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const fetchAvailability = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await fetchApi('/api/organizer/availability');
            if (response.status === 'success' && response.data) {
                // Ensure workingHours has an entry for every day of the week
                const fetchedHours = response.data.workingHours || [];
                const completeWorkingHours = daysOfWeek.map(dayName => {
                    const foundDay = fetchedHours.find(fh => fh.dayOfWeek === dayName);
                    if (foundDay) return foundDay;
                    // Provide default if missing (though backend model default should handle this)
                    return { 
                        dayOfWeek: dayName, 
                        startTime: (dayName === 'Sunday' || dayName === 'Saturday') ? "00:00" : "09:00",
                        endTime: (dayName === 'Sunday' || dayName === 'Saturday') ? "00:00" : "17:00",
                        isOff: (dayName === 'Sunday' || dayName === 'Saturday')
                    };
                });
                setWorkingHours(completeWorkingHours);
                setAbsences(response.data.absences || []);
            } else {
                throw new Error(response.message || 'Failed to fetch availability data.');
            }
        } catch (err) {
            setError(err.message);
            console.error("Fetch availability error:", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAvailability();
    }, [fetchAvailability]);

    const handleWorkingHoursChange = (index, field, value) => {
        const updatedHours = [...workingHours];
        if (field === 'isOff') {
            updatedHours[index][field] = value;
            if (value) { // If marked as off, clear times or set to a default "off" representation
                updatedHours[index]['startTime'] = "00:00";
                updatedHours[index]['endTime'] = "00:00";
            }
        } else {
            updatedHours[index][field] = value;
        }
        setWorkingHours(updatedHours);
    };

    const handleAbsenceChange = (e) => {
        setNewAbsence({ ...newAbsence, [e.target.name]: e.target.value });
    };

    const handleAddAbsence = () => {
        if (!newAbsence.startDate || !newAbsence.endDate) {
            setError('Start date and end date for absence are required.');
            return;
        }
        if (new Date(newAbsence.endDate) < new Date(newAbsence.startDate)) {
            setError('End date cannot be before start date.');
            return;
        }
        setAbsences([...absences, { ...newAbsence, id: Date.now() }]); // Temporary ID for list key
        setNewAbsence({ startDate: '', endDate: '', reason: '' });
        setError('');
    };

    const handleRemoveAbsence = (indexToRemove) => {
        setAbsences(absences.filter((_, index) => index !== indexToRemove));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccessMessage('');
        try {
            const payload = {
                workingHours,
                absences: absences.map(({id, ...rest}) => rest) // Remove temporary ID before sending
            };
            const response = await fetchApi('/api/organizer/availability', {
                method: 'PATCH',
                body: JSON.stringify(payload),
            });
            if (response.status === 'success') {
                setSuccessMessage(response.message || 'Availability updated successfully!');
                if(response.data){ // Update local state with potentially processed data from backend
                    setWorkingHours(response.data.workingHours || workingHours);
                    setAbsences(response.data.absences || absences);
                }
            } else {
                throw new Error(response.message || 'Failed to update availability.');
            }
        } catch (err) {
            setError(err.message);
            console.error("Update availability error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && !workingHours.length && !absences.length) { // Show loading only on initial fetch
        return <div className={styles.loading}>Loading availability settings...</div>;
    }

    return (
        <div className={styles.availabilityPage}>
            <h1 className={styles.pageTitle}>Manage Your Availability</h1>
            {error && <p className={styles.errorMessage}>{error}</p>}
            {successMessage && <p className={styles.successMessage}>{successMessage}</p>}

            <form onSubmit={handleSubmit} className={styles.availabilityForm}>
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Weekly Working Hours</h2>
                    <div className={styles.workingHoursGrid}>
                        {workingHours.map((day, index) => (
                            <div key={day.dayOfWeek} className={styles.dayCard}>
                                <h3 className={styles.dayName}>{day.dayOfWeek}</h3>
                                <div className={styles.formGroup}>
                                    <label htmlFor={`isOff-${index}`}>Day Off</label>
                                    <input
                                        type="checkbox"
                                        id={`isOff-${index}`}
                                        checked={day.isOff}
                                        onChange={(e) => handleWorkingHoursChange(index, 'isOff', e.target.checked)}
                                    />
                                </div>
                                {!day.isOff && (
                                    <>
                                        <div className={styles.formGroup}>
                                            <label htmlFor={`startTime-${index}`}>Start Time</label>
                                            <input
                                                type="time"
                                                id={`startTime-${index}`}
                                                value={day.startTime || "09:00"}
                                                onChange={(e) => handleWorkingHoursChange(index, 'startTime', e.target.value)}
                                                className={styles.timeInput}
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label htmlFor={`endTime-${index}`}>End Time</label>
                                            <input
                                                type="time"
                                                id={`endTime-${index}`}
                                                value={day.endTime || "17:00"}
                                                onChange={(e) => handleWorkingHoursChange(index, 'endTime', e.target.value)}
                                                className={styles.timeInput}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Absences / Days Off</h2>
                    <div className={styles.absencesForm}>
                        <div className={styles.formRow}>
                             <div className={styles.formGroup}>
                                <label htmlFor="absenceStartDate">Start Date</label>
                                <input type="date" id="absenceStartDate" name="startDate" value={newAbsence.startDate} onChange={handleAbsenceChange} className={styles.dateInput}/>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="absenceEndDate">End Date</label>
                                <input type="date" id="absenceEndDate" name="endDate" value={newAbsence.endDate} onChange={handleAbsenceChange} className={styles.dateInput}/>
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="absenceReason">Reason (Optional)</label>
                            <input type="text" id="absenceReason" name="reason" value={newAbsence.reason} onChange={handleAbsenceChange} placeholder="e.g., Vacation, Conference" className={styles.reasonInput}/>
                        </div>
                        <button type="button" onClick={handleAddAbsence} className={styles.addButton}>Add Absence</button>
                    </div>
                    {absences.length > 0 && (
                        <div className={styles.absencesList}>
                            <h3 className={styles.subSectionTitle}>Scheduled Absences</h3>
                            <ul>
                                {absences.map((absence, index) => (
                                    <li key={absence.id || index}>
                                        <span>
                                            {new Date(absence.startDate).toLocaleDateString()} - {new Date(absence.endDate).toLocaleDateString()}
                                            {absence.reason && ` (${absence.reason})`}
                                        </span>
                                        <button type="button" onClick={() => handleRemoveAbsence(index)} className={styles.removeButton}>Remove</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </section>

                <button type="submit" className={styles.submitButton} disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Availability Settings'}
                </button>
            </form>
        </div>
    );
}

export default OrganizerAvailability;