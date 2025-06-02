const Customer = require('../data/customer');

const addCustomer = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const userId = req.user.id;  // JWT se milne wala userId

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and Email are required' });
    }

    // to check whether customer's email id is already registerd with user or not
    const customerExist = await Customer.findOne({ email, userId });
    if (customerExist) {
      return res.status(400).json({ message: 'Customer with this email already exists' });
    }

    const newCustomer = new Customer({
      name,
      email,
      phone,
      address,
      userId,  
    });

    await newCustomer.save();

    res.status(201).json({ message: 'Customer added', customer: newCustomer });
  } catch (error) {
    console.log('Error in addCustomer:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getCustomers = async (req, res) => {
  try {
    const userId = req.user.id;  // JWT se userId

    // user can find his own customer only
    const customers = await Customer.find({ userId }).sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    console.log('Error in getCustomers:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  addCustomer,
  getCustomers,
};
