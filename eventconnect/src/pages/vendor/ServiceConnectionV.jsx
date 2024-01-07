import { Grid, Paper } from "@mui/material";
import { Box } from "@mui/system";
import MaxWidthContainer from "../../components/MaxWidthContainer";
import { Header1, Header2 } from "../../components/Texts/TextHeaders";
import ChatBox from "../../components/ChatBox";

export default function ServiceConnectionV() {
  return (
    <>
      <Header1>Connection</Header1>
      <MaxWidthContainer maxWidth="lg" centered>
        <Paper>
          <Box padding={2}>
            <Box paddingX={5}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Header2>Connection</Header2>
                </Grid>
                <Grid item xs={12}>
                  <ChatBox />
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Paper>
      </MaxWidthContainer>
    </>
  );
}
