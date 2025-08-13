// const express = require("express");
// const { YTMusic } = require("ytmusic-api");

// const router = express.Router();
// const ytmusic = new YTMusic();

// (async () => {
//   await ytmusic.initialize();
// })();

// router.get("/songs", async (req, res) => {
//   try {
//     const results = await ytmusic.search("Bollywood Songs", "songs"); // You can replace query dynamically
//     res.json(results);
//   } catch (error) {
//     console.error("Error fetching YouTube Music data:", error);
//     res.status(500).json({ error: "Failed to fetch songs" });
//   }
// });

// module.exports = router;
