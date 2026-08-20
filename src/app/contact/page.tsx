"use client";

import { useEffect, useState, type FormEvent } from "react";
import styles from "./page.module.css";

// [VERIFY WITH NIKHIL] — no public contact email found in research; Instagram DM
// (@gaaajar, confirmed live) is the real, working channel today.
const CONTACT_EMAIL = "hello@gaajar.studio";
const INSTAGRAM_HANDLE = "@gaaajar";
const INSTAGRAM_URL = "https://instagram.com/gaaajar";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const subject = encodeURIComponent(`Hello from ${name || "your site"}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }

  return (
    <main className={styles.wrap}>
      <p className={styles.eyebrow}>say hello,</p>
      <h1 className={styles.h1}>Contact</h1>
      <p className={styles.dek}>
        Question about a zine, a bulk order, a workshop or pop-up &mdash; drop
        a line, or just DM it straight to Instagram.
      </p>

      <div className={styles.channels}>
        <a href={`mailto:${CONTACT_EMAIL}`} className={styles.channel}>
          <span className={styles.mono}>email</span> {CONTACT_EMAIL}
        </a>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.channel}
        >
          <span className={styles.mono}>ig</span> {INSTAGRAM_HANDLE}
        </a>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <label className={styles.field}>
            <span className={styles.label}>name</span>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />
          </label>
        </div>
        <label className={styles.field}>
          <span className={styles.label}>message</span>
          <textarea
            required
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={styles.textarea}
          />
        </label>
        <button type="submit" className={styles.submit}>
          Send &rarr;
        </button>
      </form>
    </main>
  );
}
