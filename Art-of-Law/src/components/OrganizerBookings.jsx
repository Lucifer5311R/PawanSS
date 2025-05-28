// src/components/OrganizerBookings.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { fetchApi } from '../utils/api';
import styles from './OrganizerBookings.module.css';

const AVAILABLE_BOOKING_STATUSES = ['pending_payment', 'confirmed', 'cancelled_by_user', 'cancelled_by_organizer', 'completed'];
const SORT_OPTIONS = [
    { label: 'Date (Asc)', value: 'startTime_asc' },
    { label: 'Date (Desc)', value: 'startTime_desc' },
    { label: 'Client Name (Asc)', value: 'client.firstName_asc' }, // Note: Sorting on populated fields requires backend setup or client-side sort after fetch
    { label: 'Client Name (Desc)', value: 'client.firstName_desc'},
    { label: 'Status (Asc)', value: 'status_asc' },
    { label: 'Status (Desc)', value: 'status_desc' },
];


function OrganizerBookings() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [filterDate, setFilterDate] = useState(() => {
    // Optional: default to today's date
    // const today = new Date();
    // return today.toISOString().split('T')[0];
    return ''; // Default to empty
  });
  const [filterStatus, setFilterStatus] = useState('');
  const [sortOption, setSortOption] = useState('startTime_asc'); // Default sort

  const loadOrganizerBookings = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const queryParams = new URLSearchParams();
      if (filterDate) queryParams.append('date', filterDate);
      if (filterStatus) queryParams.append('status', filterStatus);
      
      const [sortBy, sortOrder] = sortOption.split('_');
      if (sortBy) queryParams.append('sort_by', sortBy);
      if (sortOrder) queryParams.append('sort_order', sortOrder);

      const endpoint = `/api/bookings/organizer-bookings?${queryParams.toString()}`;
      const responseData = await fetchApi(endpoint);

      if (responseData.status === 'success' && responseData.data && Array.isArray(responseData.data.bookings)) {
        setBookings(responseData.data.bookings);
      } else {
        throw new Error(responseData.message || 'Unexpected response when fetching bookings.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to fetch bookings. Ensure you are logged in as an organizer/admin.');
      console.error("Error fetching organizer bookings:", err);
    } finally {
      setIsLoading(false);
    }
  }, [filterDate, filterStatus, sortOption]);

  useEffect(() => {
    loadOrganizerBookings();
  }, [loadOrganizerBookings]);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    setErrorMessage('');
    try {
      const responseData = await fetchApi(`/api/bookings/organizer-bookings/${bookingId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      if (responseData.status === 'success') {
        alert(`Booking status updated to ${newStatus.replace(/_/g, ' ').toUpperCase()}.`);
        loadOrganizerBookings(); 
      } else {
        throw new Error(responseData.message || 'Failed to update status.');
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
      setErrorMessage(err.message);
    }
  };
  
  const getStatusClassName = (status) => {
    // Simplified from your original - ensure CSS module keys match this pattern
    return styles[`status${status.replace(/_/g, '')}`] || // e.g., statusConfirmed, statusPendingpayment
           styles[`status${status.replace(/_([a-z])/g, (g) => g[1].toUpperCase())}`] || // e.g. statusCancelledByUser
           '';
  };


  if (isLoading) {
    return <div className={styles.loadingState}>Loading organizer bookings...</div>;
  }

  if (errorMessage && !isLoading) { // Show error only if not loading
    return (
      <div className={styles.errorStateContainer}>
        <p className={styles.errorMessageText}>Error: {errorMessage}</p>
        <button onClick={loadOrganizerBookings} className={styles.retryButton}>Retry</button>
      </div>
    );
  }

  return (
    <div className={styles.organizerDashboardPage}>
      <h1 className={styles.pageTitle}>Organizer Dashboard</h1>

      <div className={styles.controlsBar}>
        <div>
            <label htmlFor="filterDate">Date:</label>
            <input 
                type="date" 
                id="filterDate" 
                value={filterDate}
                onChange={e => setFilterDate(e.target.value)} 
                className={styles.filterInput}
            />
        </div>
        <div>
            <label htmlFor="filterStatus">Status:</label>
            <select 
                id="filterStatus" 
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className={styles.filterSelect}
            >
            <option value="">All Statuses</option>
            {AVAILABLE_BOOKING_STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ').toUpperCase()}</option>)}
            </select>
        </div>
        <div>
            <label htmlFor="sortOption">Sort By:</label>
            <select
                id="sortOption"
                value={sortOption}
                onChange={e => setSortOption(e.target.value)}
                className={styles.filterSelect}
            >
                {SORT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
        {/* The useEffect hook with loadOrganizerBookings as a dependency 
            will trigger reload when filterDate, filterStatus, or sortOption changes.
            If you prefer a manual button:
        <button onClick={loadOrganizerBookings} className={styles.applyFilterButton}>Apply Filters</button> 
        */}
      </div>

      {bookings.length === 0 && !isLoading ? ( // Show empty state only if not loading and no error
        <div className={styles.emptyStateContainer}>
          <h2 className={styles.emptyStateTitle}>No Bookings Found</h2>
          <p className={styles.emptyStateText}>There are currently no bookings matching your criteria.</p>
        </div>
      ) : (
        <div className={styles.bookingsTableContainer}>
          <table className={styles.bookingsTable}>
            <thead>
              <tr>
                {/* Use styles.th if defined, or just use <th> */}
                <th>Client Name</th>
                <th>Client Email</th>
                <th>Service</th>
                <th>Date & Time</th>
                <th>Current Status</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  {/* Use styles.td if defined, or just use <td> */}
                  <td>{booking.client ? `${booking.client.firstName} ${booking.client.lastName}` : 'N/A'}</td>
                  <td>{booking.client ? booking.client.email : 'N/A'}</td>
                  <td>{booking.serviceType}</td>
                  <td>
                    {new Date(booking.startTime).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                  </td>
                  <td>
                    <span className={`${styles.statusCellContent} ${getStatusClassName(booking.status)}`}>
                      {booking.status.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <select
                      value={booking.status}
                      onChange={(e) => handleUpdateStatus(booking._id, e.target.value)}
                      className={styles.actionSelect}
                      disabled={booking.status === 'cancelled_by_user' && req.user.role !== 'admin'} // Admin can override
                    >
                      {AVAILABLE_BOOKING_STATUSES.map(status => (
                        <option key={status} value={status}>
                          {status.replace(/_/g, ' ').toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default OrganizerBookings;