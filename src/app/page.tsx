"use client";

import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Box
        sx={{
          px: { xs: 3, md: 8 },
          py: { xs: 8, md: 12 },
          display: "grid",
          gap: 6,
        }}
      >
        <Chip label="Next.js + MikroORM" color="primary" sx={{ width: "fit-content" }} />
        <Stack spacing={3} maxWidth={640}>
          <Typography variant="h2" component="h1" fontWeight={700}>
            Ship fast, stay organized, and keep every todo in sync.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            EdgeStack Todos pairs a Material UI experience with MikroORM + Mongo,
            JWT auth, and rate limiting. Use it as a starter for secure,
            filterable, real-time friendly task boards without extra container
            dependencies.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button component={Link} href="/login" size="large">
              Sign in
            </Button>
            <Button
              component={Link}
              href="/register"
              size="large"
              variant="outlined"
            >
              Create an account
            </Button>
          </Stack>
        </Stack>
      </Box>
    </main>
  );
}
