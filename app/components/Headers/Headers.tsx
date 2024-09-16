"use client";

import { useUserContext } from "@/app/contexts/UserContext";
import { useToggle } from "@/app/lib/ToggleContext";
import { app } from "@/app/lib/config";
import useAmplitudeContext from "@/app/utils/amplitudeHook";
import i18nConfig from "@/i18nConfig";
import {
  Close,
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
  Modal,
  Select,
  Toolbar,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { User, getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SnackbarProvider } from "notistack";
import { useEffect, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "../../i18n";
import { LogInProps } from "../Logins/Logins";
import WrapperLogin from "../WrapperLogin/WrapperLogin";
import styles from "./Header.module.css";
import { MyAccountMenu } from "./MyAccountMenu";

dayjs.extend(customParseFormat);

const END_INFO_BANNER = "29.10.2024 00:00";

export default function Headers({
  setShowWindow,
  setShowContinueText,
}: {
  setShowWindow: (val: boolean) => void;
  setShowContinueText: (val: boolean) => void;
}) {
  const { i18n, t } = useTranslation("main");
  const { trackAmplitudeEvent } = useAmplitudeContext();
  const { user, isAdmin, unpaidOrders, setUser } = useUserContext();
  const currentLocale = i18n.language;
  const { isToggled, setToggle } = useToggle();
  const router = useRouter();
  const auth = getAuth(app);
  const pathname = usePathname();

  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

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

  useLayoutEffect(() => {
    setShowInfoModal(true);
    setOpen(true);

    const today = dayjs();
    const endDate = dayjs(END_INFO_BANNER, "DD.MM.YYYY HH:mm");

    if (today.isAfter(endDate)) {
      setShowInfoModal(false);
      setOpen(false);
    }
  }, []);

  return (
    <SnackbarProvider>
      <Box>
        {!pathname.endsWith("/admin_dashboard") && showInfoModal && (
          <>
            <Box
              sx={{
                background: "#428bca",
                color: "white",
                padding: 2,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "22px",
                fontWeight: "bold",
              }}
            >
              <Typography
                width="80%"
                fontSize={18}
                fontWeight={"bold"}
                textAlign="center"
              >
                {t("info")}
              </Typography>
            </Box>

            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <IconButton
                  onClick={handleClose}
                  sx={{
                    position: "absolute",
                    right: 5,
                    top: 5,
                  }}
                >
                  <Close />
                </IconButton>
                <Typography
                  variant="h6"
                  component="h2"
                  fontWeight="bold"
                  fontSize={30}
                >
                  {t("customers")}
                </Typography>
                <Typography
                  id="modal-modal-description"
                  textAlign="center"
                  sx={{ mt: 2 }}
                >
                  {t("info")}
                </Typography>
              </Box>
            </Modal>
          </>
        )}
        {user &&
          unpaidOrders.length !== 0 &&
          unpaidOrders[0].paymentId &&
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
                onClick={() => {
                  setShowWindow(true);
                  setShowContinueText(false);
                }}
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
      </Box>
    </SnackbarProvider>
  );
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "10px",
};
