const axios = require('axios');
const Campaign = require('../data/campaign');
const Customer = require('../data/customer');
const DeliveryLog = require('../data/deliveryLog');

// Helper function to convert rules into MongoDB query filter with logic (AND/OR)
const buildFilter = (rules, logic = 'AND') => {
  if (!Array.isArray(rules)) return {};

  const allowedFields = ['spend', 'visits'];

  const conditions = rules
    .map(rule => {
      let operatorMongo;
      switch (rule.operator) {
        case '>': operatorMongo = '$gt'; break;
        case '<': operatorMongo = '$lt'; break;
        case '>=': operatorMongo = '$gte'; break;
        case '<=': operatorMongo = '$lte'; break;
        case '==': operatorMongo = '$eq'; break;
        case '!=': operatorMongo = '$ne'; break;
        default: return null; // unsupported operator
      }

      if (!allowedFields.includes(rule.field)) return null; // invalid field

      return { [rule.field]: { [operatorMongo]: rule.value } };
    })
    .filter(Boolean);

  if (logic === 'AND') return { $and: conditions };
  else if (logic === 'OR') return { $or: conditions };
  else return { $and: conditions }; // fallback default
};

const createDeliveryLogs = async (campaignId, customers) => {
  if (!customers.length) return;

  const logs = customers.map(cust => ({
    campaignId,
    customerId: cust._id,
    status: 'PENDING',
  }));

  await DeliveryLog.insertMany(logs);
};

const createCampaign = async (req, res) => {
  try {
    const { name, rules, message, logic } = req.body;

    if (!name || !rules || !message || !logic) {
      return res.status(400).json({ msg: 'Please fill all fields' });
    }

    if (!Array.isArray(rules) || rules.length === 0) {
      return res.status(400).json({ msg: 'Rules must be a non-empty array' });
    }

    for (const rule of rules) {
      if (!rule.field || !rule.operator || rule.value === undefined) {
        return res.status(400).json({ msg: 'Each rule must have field, operator, and value' });
      }
    }

    if (!['AND', 'OR'].includes(logic)) {
      return res.status(400).json({ msg: "Logic must be 'AND' or 'OR'" });
    }

    const filter = buildFilter(rules, logic);
    const customers = await Customer.find(filter);

    const newCampaign = new Campaign({
      name,
      rules,
      logic,
      message,
      audienceSize: customers.length,
      status: 'CREATED',
      sent: 0,
      failed: 0,
    });

    await newCampaign.save();

    await createDeliveryLogs(newCampaign._id, customers);

    console.log(`[ Campaign Created ] Name: ${name} | Audience: ${customers.length} | Rules: ${rules.length}`);
    res.status(201).json({ msg: 'Campaign created', campaign: newCampaign });
  } catch (err) {
    console.log('Error in creating campaign:', err.message);
    res.status(500).json({ msg: 'Some trouble in the server' });
  }
};

const sendCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await Campaign.findById(id);
    if (!campaign) return res.status(404).json({ msg: 'Campaign not found' });

    const filter = buildFilter(campaign.rules, campaign.logic);
    const customers = await Customer.find(filter);

    if (customers.length === 0) {
      return res.status(400).json({ msg: 'No customers found for this campaign' });
    }

    let sentCount = 0;
    let failedCount = 0;

    for (const cust of customers) {
      const personalizedMessage = `Hi ${cust.name}, ${campaign.message}`;

      const isSent = Math.random() < 0.9;

      await axios.post('http://localhost:5000/api/delivery-receipts', {
        campaignId: campaign._id,
        customerId: cust._id,
        status: isSent ? 'SENT' : 'FAILED',
        message: personalizedMessage,
      });

      if (isSent) sentCount++;
      else failedCount++;
    }

    campaign.status = 'SENT';
    campaign.sent = sentCount;
    campaign.failed = failedCount;
    campaign.deliveredAt = new Date();

    await campaign.save();

    res.status(200).json({
      msg: 'Campaign messages sent (simulation)',
      sent: sentCount,
      failed: failedCount,
    });
  } catch (error) {
    console.error('sendCampaign error:', error.message);
    res.status(500).json({ msg: 'Server error sending campaign' });
  }
};

const listCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.status(200).json({ campaigns });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch campaigns' });
  }
};

const previewCampaign = (req, res) => {
  // Just send dummy preview, customize as needed
  res.status(200).json({ preview: 'This is a campaign preview' });
};

const getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.status(200).json({ campaigns });
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching campaigns' });
  }
};

module.exports = {
  createCampaign,
  sendCampaign,
  listCampaigns,
  previewCampaign,
  getAllCampaigns,
};
