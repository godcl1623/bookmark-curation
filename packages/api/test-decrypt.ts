import { PrismaClient } from "../../generated/prisma";
import * as bookmarkService from "./src/services/bookmarks";

const prisma = new PrismaClient();

async function test() {
  try {
    // Get first user
    const user = await prisma.users.findFirst();
    if (!user) {
      console.log("No users found");
      return;
    }

    console.log("Testing bookmark service...\n");

    // Get bookmarks using service
    const bookmarks = await bookmarkService.getAllBookmarks(user.id);

    console.log("Number of bookmarks:", bookmarks.length);

    if (bookmarks.length > 0) {
      const first = bookmarks[0];
      console.log("\nFirst bookmark:");
      console.log("- ID:", first.id);
      console.log("- Title:", first.title);
      console.log("- URL:", first.url);
      console.log("- Description:", first.description);

      if (first.folders) {
        console.log("- Folder title:", first.folders.title);
      }

      if (first.tags && first.tags.length > 0) {
        console.log("- First tag name:", first.tags[0].name);
      }
    }

    // Compare with raw database
    const raw = await prisma.bookmarks.findFirst({
      where: { user_id: user.id, deleted_at: null },
    });

    console.log("\n\nRaw database data:");
    console.log("- Title (encrypted):", raw?.title?.substring(0, 50) + "...");
    console.log("- URL (encrypted):", raw?.url?.substring(0, 50) + "...");

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
