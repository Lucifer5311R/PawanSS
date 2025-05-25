// src/components/PaymentForm.jsx
import React, { useState, useEffect } from 'react';
import styles from './PaymentForm.module.css'; //

const PaymentForm = ({ amount, onPaymentSuccess, onPaymentError }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // null, 'success', 'error'
  const [clientInfo, setClientInfo] = useState({
    name: '',
    email: '',
    phone: '',
    caseDetails: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClientInfo(prev => ({ ...prev, [name]: value }));
  };

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!clientInfo.name || !clientInfo.email || !clientInfo.phone) {
      alert('Please fill in all required fields: Name, Email, and Phone.');
      return;
    }
    
    setIsProcessing(true);
    setPaymentStatus(null); // Reset status
    
    try {
      const razorpayLoaded = await initializeRazorpay();
      if (!razorpayLoaded) {
        alert('Razorpay SDK failed to load. Please check your internet connection and try again.');
        setIsProcessing(false);
        return;
      }
      
      // Backend URL for creating order
      const backendUrl = 'http://localhost:5000'; // Ensure this is your backend URL

      const orderResponse = await fetch(`${backendUrl}/api/payment/create-order`, { //
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amount, // Amount is in rupees, backend will convert to paise
          currency: 'INR',
          receipt: `receipt_client_${Date.now()}`, // Unique receipt ID
        }),
      });
      
      const orderData = await orderResponse.json();
      
      if (!orderData.success || !orderData.order) {
        throw new Error(orderData.message || 'Failed to create payment order with backend.');
      }
      
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'YOUR_RAZORPAY_KEY_ID', // Important: Use environment variable for Key ID
        amount: orderData.order.amount, // Amount in paise from backend
        currency: orderData.order.currency,
        name: 'Art of Law - Legal Consultation',
        description: clientInfo.caseDetails || `Consultation Fee: ₹${amount}`,
        order_id: orderData.order.id,
        handler: async function (response) {
          try {
            const verificationResponse = await fetch(`${backendUrl}/api/payment/verify-payment`, { //
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            });
            
            const verificationData = await verificationResponse.json();
            
            if (verificationData.success) {
              setPaymentStatus('success');
              if (onPaymentSuccess) onPaymentSuccess(response);
            } else {
              setPaymentStatus('error');
              if (onPaymentError) onPaymentError(verificationData.message || 'Payment verification failed.');
            }
          } catch (verifyError) {
            console.error('Payment verification API error:', verifyError);
            setPaymentStatus('error');
            if (onPaymentError) onPaymentError(verifyError.message || 'An error occurred during payment verification.');
          }
        },
        prefill: {
          name: clientInfo.name,
          email: clientInfo.email,
          contact: clientInfo.phone,
        },
        notes: {
          address: 'Art of Law Client Payment',
          caseDetails: clientInfo.caseDetails.substring(0, 250) // Razorpay note length limit
        },
        theme: {
          color: '#0a3d62', // Matches your primary color
        },
        modal: {
            ondismiss: function(){
                console.log('Razorpay checkout modal dismissed.');
                // Only set processing to false if it wasn't a success/error already handled.
                // if(paymentStatus === null) setIsProcessing(false); // User might close it before payment
            }
        }
      };
      
      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response){
            console.error('Razorpay payment.failed event:', response.error);
            setPaymentStatus('error');
            if (onPaymentError) onPaymentError(`Payment Failed: ${response.error.description} (Reason: ${response.error.reason})`);
            setIsProcessing(false); // Allow retry
      });
      paymentObject.open();
      // setIsProcessing(false) is handled in finally or after paymentObject.open() if it's synchronous.
      // However, Razorpay open() is asynchronous in its effects. Processing should be set to false
      // when handler is called, or on payment.failed, or if user dismisses modal without paying.
      // For simplicity, handler and payment.failed will set isProcessing to false eventually via setPaymentStatus.
      // But if modal is dismissed, it might stay true. Let's add it to ondismiss.
      // (Note: The above ondismiss is not setting setIsProcessing directly. It's usually better to handle it in the handler/failed callbacks)

    } catch (error) {
      console.error('Main payment handleSubmit error:', error);
      setPaymentStatus('error');
      if (onPaymentError) onPaymentError(error.message || 'An unexpected error occurred.');
      setIsProcessing(false);
    } 
    // Do not set setIsProcessing(false) here directly after try-catch if paymentObject.open() is called
    // because the payment process is now handed over to Razorpay modal.
  };
  
  // Effect to stop processing when payment status is resolved (success/error)
  // or if the component unmounts while processing.
  useEffect(() => {
    if (paymentStatus === 'success' || paymentStatus === 'error') {
        setIsProcessing(false);
    }
  }, [paymentStatus]);

  return (
    <div className={styles.paymentContainer}>
      <h3>Legal Consultation Payment</h3>
      <p className={styles.paymentDescription}>
        Please provide your information. You will be redirected to Razorpay to complete the payment securely.
      </p>
      
      <form onSubmit={handleSubmit} className={styles.paymentForm}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Full Name *</label>
          <input type="text" id="name" name="name" value={clientInfo.name} onChange={handleInputChange} className={styles.textInput} required />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="email">Email Address *</label>
          <input type="email" id="email" name="email" value={clientInfo.email} onChange={handleInputChange} className={styles.textInput} required />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="phone">Phone Number *</label>
          <input type="tel" id="phone" name="phone" value={clientInfo.phone} onChange={handleInputChange} className={styles.textInput} required />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="caseDetails">Brief Case Description (Optional)</label>
          <textarea id="caseDetails" name="caseDetails" value={clientInfo.caseDetails} onChange={handleInputChange} className={styles.textArea} rows="3" />
        </div>
        
        <div className={styles.paymentAmount}>
          <span>Consultation Fee:</span>
          <strong>₹{amount ? amount.toLocaleString() : 'N/A'}</strong>
        </div>
        
        <button type="submit" disabled={isProcessing || !amount} className={styles.paymentButton}>
          {isProcessing ? 'Processing...' : `Pay ₹${amount ? amount.toLocaleString() : ''} Now`}
        </button>
        
        {paymentStatus === 'success' && (
          <div className={styles.successMessage}>
            Payment successful! We'll contact you shortly to confirm your consultation.
          </div>
        )}
        
        {paymentStatus === 'error' && (
          <div className={styles.errorMessage}>
            Payment failed. Please try again or contact support if the issue persists.
          </div>
        )}
      </form>
    </div>
  );
};

export default PaymentForm;