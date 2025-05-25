// src/components/MyBookings.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fetchApi } from '../utils/api';
import styles from './MyBookings.module.css'; // Import the CSS module

// Optional: If you install react-icons
// import { FaCalendarCheck, FaClock, FaTimesCircle, FaExclamationCircle, FaRedoAlt, FaPlusCircle } from 'react-icons/fa';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const loadMyBookings = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const responseData = await fetchApi('/api/bookings/my-bookings');
      if (responseData.status === 'success' && responseData.data && Array.isArray(responseData.data.bookings)) {
        setBookings(responseData.data.bookings);
      } else {
        throw new Error(responseData.message || 'Unexpected response when fetching bookings.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to fetch your bookings. Please ensure you are logged in and try again.');
      console.error("Error fetching user bookings:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMyBookings();
  }, [loadMyBookings]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }
    setErrorMessage('');
    try {
      const responseData = await fetchApi(`/api/bookings/my-bookings/${bookingId}/cancel`, { method: 'PATCH' });
      if (responseData.status === 'success') {
        alert('Booking cancelled successfully.');
        loadMyBookings();
      } else {
        throw new Error(responseData.message || 'Failed to cancel booking.');
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
      setErrorMessage(err.message);
    }
  };

  if (isLoading) {
    return <div className={styles.loadingState}> {/* <FaClock className={styles.icon} /> */} Loading your bookings...</div>;
  }

  if (errorMessage) {
    return (
      <div className={styles.errorStateContainer}>
        {/* <FaExclamationCircle size="2em" style={{ marginBottom: '0.5rem', color: '#dc3545' }}/> */}
        <p className={styles.errorMessageText}>Error: {errorMessage}</p>
        <button onClick={loadMyBookings} className={styles.retryButton}>
          {/* <FaRedoAlt className={styles.icon} /> */} Retry
        </button>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className={styles.emptyStateContainer}>
        <h2 className={styles.emptyStateTitle}>No Bookings Yet</h2>
        <p className={styles.emptyStateText}>You currently have no consultations scheduled.</p>
        <Link to="/book-slot" className={styles.bookNowButton}> {/* Assuming /book-slot is your booking page route */}
          {/* <FaPlusCircle className={styles.icon} /> */} Book a Consultation
        </Link>
      </div>
    );
  }

  const getStatusClassName = (status) => {
    return styles[`status${status.replace(/_/g, '-')}`] || '';
  };

  return (
    <div className={styles.myBookingsPage}>
      <h1 className={styles.pageTitle}>My Bookings</h1>
      <div className={styles.bookingsGrid}>
        {bookings.map((booking) => (
          <div key={booking._id} className={styles.bookingCard}>
            <div className={styles.cardHeader}>
              <h3>{booking.serviceType}</h3>
              <span className={`${styles.statusBadge} ${getStatusClassName(booking.status)}`}>
                {/* {booking.status === 'confirmed' && <FaCalendarCheck className={styles.icon} />} */}
                {booking.status.replace(/_/g, ' ').toUpperCase()}
              </span>
            </div>
            <div className={styles.cardBody}>
              <p><strong className={styles.strong}>Organizer:</strong> {booking.organizer ? `${booking.organizer.firstName} ${booking.organizer.lastName}` : 'N/A'}</p>
              <p><strong className={styles.strong}>Date:</strong> {new Date(booking.startTime).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p><strong className={styles.strong}>Time:</strong> {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              {booking.notes && <p><strong className={styles.strong}>Notes:</strong> {booking.notes}</p>}
            </div>
            {(booking.status === 'confirmed' || booking.status === 'pending_payment') && (
              <div className={styles.cardFooter}>
                <button
                  onClick={() => handleCancelBooking(booking._id)}
                  className={styles.cancelButton}
                >
                  {/* <FaTimesCircle className={styles.icon} /> */} Cancel Booking
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyBookings;