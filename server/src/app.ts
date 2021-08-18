import express from "express";
import {
  getTreasures,
  postUser,
  getSingleUser,
  postSale,
  patchUser,
} from "./controllers";
import { send405 } from "./errors";
import { customErrors } from "./errors";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.route("/api/treasures").get(getTreasures).all(send405);
app
  .route("/api/users/:username")
  .get(getSingleUser)
  .patch(patchUser)
  .all(send405);
app.route("/api/users").post(postUser).all(send405);
app.route("/api/sale").post(postSale).all(send405);

app.use(customErrors);

export default app;
