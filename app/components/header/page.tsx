import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import styles from "./page.module.css";
import Image from "next/image";
export default function Header() {
  return (
    <Box className={styles.container} sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Image
            src="/water.svg"
            alt="DelAqua logo"
            width={50}
            height={50}
          />
          <Box className={styles.name_container} sx={{ flexGrow: 1 }}>
            <Typography
              className={styles.name}
              variant="h6"
              component="div"
              sx={{ flexGrow: 1 }}
            >
              Del
              <span>Aqua</span>
            </Typography>
            <Typography className={styles.name_descr}>
              We deliver spring water in Limassol
            </Typography>
          </Box>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
