import { BOOKS } from "@/data/books";
import ZinesGallery from "@/components/ZinesGallery";
import styles from "./page.module.css";

export const metadata = {
  title: "Zines — gaajar",
};

export default function ZinesPage() {
  return (
    <main className={styles.wrap}>
      <ZinesGallery books={BOOKS} />
    </main>
  );
}
