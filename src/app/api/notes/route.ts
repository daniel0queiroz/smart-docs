import { getUser } from "@/auth/server";
import { prisma } from "@/prisma/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getUser();
  if (!user) {
    return new NextResponse(JSON.stringify({ notes: [] }), {
      status: 401,
      headers: { 'Cache-Control': 'no-store' },
    });
  }
  const notes = await prisma.note.findMany({
    where: { authorId: user.id },
    orderBy: { updatedAt: "desc" },
  });
  return new NextResponse(JSON.stringify({ notes }), {
    status: 200,
    headers: { 'Cache-Control': 'no-store' },
  });
}
