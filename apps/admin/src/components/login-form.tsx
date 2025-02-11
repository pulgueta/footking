import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, redirect } from "@tanstack/react-router";
import { toast } from "sonner";
// import { KeyRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { signIn } from "@/lib/auth-client";
import { loginSchema } from "@/schemas";
import { Heading, Paragraph } from "@/components/ui/typography";
// import { Separator } from "@/components/ui/separator";

// @ts-ignore
import fieldImage from "../../public/field.webp";
import { Checkbox } from "./ui/checkbox";

type Login = Pick<Parameters<typeof signIn.email>["0"], "email" | "password" | "rememberMe">;

export const LoginForm = () => {
  const form = useForm<Login>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      password: "",
      email: "",
      rememberMe: false,
    },
  });

  const isDisabled = form.formState.isSubmitting;

  const onSubmit = form.handleSubmit(async (values) => {
    const req = signIn.email(values, {
      onSuccess: ({ data }) => {
        redirect({
          to: "/$id",
          params: {
            id: data.user.id,
          },
        });
      },
    });

    toast.promise(req, {
      loading: "Iniciando sesión...",
      success: "¡Bienvenido de vuelta!",
      error: "Credenciales inválidas",
    });
  });

  return (
    <div className="flex w-full max-w-sm flex-col gap-4 md:max-w-4xl">
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form onSubmit={onSubmit} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <Heading as="h3">Bienvenido de vuelta</Heading>
                  <Paragraph muted center weight="normal">
                    Inicia sesión para continuar
                  </Paragraph>
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo electrónico</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isDisabled}
                          placeholder="tucorreo@electroni.co"
                          type="email"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center justify-between">
                        Contraseña{" "}
                        <Link
                          to="/"
                          href="#"
                          className="ml-auto font-normal text-xs underline-offset-2 hover:underline"
                        >
                          ¿Olvidaste tu contraseña?
                        </Link>
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isDisabled}
                          placeholder="*********"
                          type="password"
                          autoComplete="current-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center gap-x-2">
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isDisabled}
                          />
                          <FormLabel>Recordarme</FormLabel>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button className="w-full" disabled={isDisabled}>
                  Iniciar sesión
                </Button>

                {/* <Separator />

                <Button variant="outline" className="w-full">
                  <KeyRound size={16} />
                  Iniciar sesión con Biometría
                </Button> */}
              </div>
            </form>
          </Form>
          <div className="relative hidden bg-muted md:block">
            <img
              src={fieldImage}
              alt="Image"
              className="absolute h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
