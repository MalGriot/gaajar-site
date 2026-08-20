import Image from "next/image";
import styles from "./page.module.css";

export const metadata = {
  title: "About — gaajar",
};

export default function AboutPage() {
  return (
    <main className={styles.wrap}>
      <div className={styles.portraitCol}>
        <div className={styles.frame}>
          <Image
            src="/nikhil-profile.jpg"
            alt="Nikhil Poddar"
            width={150}
            height={150}
            className={styles.portrait}
            priority
          />
        </div>
        <p className={styles.handle}>@gaaajar</p>
      </div>

      <div className={styles.copyCol}>
        <p className={styles.eyebrow}>hey, i&apos;m</p>
        <h1 className={styles.h1}>Nikhil Poddar</h1>
        <p className={styles.dek}>
          Mumbai-based zine and chapbook maker, working under the handle{" "}
          <span className={styles.mono}>gaajar</span>. I write, illustrate,
          hand-assemble, and ship every copy myself &mdash; direct to whoever
          wants one, no middleman.
        </p>
        <p className={styles.body}>
          The work moves between funny and sincere without much warning &mdash;
          a monologue about explaining a banana to an alien sits next to poems
          written under trees and across waterfalls. It&apos;s all made to be
          a physical, real thing you can hold, not another tab to scroll past.
        </p>
        <ul className={styles.facts}>
          <li>
            <span className={styles.mono}>2023</span> Akela featured at
            Serendipity Arts Festival, Goa
          </li>
          <li>
            <span className={styles.mono}>2024</span> Insert Feelings Here
            wins the Bazinega Poetry Award
          </li>
          <li>
            <span className={styles.mono}>2025</span> TAC Festival, New Delhi
            &mdash; &ldquo;2 zine 2 tourious&rdquo;
          </li>
          <li>
            <span className={styles.mono}>ongoing</span> zine-making
            workshops &amp; pop-ups
          </li>
        </ul>
      </div>
    </main>
  );
}
