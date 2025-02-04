import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { signUp } from "@/lib/auth-client";
import { loginSchema } from "@/schemas";

// @ts-ignore
import fieldImage from "../../public/anotherfield.webp";

type Register = Omit<Parameters<typeof signUp.email>["0"], "fetchOptions" | "callbackURL">;

export const RegisterForm = () => {
  const form = useForm<Register>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      image: "",
      name: "",
      password: "",
      phoneNumber: "",
    },
  });

  const isDisabled = form.formState.isSubmitting;

  console.log(form.getValues());

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const req = await signUp.email(values);

      console.log(req);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <div className="flex w-full max-w-sm flex-col gap-4 md:max-w-4xl">
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="relative hidden bg-muted md:block">
            <img
              src={fieldImage}
              alt="Image"
              className="absolute h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
          <Form {...form}>
            <form onSubmit={onSubmit} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Gerardo"
                          autoComplete="name"
                          disabled={isDisabled}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo electrónico</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="tucorreo@electroni.co"
                          type="email"
                          autoComplete="email"
                          disabled={isDisabled}
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
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="*********"
                          type="password"
                          autoComplete="new-password"
                          disabled={isDisabled}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de teléfono</FormLabel>
                      <FormControl>
                        {/* @ts-ignore */}
                        <Input
                          placeholder="3014224003"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          disabled={isDisabled}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button className="w-full" disabled={isDisabled}>
                  {isDisabled ? "Registrando..." : "Registrarse"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
