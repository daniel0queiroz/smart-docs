"use client"

import { useState } from 'react'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { logOutAction } from '@/actions/users'

function LogOutButton() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogOut = async () => {
        setLoading(true)

        const { errorMessage } = await logOutAction();

        if (!errorMessage) {
            toast.success("Você saiu", {
            description: "Você foi deslogado do sistema.",
            className: "bg-emerald-600 text-white border-emerald-700",
        })
        router.push("/");
        } else {
            toast.error("Erro", {
            description: errorMessage,
      })
        }
        
        setLoading(false)
    }

  return (
    <Button variant="outline"
    onClick={handleLogOut}
    disabled={loading}
    className='w-24'
    >
        {loading ? <Loader2 className='animate-spin' /> : "Sair"}
    </Button>
  );
}

export default LogOutButton