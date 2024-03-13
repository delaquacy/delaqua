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
import { CircularProgress, MenuItem, Select } from "@mui/material";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  User,
} from "firebase/auth";
import { app } from "@/app/lib/config";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import "../../i18n";
import Login, { LogInProps } from "../login/page";
import { AccountCircle } from "@mui/icons-material";

export default function Header() {
  const { i18n } = useTranslation();
  const { t } = useTranslation("home");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const handleLoginToggle = () => {
    setShowLogin((prevShowLogin) => !prevShowLogin);
  };

  const handleLanguageChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    const languageValue = event.target.value as string;
    i18n.changeLanguage(languageValue);
    setSelectedLanguage(languageValue);
  };
  const handleLogin = () => {
    setShowLogin(false);
  };

  const auth = getAuth(app);
  const router = useRouter();
  const pathname = usePathname();
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (pathname == "/my_account") {
      setShowLogin(false);
    }
  }, [pathname, router]);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [auth, router]);
  const loginProps: LogInProps = {
    params: { onLogin: handleLogin },
  };

  return (
    <Box className={styles.container} sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar className={styles.toolbar}>
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
          <Box
            className={styles.languageContainer}
            sx={{ flexGrow: 1 }}
          >
            <Select
              className={styles.language}
              value={selectedLanguage}
              onChange={handleLanguageChange}
            >
              <MenuItem value="en">EN</MenuItem>
              <MenuItem value="el">EL</MenuItem>
              <MenuItem value="ua">UA</MenuItem>
              <MenuItem value="ru">RU</MenuItem>
            </Select>
          </Box>
          {showLogin && <Login {...loginProps} />}
          <div className={styles.buttonsContainer}>
            {loading ? (
              <div className={styles.loadingContainer}>
                <CircularProgress size={20} />
              </div>
            ) : (
              <>
                {!user && (
                  <Button
                    variant="contained"
                    endIcon={<LoginIcon fontSize="small" />}
                    onClick={handleLoginToggle}
                  >
                    Log in
                  </Button>
                )}
                {user && (
                  <>
                    <Box className={styles.loginMyaccountButtons}>
                      <Link href="/my_account">
                        <Button
                          variant="contained"
                          endIcon={<AccountCircle fontSize="small" />}
                        >
                          My account
                        </Button>
                      </Link>
                      <Link href="/">
                        <Button
                          variant="contained"
                          endIcon={<ExitToAppIcon fontSize="small" />}
                          onClick={handleLogout}
                        >
                          Log out
                        </Button>
                      </Link>
                    </Box>
                    <Box className={styles.mobileScreen}>
                      <Link href="/my_account">
                        <AccountCircle
                          color="primary"
                          fontSize="small"
                        />
                      </Link>
                      <Link href="/">
                        <ExitToAppIcon
                          color="primary"
                          onClick={handleLogout}
                          fontSize="small"
                        />
                      </Link>
                    </Box>
                  </>
                )}
              </>
            )}
          </div>
        </Toolbar>
        {/* <div style={{ margin: "10px" }}>
          {loading ? (
            <CircularProgress size={20} />
          ) : (
            <>
              {!user && (
                <Button
                  variant="contained"
                  endIcon={<LoginIcon fontSize="small" />}
                  onClick={handleLoginToggle}
                >
                  Log in
                </Button>
              )}
              {user && (
                <>
                  <Box className={styles.loginMyaccountButtons}>
                    <Link href="/my_account">
                      <Button
                        variant="contained"
                        endIcon={<AccountCircle fontSize="small" />}
                      >
                        My account
                      </Button>
                    </Link>
                    <Link href="/">
                      <Button
                        variant="contained"
                        endIcon={<ExitToAppIcon fontSize="small" />}
                        onClick={handleLogout}
                      >
                        Log out
                      </Button>
                    </Link>
                  </Box>
                  <Box className={styles.mobileScreen}>
                    <Link href="/my_account">
                      <Button
                        variant="contained"
                        endIcon={<AccountCircle fontSize="small" />}
                      >
                        My account
                      </Button>
                    </Link>
                    <Link href="/">
                      <Button
                        variant="contained"
                        endIcon={<ExitToAppIcon fontSize="small" />}
                      >
                        Log out
                      </Button>
                    </Link>
                  </Box>
                </>
              )}
            </>
          )}
        </div> */}
      </AppBar>
    </Box>
  );
}
