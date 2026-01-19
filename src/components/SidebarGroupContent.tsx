"use client"

import { SidebarGroupContent as SidebarGroupContentShadCN, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import type { Note } from "@prisma/client";
import { SearchIcon } from "lucide-react";
import { Input } from "./ui/input";
import { useState, useMemo } from "react";
import Fuse from "fuse.js";
import SelectNoteButton from "./SelectNoteButton";
import DeleteNoteButton from "./DeleteNoteButton";
import { useNotesSWR } from "@/hooks/useNotesSWR";

function SidebarGroupContent() {
  const [searchText, setSearchText] = useState("");
  const { notes, isLoading, mutate } = useNotesSWR();

  const fuse = useMemo(() => {
    return new Fuse(notes, {
      keys: ["text"],
      threshold: 0.4,
    });
  }, [notes]);

  const filteredNotes = searchText ? fuse.search(searchText).map((result) => result.item) : notes;

  const deleteNoteLocally = async (noteId: string) => {
    await mutate();
  };

  if (isLoading) {
    return <div className="p-4">Carregando notas...</div>;
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
        {filteredNotes.map((note: Note) => (
          <SidebarMenuItem key={note.id} className="group/item">
            <SelectNoteButton note={note} />
            <DeleteNoteButton noteId={note.id} deleteNoteLocally={deleteNoteLocally} />
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroupContentShadCN>
  );
}

export default SidebarGroupContent