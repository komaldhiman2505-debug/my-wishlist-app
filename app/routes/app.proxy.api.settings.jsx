import { PrismaClient } from "@prisma/client";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  const db = new PrismaClient();
  let settings = shop ? await db.settings.findUnique({ where: { shop } }) : null;
  await db.$disconnect();
  const result = settings || {
    buttonText: "Add to Wishlist",
    buttonColor: "#e44444",
    buttonStyle: "Icon + Text",
    iconStyle: "❤️",
    buttonPosition: "Bottom Right"
  };
  return Response.json(result, {
    headers: { 
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json"
    }
  });
};
