"use client"

import { Note } from "@prisma/client"

type Props = {
    notes: Note[];
}

function SidebarGroupContent({notes}: Props) {
    console.log(notes)
  return (
    <div>Suas notas aqui</div>
  )
}

export default SidebarGroupContent