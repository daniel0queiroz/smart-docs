import { getUser } from "@/auth/server";
import AskAIButton from "@/components/AskAIButton";
import NewNoteButton from "@/components/NewNoteButton";
import NoteTextInput from "@/components/NoteTextInput";
import { prisma } from "@/prisma/prisma";
import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{[key: string]: string | string[] | undefined}>;
}

async function HomePage({searchParams}: Props) {
  const noteIdParam = (await searchParams).noteId;
  const user = await getUser();

  // If user is logged out, send back to login to show the auth form
  if (!user) {
    redirect("/login");
  }

  let noteId = Array.isArray(noteIdParam) ? noteIdParam![0] : noteIdParam || "";
  let note = null;

  if (noteId) {
    note = await prisma.note.findUnique({
      where: { id: noteId, authorId: user.id },
    });
  }

  // Se não houver noteId ou a nota não existir, buscar a primeira nota do usuário
  if (!noteId || !note) {
    const firstNote = await prisma.note.findFirst({
      where: { authorId: user.id },
      orderBy: { updatedAt: "desc" },
    });
    if (firstNote) {
      redirect(`/?noteId=${firstNote.id}`);
    }
    // Se não houver nenhuma nota, noteId permanece vazio
  }

  return (
    <div className="flex h-full flex-col items-center gap-4">
      <div className="flex w-full max-w-4xl justify-end gap-2">
        <AskAIButton user={user}/>
        <NewNoteButton user={user} />
      </div>
      <NoteTextInput noteId={noteId} startingNoteText={note?.text || ""} />
    </div>
  );
}

export default HomePage;
