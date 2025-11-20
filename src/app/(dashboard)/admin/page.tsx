"use client";

import { Box, Button, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import { InterWorkspaceSection } from "@/components/dashboard/InterWorkspaceSection";
import { useSession } from "@/hooks/useAuth";
import { tokenStorage } from "@/lib/http/token-storage";

export default function AdminPage() {
  const { data: session, isLoading: sessionLoading, isError: sessionError } = useSession();
  const hasToken = !!tokenStorage.getAccessToken();

  if ((!hasToken || sessionError) && !sessionLoading) {
    return (
      <Stack alignItems="center" justifyContent="center" minHeight="70vh" spacing={2}>
        <Typography variant="h5">Please sign in to access the admin console.</Typography>
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
              Admin console
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage roles, enforce rate limits, and review access logs across the workspace.
            </Typography>
          </Stack>

          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Stack spacing={1.5}>
              <Typography variant="h6">Security overview</Typography>
              <Typography variant="body2" color="text.secondary">
                This placeholder area is where you would surface guardrail metrics, API quotas, and access history. Hook it
                up to MikroORM queries or telemetry as you grow the project.
              </Typography>
            </Stack>
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <InterWorkspaceSection />
          </Paper>
        </Stack>
      </Box>
    </main>
  );
}
