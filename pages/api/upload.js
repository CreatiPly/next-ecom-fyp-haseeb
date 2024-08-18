import { createClient } from "@supabase/supabase-js";
import multiparty from "multiparty";
import fs from "fs";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handle(req, res) {
  await mongooseConnect();
  await isAdminRequest(req, res);


  const form = new multiparty.Form();
  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });

  const uploadedUrls = [];

  for (const file of files.file) {
    const fileContents = await fs.promises.readFile(file.path);
    const fileName = `${Date.now()}_${file.originalFilename}`;

    const { data, error } = await supabase.storage
      .from("next-ecom-prod-imgs")
      .upload(`products/${fileName}`, fileContents, {
        contentType: file.headers["content-type"],
      });

    if (error) {
      console.error("Error uploading file:", error);
      continue; // Skip this file and continue with the next
    }

    const { data: publicUrlData } = supabase.storage
      .from("next-ecom-prod-imgs")
      .getPublicUrl(`products/${fileName}`);

    uploadedUrls.push(publicUrlData.publicUrl);
  }

  return res.status(200).json({ urls: uploadedUrls });
}

export const config = {
  api: { bodyParser: false },
};

