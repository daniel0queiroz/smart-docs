"use client";
import NoteTextInput from "./NoteTextInput";

type Props = {
  noteId: string;
  startingNoteText: string;
};

export default function NoteTextInputClientWrapper(props: Props) {
  return <NoteTextInput {...props} />;
}
