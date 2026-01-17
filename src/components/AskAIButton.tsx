"use client"

import { User } from "@supabase/supabase-js";

type Props = {
    user: User | null;
}

function AskAIButton({ user }: Props) {
    console.log(user?.email)
  return (
    <div>Pergunte à IA</div>
  )
}

export default AskAIButton