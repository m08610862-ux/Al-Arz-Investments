import { defineConfig } from "prisma/config";
import { config } from "dotenv";

config(); // Load .env file for CLI commands

export default defineConfig({});
