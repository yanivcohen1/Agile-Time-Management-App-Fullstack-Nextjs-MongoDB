"use client";

import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import { InterWorkspaceSection } from "@/components/dashboard/InterWorkspaceSection";
import { useSession } from "@/hooks/useAuth";
import { tokenStorage } from "@/lib/http/token-storage";

export default function InterWorkspaceTwoPage() {
  const { data: session, isLoading: sessionLoading, isError: sessionError } = useSession();
  const hasToken = !!tokenStorage.getAccessToken();

  if ((!hasToken || sessionError) && !sessionLoading) {
    return (
      <Stack alignItems="center" justifyContent="center" minHeight="70vh" spacing={2}>
        <Typography variant="h5">Please sign in to see the Inter2 workspace.</Typography>
        <Button href="/login" variant="contained">
          Go to login
        </Button>
      </Stack>
    );
  }

  if (sessionLoading || !session) {
    return (
      <Stack alignItems="center" justifyContent="center" minHeight="70vh">
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <main>
      <Box sx={{ px: { xs: 2, md: 6 }, py: 6 }}>
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="h3" fontWeight={700}>
              Inter2 workspace
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track the second workspace stream and prototype shared tooling before promoting updates to the main admin flow.
            </Typography>
          </Stack>

          <InterWorkspaceSection />

          <Typography variant="subtitle1" color="text.secondary" textAlign="center">
            Admin console
          </Typography>
        </Stack>
      </Box>
    </main>
  );
}
