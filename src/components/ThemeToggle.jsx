import { useThemeContext } from '../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { mode, toggleTheme } = useThemeContext();

  return (
    <label className="theme-switch">
      <input
        type="checkbox"
        className="theme-switch__checkbox"
        checked={mode === 'dark'}
        onChange={toggleTheme}
      />
      <div className="theme-switch__container">
        <div className="theme-switch__circle-container">
          <div className="theme-switch__sun-moon-container">
            <div className="theme-switch__moon">
              <div className="theme-switch__spot"></div>
              <div className="theme-switch__spot"></div>
              <div className="theme-switch__spot"></div>
            </div>
          </div>
        </div>
        <div className="theme-switch__clouds"></div>
        <div className="theme-switch__stars-container">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 144 55"
            fill="none"
            className="theme-switch__stars"
          >
            <path
              d="M138.5 18.5L140 20L138.5 21.5L137 20L138.5 18.5ZM116 0.5L118 3L116 5.5L114 3L116 0.5ZM104.5 28.5L106 30L104.5 31.5L103 30L104.5 28.5ZM130.5 42.5L132 44L130.5 45.5L129 44L130.5 42.5ZM66.5 28.5L68 30L66.5 31.5L65 30L66.5 28.5ZM41 12.5L43 15L41 17.5L39 15L41 12.5ZM15.5 38.5L17 40L15.5 41.5L14 40L15.5 38.5ZM2.5 18.5L4 20L2.5 21.5L1 20L2.5 18.5Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
    </label>
  );
};

export default ThemeToggle;