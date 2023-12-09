"use client";
import { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";
import LoginIcon from "@mui/icons-material/Login";
import { MenuItem, Select } from "@mui/material";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  User,
} from "firebase/auth";
import { app } from "@/app/lib/config";
import { useRouter } from "next/navigation";

export default function Header() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [user, setUser] = useState<User | null>(null);

  const handleLanguageChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSelectedLanguage(event.target.value);
  };

  const auth = getAuth(app);
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (!user) {
        router.push("/");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [auth, router]);
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
              <div className={styles.name}>
                Del
                <span>Aqua</span>
              </div>
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
          {!user && (
            <Link href="/login" passHref>
              <Button
                variant="outlined"
                endIcon={<LoginIcon fontSize="small" />}
              >
                Log in
              </Button>
            </Link>
          )}
          {user && (
            <Box className={styles.loginMyaccountButtons}>
              <Link href="/">
                <Button
                  variant="outlined"
                  endIcon={<ExitToAppIcon fontSize="small" />}
                  onClick={handleLogout}
                >
                  Log out
                </Button>
              </Link>
              <Link href="/my_account">
                <Button
                  variant="outlined"
                  endIcon={
                    <AccountCircleOutlinedIcon fontSize="small" />
                  }
                >
                  My account
                </Button>
              </Link>
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
