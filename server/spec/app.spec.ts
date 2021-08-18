import { expect } from "chai";
import request from "supertest";
import {
  TreasuresResponse,
  ErrorResponse,
  UserResponse,
  SaleResponse,
} from "../../common/apiSchema";
import app from "../src/app";
import fs from "fs";

type CRUDMethods = "post" | "patch" | "delete" | "put" | "get";

afterEach(() => {
  const writeUsers = fs.promises.writeFile(
    "./src/data/users.json",
    JSON.stringify([
      {
        username: "rgig",
        subscribed_for_newsletter: false,
        forename: "Ryan",
        surname: "Gislason",
        shop_name: "Kerluke - Koss",
      },
      {
        username: "herm",
        subscribed_for_newsletter: true,
        forename: "Hermann",
        surname: "Strosin",
        shop_name: "Goldner LLC",
      },
      {
        username: "quigz",
        subscribed_for_newsletter: false,
        forename: "Efren",
        surname: "Quigley",
        purchases: ["some treasure £65000"],
      },
      {
        username: "laverne",
        subscribed_for_newsletter: true,
        forename: "Laverne",
        surname: "Ziemann",
        purchases: [],
      },
    ])
  );
  const writeTreasures = fs.promises.writeFile(
    "./src/data/treasures.json",
    JSON.stringify([
      {
        id: 1,
        treasure_name: "Open-architected Intelligent Wooden Salad",
        colour: "blue",
        age: 320,
        cost_at_auction: 88524,
        shop: "Kerluke - Koss",
      },
      {
        id: 2,
        treasure_name: "Monitored Handcrafted Metal Cheese",
        colour: "orchid",
        age: 600,
        cost_at_auction: 53583,
        shop: "Kerluke - Koss",
      },
      {
        id: 3,
        treasure_name: "Integrated Intelligent Frozen Cheese",
        colour: "cyan",
        age: 761,
        cost_at_auction: 32238,
        shop: "Goldner LLC",
      },
      {
        id: 4,
        treasure_name: "Extended Sleek Concrete Chips",
        colour: "black",
        age: 737,
        cost_at_auction: 74918,
        shop: "Goldner LLC",
      },
      {
        id: 5,
        treasure_name: "Face to face Licensed Metal Pants",
        colour: "ivory",
        age: 407,
        cost_at_auction: 44477,
        shop: "Goldner LLC",
      },
    ])
  );
  return Promise.all([writeUsers, writeTreasures]);
});

