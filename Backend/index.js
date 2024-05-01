const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const stripe = require("stripe")(
  "sk_test_51OwjelIu1YXMSFeykDTeGFmy9uq7J2wWu9SX352B68aJYuhPudlKGEPmwDSIhl3SYUsqKqv3UmNvFJ1QF4jAjSUT0033ZJf086"
);
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/home", (req, res) => {
  res.send(`<h2>hello</h2>`);
});

app.post("/payments/intents", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "pkr",
      automatic_payment_methods: { enabled: true },
    });
    res.json({ paymentIntent: paymentIntent.client_secret });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// app.post('/create-room', async (req, res) => {
//   try {
//       const apiKey = 'a404c78b97c9ec9837ab4f370fd73e5ab9883b2eedd30fd5b7f37928f06f586a'; // Securely store and use your API key
//       const url = await createRoom(apiKey);
//       res.json({ url });
//   } catch (error) {
//       console.error('Failed to create room:', error);
//       res.status(500).send('Failed to create room');
//   }
// });

app.post('/create-room', async (req, res) => {
  try {
      const apiResponse = await fetch('https://api.daily.co/v1/rooms', {
          method: 'POST',
          headers: {
              'Authorization': `Bearer a404c78b97c9ec9837ab4f370fd73e5ab9883b2eedd30fd5b7f37928f06f586a`,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ properties: { exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60 } }) // Example body
      });
      const jsonData = await apiResponse.json();
      if (apiResponse.ok) {
          console.log('API Response:', jsonData);  // Log the response
          res.json({ url: jsonData.url });
      } else {
          console.error('API Response Error:', jsonData);  // Log error response
          res.status(500).json({ error: 'Failed to create room', details: jsonData });
      }
  } catch (error) {
      console.error('Server Error:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

const port = 8080;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
