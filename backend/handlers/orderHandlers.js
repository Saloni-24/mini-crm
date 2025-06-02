const Order = require('../data/order');

// function to add new user
const addNewOrder = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("User from JWT middleware:", req.user);

    // JWT middleware se userId mil raha hoga
    const { customerName, product, amount } = req.body;  

    const newOrder = new Order({
      customerName,            
      product,
      amount,
      userId: req.user.userId //  userId is added from JWT token
    });

    const savedOrder = await newOrder.save(); // to save order in db 
    res.status(201).json({
      message: 'Order successfully added ',
      order: savedOrder,
    });
  } catch (error) {
    console.log("error while loading the order:", error.message);
    res.status(500).json({ message: "unable to save the order" });
  }
};

// function to show all orders
const showAllOrders = async (req, res) => {
  try {
    const orders = await Order.find(); // to extract orders from db
    res.json(orders);
  } catch (error) {
    console.log("error in showing the orders:", error.message);
    res.status(500).json({ message: "unable to show orders " });
  }
};

module.exports = { addNewOrder, showAllOrders };
