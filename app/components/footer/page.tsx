import { Box } from "@mui/material";
import styles from "./page.module.css";
export default function Footer() {
  return (
    <Box className={styles.container} sx={{ flexGrow: 1 }}>
      Some information
    </Box>
  );
}
