import { getServerSession } from "next-auth";
import { z } from "zod";

import { fetchRedis } from "@/helpers/redis";
import { addFriendValidator } from "@/lib/validations/add-friend";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email: emailToAdd } = addFriendValidator.parse(body.email);

    const idToAdd = (await fetchRedis(
      "get",
      `user:email:${emailToAdd}`
    )) as string;

    const session = await getServerSession(authOptions);

    if (!idToAdd) return new Response("User not found", { status: 400 });

    if (!session) return new Response("Unauthorized", { status: 401 });

    if (idToAdd === session.user.id)
      return new Response("You can't add yourself", { status: 400 });

    const isAlreadyAdded = await fetchRedis(
      "sismember",
      `user:${idToAdd}:incoming_friend_requests`,
      session.user.id
    );

    if (isAlreadyAdded) return new Response("Already added", { status: 400 });

    const isAlreadyFriends = await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      idToAdd
    );

    if (isAlreadyFriends)
      return new Response("Already friends", { status: 400 });

    db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id);

    return new Response("Friend request sent", { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError)
      return new Response("Invalid request payload", { status: 422 });

    return new Response("Invalid request", { status: 400 });
  }
}
