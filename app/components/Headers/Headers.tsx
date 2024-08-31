"use client";

import { useUserContext } from "@/app/contexts/UserContext";
import { useToggle } from "@/app/lib/ToggleContext";
import { app } from "@/app/lib/config";
import useAmplitudeContext from "@/app/utils/amplitudeHook";
import i18nConfig from "@/i18nConfig";
import {
  ExitToApp,
  ManageAccounts,
  ManageAccountsSharp,
} from "@mui/icons-material";
import LoginIcon from "@mui/icons-material/Login";
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  MenuItem,
  Select,
  Toolbar,
} from "@mui/material";
import { User, getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SnackbarProvider } from "notistack";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "../../i18n";
import { LogInProps } from "../Logins/Logins";
import WrapperLogin from "../WrapperLogin/WrapperLogin";
import styles from "./Header.module.css";
import { MyAccountMenu } from "./MyAccountMenu";

export default function Headers({
  setShowWindow,
}: {
  setShowWindow: (val: boolean) => void;
}) {
  const { i18n, t } = useTranslation("main");
  const { trackAmplitudeEvent } = useAmplitudeContext();

  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { isToggled, setToggle } = useToggle();
  const currentLocale = i18n.language;

  const { user, isAdmin, unpaidOrders, setUser } = useUserContext();

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
      setToggle(false);
      router.push("/new_order");
    }
  }, [isToggled]);

  const handleLoginToggle = () => {
    setShowLogin((prevShowLogin) => !prevShowLogin);
    trackAmplitudeEvent("loginFromHeader", {
      text: "Login from header",
    });
  };

  const handleLanguageChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    const languageValue = event.target.value as string;
    if (
      currentLocale === i18nConfig.defaultLocale &&
      //@ts-ignore
      !i18nConfig.prefixDefault
    ) {
      router.push("/" + languageValue + pathname);
    } else {
      router.push(pathname.replace(`/${currentLocale}`, `/${languageValue}`));
    }
    router.refresh();
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
    if (pathname == "/new_order" || pathname === "/order_history") {
      setShowLogin(false);
    }
  }, [pathname, router]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user as User);
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
    <SnackbarProvider>
      {user &&
        unpaidOrders.length !== 0 &&
        !pathname.includes("/admin_dashboard") && (
          <Box
            sx={{
              background: "#D34942",
              color: "white",
              padding: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "22px",
              fontWeight: "bold",
            }}
          >
            {t("paymentWarning")}
            <Button
              onClick={() => setShowWindow(true)}
              size="large"
              sx={{
                paddingInline: 4,
                marginLeft: 2,
                background: "#fff",
                border: "solid 2px #A72A24",
                color: "#A72A24",
                fontWeight: "bold",

                ":hover": {
                  background: "#A83A34",
                  color: "#fff",
                  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                },
              }}
            >
              {t("pay")}
            </Button>
          </Box>
        )}
      <Box className={styles.container}>
        <AppBar position="static">
          <Toolbar className={styles.toolbar}>
            <Box className={styles.name_container} sx={{ flexGrow: 1 }}>
              <Link href="/">
                <Image
                  src="/water.svg"
                  alt="DelAqua logo"
                  width={50}
                  height={50}
                />
              </Link>

              <Box>
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
            </Box>

            {showLogin && <WrapperLogin {...loginProps} />}
            <div className={styles.buttonsContainer}>
              <Box>
                <Select
                  className={styles.language}
                  value={currentLocale}
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
                        <MyAccountMenu />
                        {isAdmin && (
                          <Button
                            onClick={() => {
                              router.push("/admin_dashboard");
                            }}
                            variant="contained"
                            endIcon={<ManageAccounts fontSize="small" />}
                          >
                            {t("admin")}
                          </Button>
                        )}
                        <Link href="/">
                          <Button
                            variant="contained"
                            endIcon={<ExitToApp fontSize="small" />}
                            onClick={handleLogout}
                          >
                            {t("logout")}
                          </Button>
                        </Link>
                      </Box>

                      {/* mobile buttons */}
                      <Box className={styles.mobileScreen}>
                        <MyAccountMenu />
                        {isAdmin && (
                          <IconButton
                            onClick={() => router.push("/admin_dashboard")}
                            sx={{
                              width: "50px",
                              height: "50px",
                            }}
                          >
                            <ManageAccountsSharp
                              color="primary"
                              fontSize="small"
                            />
                          </IconButton>
                        )}
                        <Link href="/">
                          <ExitToApp
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
    </SnackbarProvider>
  );
}
