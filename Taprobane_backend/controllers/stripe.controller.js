const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const LKR_TO_USD = 1 / 325;
exports.createCheckoutSession = async (req, res) => {
  const { items, successUrl, cancelUrl, deliveryFee } = req.body;
  console.log("Request body:", req.body);
  console.log("Success URL:", successUrl);
  console.log("Cancel URL:", cancelUrl);

  try {
    const lineItems = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: [
            item.image.startsWith("http")
              ? item.image
              : `http://localhost:3000${item.image}`,
          ],
        },
        unit_amount: Math.round(item.price * LKR_TO_USD * 100), // Convert LKR to cents
      },
      quantity: item.quantity,
    }));

    if (deliveryFee && deliveryFee > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Delivery Fee",
          },
          unit_amount: Math.round(deliveryFee * LKR_TO_USD * 100),
        },
        quantity: 1,
      });
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error("Stripe session error:", error.message);
    res.status(500).json({ error: "Failed to create Stripe session" });
  }
};
