// pages/api/admins/[id].js
import Admin from "../../../models/Admin";
import { isAdminRequest } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  try {
    await isAdminRequest(req, res);
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { id } = req.query;

  if (req.method === "PUT") {
    const { email } = req.body;
    const updatedAdmin = await Admin.findByIdAndUpdate(
      id,
      { email },
      { new: true }
    );
    res.status(200).json(updatedAdmin);
  } else if (req.method === "DELETE") {
    await Admin.findByIdAndDelete(id);
    res.status(204).end();
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
