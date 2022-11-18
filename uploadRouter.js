import express from "express";
import multer from "multer";
import stream from "stream";
import { google } from "googleapis";
import { getDriveService } from "./service.js";
import dotenv from "dotenv";

dotenv.config;

export const uploadRouter = express.Router();
const upload = multer();

const auth = new google.auth.GoogleAuth({
  keyFile: "./service.json",
  scopes: ["https://www.googleapis.com/auth/drive"],
});

google.options({ auth: auth });

const uploadFile = async (fileObject) => {
  const bufferStream = new stream.PassThrough();
  bufferStream.end(fileObject.buffer);
  console.log(fileObject);
  console.log("mimeType:", fileObject.mimetype);
  console.log(fileObject.originalname);
  try {
    const { data } = await google.drive({ version: "v3" }).files.create({
      media: {
        mimeType: fileObject.mimetype,
        body: bufferStream,
      },
      requestBody: {
        name: fileObject.originalname,
        parents: ["1U5Z97Ym9mu7qL1-B2yocB2msCtvzquTS"],
      },
      fields: "id",
    });
    console.log(`Uploaded file ${data}`);
  } catch (err) {
    console.log(err.message);
  }
};

uploadRouter.post("/upload", upload.any(), async (req, res) => {
  console.log("upload Endpoint reached");
  try {
    const { body, files } = req;

    for (let f = 0; f < files.length; f += 1) {
      await uploadFile(files[f]);
    }

    console.log(body);
    res.status(200).send("Form Submitted");
  } catch (f) {
    res.send(f.message);
  }
});
