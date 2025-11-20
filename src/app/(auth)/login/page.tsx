"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, Stack, Typography } from "@mui/material";
import { AuthForm } from "@/components/auth/AuthForm";
import { useLogin } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { mutateAsync, isPending, error } = useLogin();

  return (
    <main>
      <Stack alignItems="center" justifyContent="center" minHeight="100vh" px={2}>
        <Card sx={{ width: "100%", maxWidth: 420 }}>
          <CardContent>
            <AuthForm
              mode="login"
              isLoading={isPending}
              error={error?.message ?? null}
              onSubmit={async (values) => {
                await mutateAsync(values);
                router.replace("/dashboard");
              }}
            />
            <Typography variant="body2" mt={3} textAlign="center">
              Need an account? <Link href="/register">Create one</Link>
            </Typography>
          </CardContent>
        </Card>
      </Stack>
    </main>
  );
}
