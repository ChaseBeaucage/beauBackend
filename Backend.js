require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;
const SERPAPI_KEY = process.env.SERPAPI_KEY;

app.get("/products", async (req, res) => {
    try {
        const response = await fetch(
            `https://serpapi.com/search.json?engine=amazon&api_key=${SERPAPI_KEY}&search_query=laptop`
        );
        const data = await response.json();

        // Transform Amazon results into a usable format
        const products = data.shopping_results.map((item) => ({
            id: item.position,
            name: item.title,
            price: parseFloat(item.price.replace("$", "")), // Convert to number
            weight: Math.random() * 5 + 1, // Placeholder weight (Amazon API doesn’t return weight)
            pricePerWeight: parseFloat(item.price.replace("$", "")) / (Math.random() * 5 + 1), // Fake calculation
        }));

        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
