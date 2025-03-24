require("dotenv").config(); // Load environment variables

const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

// Load API keys from .env file
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const SERPAPI_KEY = process.env.SERPAPI_KEY;

console.log("Supabase URL:", SUPABASE_URL); // Debugging check

app.get("/products", async (req, res) => {
  try {
    const response = await fetch(`https://serpapi.com/search.json?engine=amazon&api_key=${SERPAPI_KEY}&search_query=laptop`);
    const data = await response.json();
    
    res.json(data);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
