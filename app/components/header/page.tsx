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
import { useToggle } from "@/app/lib/ToggleContext";
import useAmplitudeContext from "@/app/utils/amplitudeHook";

export default function Header() {
  const { i18n } = useTranslation();
  const { t } = useTranslation("main");
  const { trackAmplitudeEvent } = useAmplitudeContext();
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isToggled, setToggle } = useToggle();

  const router = useRouter();
  const auth = getAuth(app);
  const pathname = usePathname();

  useEffect(() => {
    if (isToggled && !user) {
      setShowLogin(true);
      trackAmplitudeEvent("loginFromMainPage", {
        text: "Login from main page",
      });
    }
    if (user && isToggled) {
      router.push("my_account");
    }
  }, [isToggled]);

  const handleLoginToggle = () => {
    setShowLogin((prevShowLogin) => !prevShowLogin);
    trackAmplitudeEvent("loginFromHeader", {
      text: "Login from header",
    });
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "en";
    i18n.changeLanguage(savedLanguage);
    setSelectedLanguage(savedLanguage);
  }, []);

  const handleLanguageChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    const languageValue = event.target.value as string;
    i18n.changeLanguage(languageValue);
    setSelectedLanguage(languageValue);
    localStorage.setItem("language", languageValue);
  };
  const handleLogin = () => {
    setToggle(false);
    setShowLogin(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);

      router.push("/");
      trackAmplitudeEvent("logOut", {
        text: "Log out",
      });
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
              src="/water.png"
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

          {showLogin && <Login {...loginProps} />}
          <div className={styles.buttonsContainer}>
            <Box style={{ marginRight: "5px" }}>
              <Select
                className={styles.language}
                value={selectedLanguage}
                onChange={handleLanguageChange}
              >
                <MenuItem value="en">EN</MenuItem>
                <MenuItem value="el">EL</MenuItem>
                <MenuItem value="uk">UA</MenuItem>
                <MenuItem value="ru">RU</MenuItem>
              </Select>
            </Box>
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
                    {t("login")}
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
                          {t("my_account")}
                        </Button>
                      </Link>
                      <Link href="/">
                        <Button
                          variant="contained"
                          endIcon={<ExitToAppIcon fontSize="small" />}
                          onClick={handleLogout}
                        >
                          {t("logout")}
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
      </AppBar>
    </Box>
  );
}
