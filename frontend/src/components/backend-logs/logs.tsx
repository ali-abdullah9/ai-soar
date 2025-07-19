import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    console.log("📥 Log received in Next API route:");
    console.log(JSON.stringify(req.body, null, 2));
    res.status(200).json({ message: "Log received" });
  } else if (req.method === "GET") {
    res.status(200).json({ message: "This API expects POST requests with log data" });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
