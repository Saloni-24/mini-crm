const Campaign = require('../data/campaign');
const Customer = require('../data/customer');

// Helper function to convert rules into MongoDB query filter
const buildFilter = (rules) => {
  if (!Array.isArray(rules)) return {};

  const allowedFields = ['spend', 'visits'];

  const conditions = rules
    .map(rule => {
      let operatorMongo;
      switch (rule.operator) {
        case ">":
          operatorMongo = "$gt";
          break;
        case "<":
          operatorMongo = "$lt";
          break;
        case ">=":
          operatorMongo = "$gte";
          break;
        case "<=":
          operatorMongo = "$lte";
          break;
        case "==":
          operatorMongo = "$eq";
          break;
        case "!=":
          operatorMongo = "$ne";
          break;
        default:
          return null; // unsupported operator
      }

      if (!allowedFields.includes(rule.field)) return null; // invalid field

      return { [rule.field]: { [operatorMongo]: rule.value } };
    })
    .filter(Boolean); // remove nulls

  return { $and: conditions };
};

const createCampaign = async (req, res) => {
  try {
    const { name, rules, message } = req.body;

    if (!name || !rules || !message) {
      return res.status(400).json({ msg: 'Please fill all fields' });
    }

    const filter = buildFilter(rules);
    const customers = await Customer.find(filter);

    const newCampaign = new Campaign({
      name,
      rules,
      message,
      audienceSize: customers.length,
    });

    await newCampaign.save();

    console.log(`[ Campaign Created] Name: ${name} | Audience: ${customers.length} | Rules: ${rules.length}`);
    res.status(201).json({ msg: 'Campaign created', campaign: newCampaign });
  } catch (err) {
    console.log('Error in creating campaign:', err.message);
    res.status(500).json({ msg: 'Some trouble in the server' });
  }
};

const listCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    console.log(' Loaded all campaigns');
    res.status(200).json({ campaigns });
  } catch (err) {
    console.log(' Error while loading campaign:', err.message);
    res.status(500).json({ msg: 'Trouble in server' });
  }
};

module.exports = {
  createCampaign,
  listCampaigns,
};
