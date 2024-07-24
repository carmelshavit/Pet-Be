import { request } from "supertest";
import { app } from "./express";
import { expect, test } from "vitest";

test("will GET /users", (done) => {
  request(app)
    .get("/users")
    .end((err, res) => {
      expect(res.status).toBe(200);
      done();
    });
});
test("will GET /users", (done) => {
  request(app)
    .get("/users")
    .end((err, res) => {
      expect(res.text).toBe("hello");
      done();
    });
});
