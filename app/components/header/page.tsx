"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";
import LoginIcon from "@mui/icons-material/Login";
import { MenuItem, Select } from "@mui/material";

export default function Header() {
  const [selectedLanguage, setSelectedLanguage] =
    React.useState("en");

  const handleLanguageChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSelectedLanguage(event.target.value);
  };
  return (
    <Box className={styles.container} sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Link href="/">
            <Image
              src="/water.svg"
              alt="DelAqua logo"
              width={50}
              height={50}
            />
          </Link>
          <Box className={styles.name_container} sx={{ flexGrow: 1 }}>
            <Link href="/">
              <Typography
                className={styles.name}
                variant="h6"
                component="div"
                sx={{ flexGrow: 1 }}
              >
                Del
                <span>Aqua</span>
              </Typography>
            </Link>

            <p className={styles.name_descr}>
              We deliver spring water in Limassol
            </p>
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Select
              className={styles.language}
              value={selectedLanguage}
              onChange={handleLanguageChange}
            >
              <MenuItem value="en">🇺🇸</MenuItem>
              <MenuItem value="es">🇪🇸</MenuItem>
              <MenuItem value="fr">🇬🇷</MenuItem>
              <MenuItem value="ua">🇺🇦</MenuItem>
            </Select>
          </Box>
          <Button
            variant="outlined"
            endIcon={<LoginIcon fontSize="small" />}
          >
            Log in
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
