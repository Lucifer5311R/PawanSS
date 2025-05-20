import React, { useState } from 'react';
import styles from './PaymentForm.module.css';

const PaymentForm = ({ amount }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [clientInfo, setClientInfo] = useState({
    name: '',
    email: '',
    phone: '',
    caseDetails: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClientInfo(prev => ({
      ...prev,
      [name]: value
    }));
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
    
    // Validate form
    if (!clientInfo.name || !clientInfo.email || !clientInfo.phone) {
      alert('Please fill in all required fields');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Initialize Razorpay
      const res = await initializeRazorpay();
      
      if (!res) {
        alert('Razorpay SDK failed to load');
        setIsProcessing(false);
        return;
      }
      
      // Create order on your backend
      const response = await fetch('http://localhost:5000/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
        }),
      });
      
      const orderData = await response.json();
      
      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create order');
      }
      
      // Configure Razorpay options
      const options = {
        key: 'YOUR_RAZORPAY_KEY_ID', // Replace with actual key from Pawan SS
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'Art of Law',
        description: `${clientInfo.caseDetails || 'Legal Consultation'}`,
        order_id: orderData.order.id,
        handler: async function (response) {
          try {
            // Verify payment on your backend
            const verifyResponse = await fetch('http://localhost:5000/api/payment/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            });
            
            const verifyData = await verifyResponse.json();
            
            if (verifyData.success) {
              setPaymentStatus('success');
            } else {
              setPaymentStatus('error');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            setPaymentStatus('error');
          }
        },
        prefill: {
          name: clientInfo.name,
          email: clientInfo.email,
          contact: clientInfo.phone,
        },
        theme: {
          color: '#0c4a6e',
        },
      };
      
      // Initialize Razorpay
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.paymentContainer}>
      <h3>Legal Consultation Payment</h3>
      <p className={styles.paymentDescription}>Please provide your information to complete the payment and schedule your consultation.</p>
      
      <form onSubmit={handleSubmit} className={styles.paymentForm}>
        <div className={styles.formGroup}>
          <label>Full Name *</label>
          <input 
            type="text" 
            name="name" 
            value={clientInfo.name} 
            onChange={handleInputChange} 
            className={styles.textInput} 
            required 
          />
        </div>
        
        <div className={styles.formGroup}>
          <label>Email Address *</label>
          <input 
            type="email" 
            name="email" 
            value={clientInfo.email} 
            onChange={handleInputChange} 
            className={styles.textInput} 
            required 
          />
        </div>
        
        <div className={styles.formGroup}>
          <label>Phone Number *</label>
          <input 
            type="tel" 
            name="phone" 
            value={clientInfo.phone} 
            onChange={handleInputChange} 
            className={styles.textInput} 
            required 
          />
        </div>
        
        <div className={styles.formGroup}>
          <label>Brief Case Description</label>
          <textarea 
            name="caseDetails" 
            value={clientInfo.caseDetails} 
            onChange={handleInputChange} 
            className={styles.textArea} 
            rows="3"
          />
        </div>
        
        <div className={styles.paymentAmount}>
          <span>Consultation Fee:</span>
          <strong>₹{amount.toLocaleString() || '7,500'}</strong>
        </div>
        
        <button 
          type="submit" 
          disabled={isProcessing}
          className={styles.paymentButton}
        >
          {isProcessing ? 'Processing...' : 'Pay Now'}
        </button>
        
        {paymentStatus === 'success' && (
          <div className={styles.successMessage}>
            Payment successful! We'll contact you shortly to confirm your consultation appointment.
          </div>
        )}
        
        {paymentStatus === 'error' && (
          <div className={styles.errorMessage}>Payment failed. Please try again or contact support.</div>
        )}
      </form>
    </div>
  );
};

export default PaymentForm;