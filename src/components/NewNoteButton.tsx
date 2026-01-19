"use client"

import { User } from "@supabase/supabase-js"
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {v4 as uuidv4} from 'uuid';
import { createNoteAction } from "@/actions/notes";


type Props = {
    user: User | null
}

function NewNoteButton({user}: Props) {
    const router = useRouter();

    const [loading, setLoading] = useState(false)

    const handleClickNewNoteButton = async () => {
      if(!user) {
        router.push("/login")
      } else {
        setLoading(true)

        // Cria a nota no backend e obtém o id real
        const uuid = uuidv4();
        const result = await createNoteAction(uuid);
        // Se houver erro, não redireciona
        if (result?.errorMessage) {
          setLoading(false);
          // Aqui você pode exibir um toast de erro se quiser
          return;
        }
        router.push(`/?noteId=${uuid}`);
        setLoading(false);
      }
    }
  return (
  <Button
    onClick={handleClickNewNoteButton}
    variant="secondary"
    className="W-24"
    disabled={loading}
  >
    {loading ? <Loader2 className="animate-spin" /> : "Nova Anotação"}
  </Button>
  );
}

export default NewNoteButton