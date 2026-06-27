import { useTheme } from "../lib/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <span className={`theme-toggle-track ${isDark ? "is-dark" : "is-light"}`}>
        <span className="theme-toggle-thumb">
          {/* Sun glyph */}
          <svg
            className="icon-sun"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
          >
            <circle cx="12" cy="12" r="4.5" />
            <path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8l1.8-1.8M18 6l1.8-1.8" />
          </svg>
          {/* Moon glyph */}
          <svg
            className="icon-moon"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M20.4 14.7A8.5 8.5 0 119.3 3.6a7 7 0 1011.1 11.1z" />
          </svg>
        </span>
      </span>
    </button>
  );
}
