// import { Grid, Paper } from "@mui/material";
// import { useNavigate } from "react-router-dom";

// export default function GridCard({
//   hasDelete,
//   id,
//   handleDelete,
//   handleClick,
//   isLoading,
//   children,
// }) {
//   const styles = {
//     minHeight: "200px",
//     height: "100%",
//   };
//   const navigate = useNavigate();

//   return (
//     <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
//       <Paper
//         onClick={() => {
//           handleClick(id);
//         }}
//         style={styles}
//       >
//         <span>{children}</span>
//         {hasDelete && (
//           <button
//             disabled={isLoading}
//             onClick={(evt) => {
//               evt.stopPropagation();
//               handleDelete(id);
//             }}
//           >
//             QUICK DELETE
//           </button>
//         )}
//       </Paper>
//     </Grid>
//   );
// }
