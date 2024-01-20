// TODO: update this for drizzle

// // Import the necessary libraries
// import { PrismaClient } from "@prisma/client";
// import { Clerk } from "@clerk/clerk-sdk-node";

// // Initialize Prisma Client
// const prisma = new PrismaClient();

// // Set up Clerk client with your Clerk Backend API key
// const clerk = Clerk({ apiKey: process.env.CLERK_SECRET_KEY });

// async function fetchClerkUsersAndSyncRelations() {
//   // Fetch users from Clerk
//   const users = await clerk.users.getUserList({ limit: 500 });
//   console.log(`Fetched ${users.length} users from Clerk.`);

//   for (const user of users) {
//     // Upsert user to handle both new and existing records
//     await prisma.user.upsert({
//       where: {
//         email: user?.emailAddresses[0]?.emailAddress,
//       },
//       create: {
//         id: user.id,
//         username: user?.username || "",
//         email: user?.emailAddresses[0]?.emailAddress || "",
//         displayName:
//           user?.firstName || user?.lastName
//             ? `${user?.firstName || ""} ${user?.lastName || ""}`.trim()
//             : "",
//         imageUrl: user?.imageUrl || "",
//       },
//       update: {
//         id: user.id,
//         username: user?.username || "",
//         email: user?.emailAddresses[0]?.emailAddress || "",
//         displayName:
//           user?.firstName || user?.lastName
//             ? `${user?.firstName || ""} ${user?.lastName || ""}`.trim()
//             : "",
//         imageUrl: user?.imageUrl || "",
//         updatedAt: new Date(),
//       },
//     });
//     console.log(`User ${user.id} ${user.username} synchronized successfully.`);
//   }

//   await prisma.$disconnect();
// }

// // Run the function and handle any errors
// fetchClerkUsersAndSyncRelations()
//   .then(() => console.log("Users and relations synchronized successfully."))
//   .catch((error) =>
//     console.error("Error synchronizing users and relations:", error)
//   );
