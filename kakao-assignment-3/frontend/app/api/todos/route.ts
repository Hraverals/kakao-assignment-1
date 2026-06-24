import { type NextRequest } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL!;

// GET /api/todos → 백엔드 GET /todos 프록시
export async function GET() {
  const res = await fetch(`${BACKEND_URL}/todos`, { cache: "no-store" });
  const data = await res.json();
  return Response.json(data, { status: res.status });
}

// POST /api/todos → 백엔드 POST /todos 프록시
export async function POST(request: NextRequest) {
  const body = await request.json();
  const res = await fetch(`${BACKEND_URL}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return Response.json(data, { status: res.status });
}
