import { authenticate } from "../shopify.server";
import { PrismaClient } from "@prisma/client";

export const loader = async ({ request }) => {
  const { shop } = await authenticate.public.appProxy(request);
  const db = new PrismaClient();
  let settings = await db.settings.findUnique({ where: { shop } });
  await db.$disconnect();
  const result = settings || {
    buttonText: "Add to Wishlist",
    buttonColor: "#e44444",
    buttonStyle: "Icon + Text",
    iconStyle: "❤️",
    buttonPosition: "Bottom Right"
  };
  return Response.json(result, {
    headers: { "Access-Control-Allow-Origin": "*" }
  });
};
