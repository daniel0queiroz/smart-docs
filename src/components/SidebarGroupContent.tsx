"use client"

import { Note } from "@prisma/client"
import { SidebarGroupContent as SidebarGroupContentShadCN, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar"
import { SearchIcon } from "lucide-react";
import { Input } from "./ui/input";
import { useEffect, useMemo, useState } from "react";
import Fuse from "fuse.js"
import SelectNoteButton from "./SelectNoteButton";
import DeleteNoteButton from "./DeleteNoteButton";
import { useSearchParams } from "next/navigation";
import useNote from "@/hooks/useNote";

type Props = {
    notes: Note[];
}

function SidebarGroupContent({ notes }: Props) {
    const [searchText, setSearchText] = useState("")
    const [localNotes, setLocalNotes] = useState(notes)
    const noteIdParam = useSearchParams().get("noteId") || "";
    const { noteText } = useNote();

    useEffect(() => {
      setLocalNotes(notes)
    }, [notes])

    // Add newly created note to sidebar if it doesn't exist yet
    useEffect(() => {
      if (!noteIdParam) return;
      setLocalNotes((prev) => {
        const exists = prev.some((n) => n.id === noteIdParam);
        if (exists) return prev;
        // Create empty note placeholder for the new note
        const newNote: Note = {
          id: noteIdParam,
          text: "",
          authorId: "",
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        return [newNote, ...prev];
      });
    }, [noteIdParam]);

    const fuse = useMemo(() => {
      return new Fuse(localNotes, {
        keys: ["text"],
        threshold: 0.4
      })
    }, [localNotes])

    const filteredNotes = searchText ? fuse.search(searchText).map(result => result.item) : localNotes;

    const deleteNoteLocally = (noteId: string) => {
      setLocalNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
    }
  return (
    <SidebarGroupContentShadCN>
      <div className="relative flex items-center">
        <SearchIcon className="absolute left-2 size-4" />
        <Input
        className="bg-muted pl-8"
        placeholder="Pesquisar suas anotações..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      <SidebarMenu className="mt-4">
        {filteredNotes.map((note) => (
          <SidebarMenuItem key={note.id} className="group/item">
            <SelectNoteButton note={note} />
            <DeleteNoteButton noteId={note.id}
            deleteNoteLocally={deleteNoteLocally}
            />
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroupContentShadCN>
  )
}

export default SidebarGroupContent