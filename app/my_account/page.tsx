import { Container } from "@mui/material";
import styles from "./page.module.css";
import MyForm from "../components/form/page";

export default function Page() {
  return (
    <Container className={styles.container}>
      <MyForm />
    </Container>
  );
}
