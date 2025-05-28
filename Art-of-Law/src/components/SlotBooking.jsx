// src/components/SlotBooking.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchApi } from '../utils/api'; // Ensure this path is correct
import styles from './SlotBooking.module.css'; // Ensure you have this CSS module

function SlotBooking() {
  const [organizers, setOrganizers] = useState([]);
  const [selectedOrganizer, setSelectedOrganizer] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Default to tomorrow
    return today.toISOString().split('T')[0];
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [serviceType, setServiceType] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isLoadingBooking, setIsLoadingBooking] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // IMPORTANT: Replace these placeholder IDs with actual MongoDB _id values
  // for Pawan and Kamal after they have registered and their roles are set to 'organizer'.
  const organizerProfiles = [
    { _id: 'REPLACE_WITH_PAWAN_USER_ID', name: 'Advocate Pawan SS' },
    { _id: 'REPLACE_WITH_KAMAL_USER_ID', name: 'Advocate Kamal Adithya K' },
    // You can add yourself here too if your role is 'organizer' and you want to be bookable
    { _id: '6830670a1e6a1d9167ee279a', name: 'Durgadutt' },
  ];

  useEffect(() => {
    // Filter out any organizers with placeholder IDs to prevent errors
    const validOrganizers = organizerProfiles.filter(org => 
        org._id && !org._id.includes('REPLACE_WITH_')
    );
    setOrganizers(validOrganizers);
    if (validOrganizers.length > 0) {
      // setSelectedOrganizer(validOrganizers[0]._id); // Optionally pre-select the first valid organizer
    } else if (organizerProfiles.length > 0) {
        // If only placeholders exist, prompt user to update them.
        setError("Organizer IDs need to be updated in SlotBooking.jsx. Please see component comments.");
    }
  }, []);

  const handleFetchAvailableSlots = useCallback(async () => {
    if (!selectedOrganizer || !selectedDate || !serviceType) {
      setAvailableSlots([]);
      setError('Please select an organizer, service type, and date to see available slots.');
      return;
    }
    setIsLoadingSlots(true);
    setError('');
    setAvailableSlots([]);
    setSelectedSlot(null);
    try {
      const response = await fetchApi(`/api/bookings/available-slots?organizerId=${selectedOrganizer}&date=${selectedDate}&duration=60`); // Assuming 60 min slots
      if (response.status === 'success') {
        setAvailableSlots(response.data.availableSlots);
        if (response.data.availableSlots.length === 0) {
          setError('No slots available for the selected criteria. Please try another date or organizer.');
        }
      } else {
        throw new Error(response.message || 'Failed to fetch slots.');
      }
    } catch (err) {
      setError(err.message);
      console.error("Fetch available slots error:", err);
    } finally {
      setIsLoadingSlots(false);
    }
  }, [selectedOrganizer, selectedDate, serviceType]);

  const handleBookSlot = async (e) => {
    e.preventDefault();
    if (!selectedSlot || !serviceType || !selectedOrganizer) {
      setError('Please select an organizer, date, time slot, and service type before booking.');
      return;
    }
    setIsLoadingBooking(true);
    setError('');
    setSuccessMessage('');
    try {
      const bookingPayload = {
        organizer: selectedOrganizer,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        serviceType,
        notes,
      };
      const response = await fetchApi('/api/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingPayload),
      });
      if (response.status === 'success') {
        const organizerName = organizers.find(o => o._id === selectedOrganizer)?.name || 'the selected organizer';
        setSuccessMessage(`Booking confirmed for ${new Date(selectedSlot.startTime).toLocaleString()} with ${organizerName}! Redirecting to My Bookings...`);
        setSelectedSlot(null);
        setNotes('');
        setTimeout(() => {
          navigate('/my-bookings');
        }, 3000);
      } else {
        throw new Error(response.message || 'Failed to create booking.');
      }
    } catch (err) {
      setError(err.message);
      console.error("Create booking error:", err);
    } finally {
      setIsLoadingBooking(false);
    }
  };
  
  const consultationServices = [
    { name: "Basic Consultation" },
    { name: "Standard Consultation" },
    { name: "Comprehensive Consultation" },
  ];

  return (
    <div className={styles.slotBookingPage}>
      <h1 className={styles.pageTitle}>Book a Consultation Slot</h1>
      {error && <p className={styles.errorMessage}>{error}</p>}
      {successMessage && <p className={styles.successMessage}>{successMessage}</p>}

      <form onSubmit={handleBookSlot} className={styles.bookingForm}>
        {/* --- ORGANIZER SELECTION --- */}
        <div className={styles.formGroup}>
          <label htmlFor="organizer">Select Organizer:</label>
          <select id="organizer" value={selectedOrganizer} onChange={(e) => {setSelectedOrganizer(e.target.value); setAvailableSlots([]); setSelectedSlot(null);}} required>
            <option value="">-- Select Organizer --</option>
            {organizers.map(org => (
              <option key={org._id} value={org._id}>{org.name}</option>
            ))}
          </select>
        </div>

        {/* --- SERVICE TYPE SELECTION --- */}
        <div className={styles.formGroup}>
            <label htmlFor="serviceType">Select Service Type:</label>
            <select id="serviceType" value={serviceType} onChange={(e) => {setServiceType(e.target.value); setAvailableSlots([]); setSelectedSlot(null);}} required>
                <option value="">-- Select Service --</option>
                {consultationServices.map(service => (
                    <option key={service.name} value={service.name}>{service.name}</option>
                ))}
            </select>
        </div>

        {/* --- DATE SELECTION --- */}
        <div className={styles.formGroup}>
          <label htmlFor="date">Select Date:</label>
          <input type="date" id="date" value={selectedDate} min={new Date().toISOString().split('T')[0]} onChange={(e) => {setSelectedDate(e.target.value); setAvailableSlots([]); setSelectedSlot(null);}} required />
        </div>
        
        <button type="button" onClick={handleFetchAvailableSlots} disabled={isLoadingSlots || !selectedOrganizer || !selectedDate || !serviceType} className={styles.actionButton}>
          {isLoadingSlots ? 'Fetching Slots...' : 'Show Available Slots'}
        </button>

        {/* --- AVAILABLE SLOTS DISPLAY --- */}
        {!isLoadingSlots && availableSlots.length > 0 && (
          <div className={styles.slotsContainer}>
            <h3>Available Slots for {new Date(selectedDate + 'T00:00:00').toLocaleDateString()}:</h3> {/* Ensure date is parsed correctly for display */}
            <div className={styles.slotsGrid}>
              {availableSlots.map((slot, index) => (
                <button
                  key={index}
                  type="button"
                  className={`${styles.slotButton} ${selectedSlot?.startTime === slot.startTime ? styles.selectedSlot : ''}`}
                  onClick={() => setSelectedSlot(slot)}
                >
                  {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(slot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* --- BOOKING CONFIRMATION SECTION --- */}
        {selectedSlot && (
          <div className={styles.selectedSlotInfo}>
            <h4>You selected: {new Date(selectedSlot.startTime).toLocaleString()}</h4>
            <div className={styles.formGroup}>
              <label htmlFor="notes">Additional Notes (Optional):</label>
              <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows="3" className={styles.textArea}></textarea>
            </div>
            <button type="submit" disabled={isLoadingBooking} className={styles.submitBookingButton}>
              {isLoadingBooking ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default SlotBooking;