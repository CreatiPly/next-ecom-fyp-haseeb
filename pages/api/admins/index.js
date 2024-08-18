// pages/api/admins/index.js
import Admin from "../../../models/Admin";
import { isAdminRequest } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  console.log("API route called");
  try {
    await isAdminRequest(req, res);
    console.log("Admin request authorized");
  } catch (error) {
    console.error("Admin request failed:", error);
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    const admins = await Admin.find({});
    console.log("Fetched admins:", admins);
    res.status(200).json(admins);
  } else if (req.method === "POST") {
    const { email } = req.body;
    const admin = await Admin.create({ email });
    console.log("Created admin:", admin);
    res.status(201).json(admin);
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
