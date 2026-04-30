import "dotenv/config";
import app from "./app.js";

const PORT = parseInt(process.env.PORT || "5000", 10);

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`Users API: http://localhost:${PORT}/api/users`);
});

export default server;
