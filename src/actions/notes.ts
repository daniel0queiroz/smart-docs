"use server"

import { getUser } from "@/auth/server"
import { handleError } from "@/lib/utils"
import openai from "@/openai";
import { prisma } from "@/prisma/prisma";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs"

export const createNoteAction = async (noteId: string) => {
    try {
        const user = await getUser();
        if(!user) throw new Error("Você deve estar logado para criar uma anotação")

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
        if(!user) throw new Error("Você deve estar logado para atualizar uma anotação")

        const note = await prisma.note.create({
            data: { 
                id: noteId,
                authorId: user.id,
                text: "",
                updatedAt: new Date(),
             },
        })

        return {errorMessage: null, noteId: note.id}
    } catch (error) {
        return handleError(error)
    }
}

export const deleteNoteAction = async (noteId: string) => {
    try {
        const user = await getUser();
        if(!user) throw new Error("Você deve estar logado para deletar uma anotação")

        await prisma.note.delete({
            where: { id: noteId, authorId: user.id }
        })

        return {errorMessage: null}
    } catch (error) {
        return handleError(error)
    }
}

export const askAIAboutNotesAction = async (newQuestions: string[], responses: string[]) => {
        const user = await getUser();
        if(!user) throw new Error("Você deve estar logado para fazer perguntas à IA")

        const notes = await prisma.note.findMany({
            where: { authorId: user.id },
            orderBy: { createdAt: "desc"},
            select: {text: true, createdAt: true, updatedAt: true}
        })

        if (notes.length === 0) {
            return "Você ainda não possui nenhuma anotação"
        }

        const formattedNotes = notes
        .map(
            (note: { text: string; createdAt: Date; updatedAt: Date }) => 
            `
            Texto: ${note.text},
            Criado em: ${note.createdAt}
            Última atualização: ${note.updatedAt}
            `.trim(),
        )
        .join("\n");

            const messages: ChatCompletionMessageParam[] = [
                {
                role: "developer",
                content: `
                    Você é um assistente útil que responde perguntas sobre as anotações do usuário. 
                    Considere que todas as perguntas estão relacionadas às anotações do usuário. 
                    Garanta que suas respostas não sejam muito verbosas e que você fale de forma sucinta. 
                    Suas respostas DEVEM ser formatadas em HTML limpo e válido, com estrutura adequada. 
                    Use tags como <p>, <strong>, <em>, <ul>, <ol>, <li>, <h1> a <h6> e <br> quando apropriado. 
                    NÃO envolva toda a resposta em uma única tag <p> a menos que seja um único parágrafo. 
                    Evite estilos inline, JavaScript ou atributos personalizados.

                    Renderizado assim em JSX:
                    <p dangerouslySetInnerHTML={{ __html: SUA_RESPOSTA }} />

                    Aqui estão as anotações do usuário:
                    ${formattedNotes}
                    `,
                },
            ];

            for (let i = 0; i < newQuestions.length; i++) {
                messages.push({ role: "user", content: newQuestions[i] })
                if(responses.length > i) {
                    messages.push({ role: "assistant", content: responses[i] })
                }
            }

            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages
            })

            return completion.choices[0].message.content || "Ocorreu um erro ao utilizar IA"}