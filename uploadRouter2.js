import express from "express";
import multer from "multer";
import stream from "stream";
import { google } from "googleapis";
import { getDriveService } from "./service.js";
import dotenv from "dotenv";
import { Storage } from "@google-cloud/storage";
import { blob } from "stream/consumers";

dotenv.config;

export const uploadRouter2 = express.Router();
const upload = multer();

const storage = new Storage({
  projectId: "my-first-file-upload",
  keyFilename: "./service.json",
});

const bucket = storage.bucket("test-bucket-photos");

const uploadFile = async (fileObject) => {
  try {
    const photoUp = bucket.file(fileObject.originalname);
    const photoUpStream = photoUp.createWriteStream();

    photoUpStream.on("finish", (e) => console.log("photostream connected"));
    // const fileURL = await photoUp.getSignedUrl({
    //   action: "read",
    //   expires: "01-01-2026",
    // });
    photoUpStream.end(fileObject.buffer);
    console.log(`Uploaded file ${fileObject.originalname}`);
    // console.log(photoUp);
  } catch (err) {
    console.log(err.message);
  }
};

uploadRouter2.post("/upload2", upload.any(), async (req, res) => {
  console.log("upload2 Endpoint reached");
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
