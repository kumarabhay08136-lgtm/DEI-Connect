import { createContext, useState, useCallback, useMemo } from "react";

// Holds lightweight, app-wide UI state that many pages care about:
// mobile sidebar visibility and a simple toast/notification queue.
export const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [postsVersion, setPostsVersion] = useState(0);

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const toggleSidebar = useCallback(() => setSidebarOpen((prev) => !prev), []);
  const openCreatePost = useCallback(() => setCreatePostOpen(true), []);
  const closeCreatePost = useCallback(() => setCreatePostOpen(false), []);
  const bumpPostsVersion = useCallback(() => setPostsVersion((v) => v + 1), []);

  const pushToast = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3500);
  }, []);

  const value = useMemo(
    () => ({
      sidebarOpen,
      toggleSidebar,
      closeSidebar,
      toasts,
      pushToast,
      createPostOpen,
      openCreatePost,
      closeCreatePost,
      postsVersion,
      bumpPostsVersion,
    }),
    [
      sidebarOpen,
      toggleSidebar,
      closeSidebar,
      toasts,
      pushToast,
      createPostOpen,
      openCreatePost,
      closeCreatePost,
      postsVersion,
      bumpPostsVersion,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
