import express from "express";
import { uploadRouter } from "./uploadRouter.js";
import { uploadRouter2 } from "./uploadRouter2.js";

const app = express();

app.get("/", (_, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(uploadRouter);
app.use(uploadRouter2);

app.listen(8080, () => {
  console.log("Form running on port 8080");
});
