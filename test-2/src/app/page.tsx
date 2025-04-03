"use client";
import { useTheme } from "next-themes";

export default function Home() {
  const { theme, setTheme } = useTheme();
  return (
    <main>
      {/* <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
        {theme}
      </button> */}
      <h2 className="text-primary">Hello World</h2>
    </main>
  );
}
