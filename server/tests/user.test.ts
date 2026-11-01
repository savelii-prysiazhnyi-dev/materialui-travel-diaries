import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("User Authentication Validation", () => {
  it("should reject signup when required fields are missing", async () => {
    const res = await request(app)
      .post("/api/user/signup")
      .send({ email: "test@example.com" });

    expect(res.status).toBe(422);
    expect(res.body.message).toContain("required");
  });

  it("should reject signup when password is too short", async () => {
    const res = await request(app)
      .post("/api/user/signup")
      .send({ name: "Alex", email: "alex@example.com", password: "123" });

    expect(res.status).toBe(422);
    expect(res.body.message).toContain("at least 6 characters");
  });

  it("should reject login when credentials are missing", async () => {
    const res = await request(app)
      .post("/api/user/login")
      .send({ email: "test@example.com" });

    expect(res.status).toBe(422);
    expect(res.body.message).toContain("required");
  });

  it("should reject user lookup with invalid ID format", async () => {
    const res = await request(app).get("/api/user/invalid-id-123");
    expect(res.status).toBe(400);
    expect(res.body.message).toContain("Invalid user ID");
  });
});
