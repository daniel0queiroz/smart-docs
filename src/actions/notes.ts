"use server"

import { getUser } from "@/auth/server"
import { handleError } from "@/lib/utils"
import { prisma } from "@/prisma/prisma";

export const createNoteAction = async (noteId: string) => {
    try {
        const user = await getUser();
        if(!user) throw new Error("Você deve estar logado para criar uma nota.")

        await prisma.note.create({
            data: { 
                id: noteId,
                authorId: user.id,
                text: ""
             },
        })

        return {errorMessage: null}
    } catch (error) {
        return handleError(error)
    }
}

export const updateNoteAction = async (noteId: string, text: string) => {
    try {
        const user = await getUser();
        if(!user) throw new Error("Você deve estar logado para atualizar uma nota.")

        await prisma.note.update({
            where: { id: noteId },
            data: { text },
        })

        return {errorMessage: null}
    } catch (error) {
        return handleError(error)
    }
}