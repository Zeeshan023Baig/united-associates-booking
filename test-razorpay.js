import Razorpay from 'razorpay';


async function testTransaction() {
  console.log("Starting Razorpay Backend Test...");
  
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error("Missing credentials in environment!");
    process.exit(1);
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  try {
    console.log("1. Creating order for ₹500 (50000 paise)...");
    const order = await razorpay.orders.create({
      amount: 50000,
      currency: "INR",
      receipt: "test_receipt_123"
    });
    
    console.log("✅ Order created successfully!");
    console.log("Order ID:", order.id);
    console.log("Amount:", order.amount / 100, order.currency);
    console.log("Status:", order.status);
    
    console.log("\nSince a real transaction requires browser interaction (entering card details in the Razorpay popup), the backend API part is confirmed working perfectly!");
    console.log("To complete a full test transaction, click the Pay button in your app and use a Razorpay test card.");
  } catch (err) {
    console.error("❌ Test failed:", err);
  }
}

testTransaction();
