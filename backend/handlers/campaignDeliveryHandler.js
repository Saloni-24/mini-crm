const DeliveryLog = require('../data/deliveryLog');
const axios = require('axios');

// Delivery logs fetch karne ke liye function
async function getDeliveryLogsByCampaign(req, res) {
  try {
    const campaignId = req.params.id;

    // DB se delivery logs fetch karo jisme campaignId match karta ho
    const logs = await DeliveryLog.find({ campaignId });

    res.status(200).json(logs);
  } catch (error) {
    console.error('Error fetching delivery logs:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Messages bhejne aur delivery logs banane ka function
async function sendMessages(campaignId, customers, messageTemplate) {
  for (let i = 0; i < customers.length; i++) {
    const customer = customers[i];

    // Message me customer ka naam add karo
    const message = messageTemplate.replace('{name}', customer.name);

    // Delivery log me naya record banao
    const newLog = new DeliveryLog({
      campaignId: campaignId,
      customerId: customer._id,
      message: message,
      status: 'pending',
    });

    // DB me save karo
    await newLog.save();

    // Vendor ko message bhejo (dummy API call)
    axios.post('http://localhost:4000/vendor/send', {
      deliveryLogId: newLog._id,
      customerId: customer._id,
      message: message,
    }).catch((error) => {
      console.log('Error sending to vendor:', error.message);
    });
  }
}

module.exports = { sendMessages, getDeliveryLogsByCampaign };
