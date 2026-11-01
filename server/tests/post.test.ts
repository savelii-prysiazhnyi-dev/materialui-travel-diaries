import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("Post Validation & Endpoints", () => {
  it("should reject post creation when required fields are missing", async () => {
    const res = await request(app)
      .post("/api/posts")
      .send({ title: "My Trip" });

    expect(res.status).toBe(422);
    expect(res.body.message).toContain("required");
  });

  it("should reject post creation with invalid user ID format", async () => {
    const res = await request(app)
      .post("/api/posts")
      .send({
        title: "Kyoto Autumn",
        description: "Temples and gardens in Kyoto",
        image: "https://example.com/kyoto.jpg",
        location: "Kyoto, Japan",
        date: "2026-10-15",
        user: "invalid-user-id"
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain("Invalid user ID format");
  });

  it("should reject get post by invalid ID format", async () => {
    const res = await request(app).get("/api/posts/not-an-objectid");
    expect(res.status).toBe(400);
    expect(res.body.message).toContain("Invalid post ID format");
  });

  it("should reject update post by invalid ID format", async () => {
    const res = await request(app).put("/api/posts/not-an-objectid").send({ title: "Updated" });
    expect(res.status).toBe(400);
    expect(res.body.message).toContain("Invalid post ID format");
  });

  it("should reject delete post by invalid ID format", async () => {
    const res = await request(app).delete("/api/posts/not-an-objectid");
    expect(res.status).toBe(400);
    expect(res.body.message).toContain("Invalid post ID format");
  });
});
