import { getUser } from "@/auth/server";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { prisma } from "@/prisma/prisma";
import { Note } from "@prisma/client";
import Link from "next/link";
import SidebarGroupContent from "./SidebarGroupContent";

async function AppSidebar() {
const user = await getUser();

let notes: Note[] = []

if(user) {
    notes = await prisma.note.findMany({
        where: {
            authorId: user.id,
        },
        orderBy: {
            updatedAt: "desc",
        }
    })
}


  return (
    <Sidebar>
      <SidebarContent className="custom-scrollbar">
        <SidebarGroup>
            <SidebarGroupLabel className="mb-2 mt-2 text-lg">
                {user ? (
                    "Suas Notas"
                ) : (
                    <p>
                        <Link href="/login" className="underline">Login</Link>
                    </p>
                )}
            </SidebarGroupLabel>
            {user && <SidebarGroupContent />}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar;