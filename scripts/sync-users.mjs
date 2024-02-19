import "dotenv/config";

// Import the necessary libraries
import { Clerk } from "@clerk/clerk-sdk-node";
import fs from "fs";

// Set up Clerk client with your Clerk Backend API key
const clerkProd = Clerk({ secretKey: process.env.CLERK_SECRET_KEY_PROD });
const clerkDev = Clerk({ secretKey: process.env.CLERK_SECRET_KEY_DEV });

async function getClerkUsersProd() {
  try {
    // Fetch users from Clerk
    const users = await clerkProd.users.getUserList({ limit: 500 });
    console.log(`Fetched ${users.length} users from Clerk.`);
    return users;
  } catch (error) {
    console.error("Failed to fetch users from production:", error);
    throw error; // Rethrow the error if you want to handle it further up the chain.
  }
}

async function deleteAllClerkUsersDev() {
  try {
    // Fetch users from Clerk
    const users = await clerkDev.users.getUserList({ limit: 500 });
    console.log(`Fetched ${users.length} users from Clerk.`);
    let deletedUsersCount = 0; // Initialize as let to increment it.
    // Delete all users from Clerk
    for (const user of users) {
      await clerkDev.users.deleteUser(user.id);
      console.log(`Deleted user ${user.id} from Clerk.`);
      deletedUsersCount++;
    }
    console.log(`Deleted ${deletedUsersCount} users from Clerk.`);
  } catch (error) {
    console.error("Failed to delete users from development:", error);
    throw error; // Rethrow the error if you want to handle it further up the chain.
  }
}

async function saveUsersToFile(users) {
  try {
    const usersJson = JSON.stringify(users);
    fs.writeFileSync("scripts/migration-script/users.json", usersJson);
    console.log(`Saved ${users.length} users to users.json`);
  } catch (error) {
    console.error("Failed to save users to file:", error);
    throw error; // Rethrow the error if you want to handle it further up the chain.
  }
}

async function main() {
  try {
    // Fetch users from Clerk
    const users = await getClerkUsersProd();
    // Save users to file
    await saveUsersToFile(users);
    // Delete all users from Clerk
    // await deleteAllClerkUsersDev();
    console.log("Saved production users to file complete.");
    await deleteAllClerkUsersDev();
    console.log("Deleted development users complete.");
  } catch (error) {
    console.error("An error occurred during the sync process:", error);
  }
}

main();
