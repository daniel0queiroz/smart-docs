'use client';

import { useRouter } from "next/navigation";
import { CardContent, CardFooter } from "./ui/card";
import { toast } from "sonner";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useTransition } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { loginAction, signUpAction } from "@/actions/users";

type Props = {
   type: "login" | "signUp"; 
};

function AuthForm({ type }: Props) {
const isLoginForm = type === "login";

const router = useRouter();
const [isPending, startTransition] = useTransition();

const handleSubmit = (formData: FormData) => {
    
    startTransition(async () => {
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

    let errorMessage;
    let title;
    let description;
    

    if(isLoginForm) {
        errorMessage = (await loginAction(email, password)).errorMessage;
        title = "Logado"
        description = "Você efetuou login com sucesso."
    } else {
        errorMessage = (await signUpAction(email, password)).errorMessage;
        title = "Cadastrado"
        description = "Cheque seu email e clique no link de confirmação."
    }

    if (!errorMessage) {
        toast.success(title, {
            description,
        });

    router.replace("/");
    } else {
        toast.error("Error", {
        description: errorMessage,
        });
    }
    })
}
  return (
    <form action={handleSubmit}>
        <CardContent className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                id="email"
                name="email"
                placeholder="Digite seu email"
                type="email"
                required
                disabled={isPending}
                />
            </div>
            <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Senha</Label>
                <Input
                id="password"
                name="password"
                placeholder="Digite sua senha"
                type="password"
                required
                disabled={isPending}
                />
            </div>
        </CardContent>
        <CardFooter className="mt-6 flex flex-col gap-6">
            <Button className="w-full">
                {isPending ? <Loader2 className="animate-spin" /> : isLoginForm ? "Entrar" : "Cadastrar"}
            </Button>
            <p className="text-xs">
                {isLoginForm ? "Ainda não tem uma conta?" : "Já possui uma conta?"}{" "}
                <Link href={isLoginForm ? "/sign-up" : "/login"} className={`text-blue-500 underline ${isPending ? "pointer-events-none opacity-50" : ""}`}>
                   {isLoginForm ? "Cadastre-se" : "Login"}
                </Link>
            </p>
        </CardFooter>
    </form>
  )
}

export default AuthForm