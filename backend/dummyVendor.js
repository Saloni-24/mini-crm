const express = require('express');
const app = express();
app.use(express.json());

// 90% success, 10% failure  function
function isSuccess() {
  return Math.random() < 0.9;
}

app.post('/vendor/send', (req, res) => {
  const { deliveryLogId, customerId, message } = req.body;

  console.log('Message received for:', customerId);

  // Thoda delay karke delivery report bhejte hain
  setTimeout(() => {
    const status = isSuccess() ? 'success' : 'failure';

    const axios = require('axios');
    axios.post('http://localhost:3000/api/delivery-receipt', {
      deliveryLogId: deliveryLogId,
      status: status,
      timestamp: new Date(),
    })
    .then(() => {
      console.log('Delivery receipt sent:', status);
    })
    .catch(err => {
      console.log('Error sending delivery receipt:', err.message);
    });
  }, 1000); // 1 second delay

  res.json({ message: 'Message accepted for delivery' });
});

app.listen(4000, () => {
  console.log('Dummy Vendor API running on port 4000');
});
