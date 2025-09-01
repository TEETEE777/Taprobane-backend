const Order = require("../models/order.model");
const Product = require("../models/product.model");

// Seller summary stats
exports.getSellerSummary = async (req, res) => {
  try {
    const { sellerId } = req.params;

    const products = await Product.find({ sellerId });
    const totalProducts = products.length;

    const orders = await Order.find({ "items.sellerId": sellerId });

    let totalRevenue = 0;
    let totalOrders = 0;
    let productSales = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (item.sellerId.toString() === sellerId) {
          totalRevenue += item.price * item.quantity;
          totalOrders++;
          productSales[item.name] =
            (productSales[item.name] || 0) + item.quantity;
        }
      });
    });

    const topProduct = Object.entries(productSales).sort(
      (a, b) => b[1] - a[1]
    )[0] || ["N/A", 0];

    res.json({
      totalRevenue,
      totalOrders,
      totalProducts,
      topProduct: { name: topProduct[0], sold: topProduct[1] },
      productSales,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Export CSV
exports.exportSellerReport = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const orders = await Order.find({ "items.sellerId": sellerId });

    let csv = "Product,Quantity,Revenue\n";
    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (item.sellerId.toString() === sellerId) {
          csv += `${item.productName},${item.quantity},${
            item.price * item.quantity
          }\n`;
        }
      });
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=report.csv");
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRecentOrders = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const orders = await Order.find({ "items.sellerId": sellerId })
      .sort({ createdAt: -1 }) // latest orders first
      .limit(5);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
