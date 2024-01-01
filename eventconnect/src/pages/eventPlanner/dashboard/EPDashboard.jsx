import { Container, Box } from "@mui/system";

export default function EPDashboard() {
  return (
    <>
      <Container maxWidth="md" sx={{ padding: 0 }}>
        <Box
          sx={{ bgcolor: "#cfe8fc", height: "100vh" }}
          marginX={{ xs: 0, md: 5 }}
        />
      </Container>
    </>
  );
}
