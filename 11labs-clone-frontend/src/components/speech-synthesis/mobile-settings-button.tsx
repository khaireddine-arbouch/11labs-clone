import { RiSettings3Line } from "react-icons/ri";

export function MobileSettingsButton({
  toggleMobileMenu,
}: {
  toggleMobileMenu: () => void;
}) {
  return (
    <button
      className="fixed bottom-28 right-6 z-40 inline-flex h-10 w-10 items-center justify-center rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 p-0 shadow-none transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600"
      onClick={toggleMobileMenu}
    >
      <RiSettings3Line className="h-5 w-5 dark:text-gray-300" />
    </button>
  );
}