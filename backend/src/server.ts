import "dotenv/config";
import express from "express";

const app = express();

const PORT = parseInt(process.env.PORT || "5000", 10);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
