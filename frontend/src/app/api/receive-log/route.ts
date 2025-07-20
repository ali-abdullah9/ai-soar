import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const LOG_DIR = path.join(process.cwd(), "logs");
const LOG_FILE = path.join(LOG_DIR, "logs.json");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("📥 Received log:", body);

    // Ensure logs directory exists
    if (!fs.existsSync(LOG_DIR)) {
      fs.mkdirSync(LOG_DIR, { recursive: true });
    }

    // Read existing logs
    let existingLogs: any[] = [];
    if (fs.existsSync(LOG_FILE)) {
      const fileContent = fs.readFileSync(LOG_FILE, "utf-8");
      existingLogs = JSON.parse(fileContent || "[]");
    }

    // Add new log
    existingLogs.push(body);

    // Save updated logs
    fs.writeFileSync(LOG_FILE, JSON.stringify(existingLogs, null, 2));

    return NextResponse.json({ message: "Log stored successfully" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error saving log:", error);
    return NextResponse.json({ message: "Error saving log" }, { status: 500 });
  }
}

export async function GET() {
  try {
    if (fs.existsSync(LOG_FILE)) {
      const fileContent = fs.readFileSync(LOG_FILE, "utf-8");
      const logs = JSON.parse(fileContent);
      return NextResponse.json(logs, { status: 200 });
    } else {
      return NextResponse.json([], { status: 200 });
    }
  } catch (error) {
    console.error("❌ Error reading logs:", error);
    return NextResponse.json({ message: "Error reading logs" }, { status: 500 });
  }
}
