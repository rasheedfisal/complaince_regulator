"use client";
import { AnimatePresence, motion } from "framer-motion";
import React, { KeyboardEventHandler, MouseEventHandler } from "react";
import { useMutation } from "@tanstack/react-query";
import { logoutUserFn } from "@/api/authApi";
import { useRouter } from "next/navigation";
import { useStateContext } from "@/context/AppConext";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import Link from "next/link";
type MobileSubProps = {
  toggleTheme: MouseEventHandler;
  isDark: boolean;
  openNotificationsPanel: MouseEventHandler;
  openSearchPanel: MouseEventHandler;
  openSettingsPanel: MouseEventHandler;
  OpenUserProfilePanel: MouseEventHandler;
  openUserProfile: boolean;
  handleSideMenuSpace: KeyboardEventHandler<HTMLDivElement>;
  notifyCount: number;
};

const MobileSubMenu = ({
  toggleTheme,
  isDark,
  openNotificationsPanel,
  openSearchPanel,
  openSettingsPanel,
  OpenUserProfilePanel,
  openUserProfile,
  handleSideMenuSpace,
  notifyCount,
}: MobileSubProps) => {
  const router = useRouter();
  const stateContext = useStateContext();

  const { mutate: logoutUser, isLoading } = useMutation(() => logoutUserFn(), {
    onSuccess: () => {
      toast.success("You successfully logged out");
      Cookies.remove("AT");
      // Cookies.remove("accessToken");
      router.push("/");
    },
    onError: (error: any) => {
      if ((error as any).response?.data?.msg) {
        toast.error((error as any).response?.data?.msg, {
          position: "top-right",
        });
      }
    },
  });

  return (
    <motion.nav
      initial={{ opacity: 0, y: 100 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: {
          ease: "easeInOut",
          duration: 0.3,
        },
      }}
      exit={{
        opacity: 0,
        y: 100,
        transition: {
          ease: "easeOut",
          duration: 0.2,
        },
      }}
      onKeyDown={handleSideMenuSpace}
      className={`absolute flex items-center z-10 p-4 bg-white rounded-md shadow-lg dark:bg-darker top-16 inset-x-4 md:hidden`}
      aria-label="Secondary"
    >
      <div className="space-x-2">
        {/* <!-- Notification button --> */}
        <button
          // @click="openNotificationsPanel(); $nextTick(() => { isMobileSubMenuOpen = false })"
          onClick={openNotificationsPanel}
          className="p-2 transition-colors duration-200 rounded-full text-primary-lighter bg-primary-50 hover:text-primary hover:bg-primary-100 dark:hover:text-light dark:hover:bg-primary-dark dark:bg-dark focus:outline-none focus:bg-primary-100 dark:focus:bg-primary-dark focus:ring-primary-darker relative"
        >
          {notifyCount > 0 && (
            <span className="absolute -top-2 -right-1 h-5 w-5 rounded-full bg-primary flex justify-center items-center items">
              <span className="text-light text-sm">{notifyCount}</span>
            </span>
          )}
          <span className="sr-only">Open notifications panel</span>
          <svg
            className="w-7 h-7"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </button>
      </div>

      {/* <!-- User avatar button --> x-data="{ open: false }"*/}
      <div className="relative ml-auto">
        <button
          // @click="open = !open"
          onClick={OpenUserProfilePanel}
          type="button"
          aria-haspopup="true"
          // :aria-expanded="open ? 'true' : 'false'"
          aria-expanded={openUserProfile ? "true" : "false"}
          className="block transition-opacity duration-200 rounded-full dark:opacity-75 dark:hover:opacity-100 focus:outline-none focus:ring dark:focus:opacity-100"
        >
          <span className="sr-only">User menu</span>
          <img
            className="w-10 h-10 rounded-full"
            src={stateContext.state.authUser?.regulator.logo ?? "/noImg.jpg"}
            alt="avatar"
          />
        </button>
        {/* <!-- User dropdown menu --> */}
        <AnimatePresence>
          {openUserProfile && (
            <motion.div
              key={1}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  ease: "easeOut",
                  duration: 0.3,
                },
              }}
              exit={{
                opacity: 0,
                y: 20,
                transition: {
                  ease: "easeIn",
                  duration: 0.2,
                },
              }}
              className={`absolute right-0 w-48 py-1 origin-top-right bg-white rounded-md shadow-lg top-12 ring-1 ring-black ring-opacity-5 dark:bg-dark`}
              role="menu"
              aria-orientation="vertical"
              aria-label="User menu"
            >
              <Link
                href="/profile"
                role="menuitem"
                className="block px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-light dark:hover:bg-primary"
              >
                Your Profile
              </Link>
              <span
                onClick={() => logoutUser()}
                role="menuitem"
                className="block px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-light dark:hover:bg-primary cursor-pointer"
              >
                {isLoading ? (
                  <svg
                    className="w-6 h-6 mr-3 -ml-1 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  "logout"
                )}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default MobileSubMenu;