describe("app", () => {
  describe("/api", () => {
    describe("/treasures", () => {
      it("GET: 200 returns an array of treasures", () => {
        return request(app)
          .get("/api/treasures")
          .expect(200)
          .then(({ body: { treasures } }: { body: TreasuresResponse }) => {
            expect(treasures[0]).to.have.keys(
              "id",
              "treasure_name",
              "colour",
              "age",
              "cost_at_auction",
              "shop"
            );
          });
      });
      it("GET: 405 returns an error message for an invalid request type", () => {
        const badMethods: CRUDMethods[] = ["post", "patch", "delete", "put"];
        const badPromises = badMethods.map((method) => {
          return request(app)
            [method]("/api/treasures")
            .expect(405)
            .then(({ body: { msg } }: { body: ErrorResponse }) => {
              expect(msg).to.equal("Method not allowed");
            });
        });
        return Promise.all(badPromises);
      });
    });
    describe("/users", () => {
      it("POST: 201 returns the sucessfully posted user object", () => {
        return request(app)
          .post("/api/users")
          .send({
            username: "jimmy",
            forename: "Jim",
            surname: "Jimson",
            subscribed_for_newsletter: true,
          })
          .expect(201)
          .then(({ body: { user } }: { body: UserResponse }) => {
            expect(user).to.have.keys(
              "username",
              "forename",
              "surname",
              "subscribed_for_newsletter"
            );
          });
      });
      it("POST: 422 returns the relevant error message when passed an empty body", () => {
        return request(app)
          .post("/api/users")
          .send({})
          .expect(422)
          .then(({ body: { msg } }: { body: ErrorResponse }) => {
            expect(msg).to.equal("invalid input");
          });
      });
      it("POST: 422 returns the relevant error message when passed an incorrect data type", () => {
        return request(app)
          .post("/api/users")
          .send({
            forename: "Jim",
            surname: "Jimson",
            subscribed_for_newsletter: "yes",
          })
          .expect(422)
          .then(({ body: { msg } }: { body: ErrorResponse }) => {
            expect(msg).to.equal("invalid input");
          });
      });
      it("POST: 405 returns an error message for an invalid request type", () => {
        const badMethods: CRUDMethods[] = ["get", "patch", "delete", "put"];
        const badPromises = badMethods.map((method) => {
          return request(app)
            [method]("/api/users")
            .expect(405)
            .then(({ body: { msg } }: { body: ErrorResponse }) => {
              expect(msg).to.equal("Method not allowed");
            });
        });
        return Promise.all(badPromises);
      });
    });
    describe("/users/:username", () => {
      it("GET: 200 returns the correct user", () => {
        return request(app)
          .get("/api/users/rgig")
          .expect(200)
          .then(({ body: { user } }: { body: UserResponse }) => {
            expect(user).to.deep.equal({
              username: "rgig",
              subscribed_for_newsletter: false,
              forename: "Ryan",
              surname: "Gislason",
              shop_name: "Kerluke - Koss",
            });
          });
      });
      it("GET: 404 returns the relevant error message when the user does not exist", () => {
        return request(app)
          .get("/api/users/75")
          .expect(404)
          .then(({ body: { msg } }: { body: ErrorResponse }) => {
            expect(msg).to.eql("not found");
          });
      });
      it("PATCH 200 returns ok when patched for newsletter patch", () => {
        return request(app)
          .patch("/api/users/laverne")
          .send({ newsletter: false })
          .expect(200)
          .then(({ body: { user } }: { body: UserResponse }) => {
            expect(user.subscribed_for_newsletter).to.eql(false);
          });
      });
      it("INVALID METHODS 405 returns an error message for an invalid request type", () => {
        const badMethods: CRUDMethods[] = ["post", "delete", "put"];
        const badPromises = badMethods.map((method) => {
          return request(app)
            [method]("/api/users/5")
            .expect(405)
            .then(({ body: { msg } }: { body: ErrorResponse }) => {
              expect(msg).to.equal("Method not allowed");
            });
        });
        return Promise.all(badPromises);
      });
    });
    describe("/sale", () => {
      it("POST: 202 returns a receipt for a successful sale", () => {
        return request(app)
          .post("/api/sale")
          .send({ treasure_id: 1, username: "laverne" })
          .expect(202)
          .then(({ body: { receipt } }: { body: SaleResponse }) => {
            expect(receipt).to.eql(
              "You purchased Open-architected Intelligent Wooden Salad from Kerluke - Koss, colour: BLUE"
            );
          });
      });
      it("POST 400 invalid treasureId", () => {
        return request(app)
          .post("/api/sale")
          .send({ treasure_id: "hi", username: "laverne" })
          .expect(400)
          .then(({ body: { msg } }: { body: ErrorResponse }) => {
            expect(msg).to.eql("bad request");
          });
      });

      it("POST 404 user not found", () => {
        return request(app)
          .post("/api/sale")
          .send({ treasure_id: 1, user_id: 152 })
          .expect(404)
          .then(({ body: { msg } }: { body: ErrorResponse }) => {
            expect(msg).to.eql("not found");
          });
      });
      it("POST 404 treasure not found", () => {
        return request(app)
          .post("/api/sale")
          .send({ treasure_id: 1234, username: "laverne" })
          .expect(404)
          .then(({ body: { msg } }: { body: ErrorResponse }) => {
            expect(msg).to.eql("not found");
          });
      });
      it("405 Invalid Methods", () => {
        const badMethods: CRUDMethods[] = ["get", "patch", "delete", "put"];
        const badPromises = badMethods.map((method) => {
          return request(app)
            [method]("/api/sale")
            .expect(405)
            .then(({ body: { msg } }: { body: ErrorResponse }) => {
              expect(msg).to.equal("Method not allowed");
            });
        });
        return Promise.all(badPromises);
      });
    });
  });
});
