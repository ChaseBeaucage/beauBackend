// Backend: Node.js with Express (Now uses Supabase + SerpApi)
const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Supabase Setup
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Fetch Amazon products using SerpApi
const fetchAmazonProducts = async () => {
  try {
    const response = await axios.get("https://serpapi.com/search", {
      params: {
        engine: "amazon",
        search_query: "best deals",
        api_key: process.env.SERPAPI_KEY,
      },
    });
    
    const products = response.data.shopping_results.map((product, index) => ({
      id: index,
      name: product.title,
      price: parseFloat(product.price.replace(/[^0-9.]/g, "")),
      weight: Math.random() * 5 + 1, // Mock weight (since Amazon doesn't provide it)
    }));
    
    return products;
  } catch (error) {
    console.error("Error fetching Amazon products:", error);
    return [];
  }
};

// Endpoint to get sorted products
app.get("/products", async (req, res) => {
  try {
    const products = await fetchAmazonProducts();
    
    const sortedProducts = products.map(p => ({
      ...p,
      pricePerWeight: p.price / p.weight,
    })).sort((a, b) => a.pricePerWeight - b.pricePerWeight);
    
    res.json(sortedProducts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
