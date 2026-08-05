import "dotenv/config";
import app from "./app.js";
import pool from "./config/db.js";

const port = Number(process.env.PORT || 3000);

async function startServer() {
  try {
    await pool.query("SELECT 1");
    console.log("PostgreSQL connected");

    app.listen(port, () => {
      console.log(`Admin API running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error);
    process.exit(1);
  }
}

startServer();
