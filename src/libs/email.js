import express, { Request, Response } from "express";
import { Resend } from "resend";

const app = express();
const resend = new Resend("re_9NL3tXsm_4JM8WxqgfVcdiGL8zmQtdmxU");

app.get("/", async (req, res) => {
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: ["delivered@resend.dev"],
    subject: "hello world",
    html: "<strong>it works!</strong>",
  });

  if (error) {
    return res.status(400).json({ error });
  }

  res.status(200).json({ data });
});

app.listen(3000, () => {
  console.log("Listening on http://localhost:3000");
});
