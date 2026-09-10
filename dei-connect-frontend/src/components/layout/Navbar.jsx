import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useApp } from "../../hooks/useApp";
import { avatarFor, avatarForUser } from "../../utils/constants";
import NotificationDropdown from "./NotificationDropdown";
import { getNotifications } from "../../services/notificationService";
import { getAllUsers } from "../../services/socialService";

// Top navigation bar for the authenticated application (Home, Chat, etc).
export default function Navbar() {
  const { user, logout } = useAuth();
  const { toggleSidebar } = useApp();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [allUsers, setAllUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    getNotifications().then((data) => setUnreadCount(data.filter((n) => !n.read).length));
  }, [notifOpen]);

  useEffect(() => {
    getAllUsers().then(setAllUsers);
  }, []);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const matches =
    query.trim().length > 0
      ? allUsers.filter((u) => u.name.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 6)
      : [];

  const goToFeed = (q) => {
    setSearchOpen(false);
    navigate(`/feed?q=${encodeURIComponent(q)}`);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter" && query.trim()) {
      goToFeed(query.trim());
    } else if (e.key === "Escape") {
      setSearchOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white/90 backdrop-blur-xl sticky top-0 z-40 border-b border-outline-variant/30 shadow-sm">
      <div className="flex items-center justify-between px-gutter py-md max-w-container-max mx-auto h-16">
        <div className="flex items-center gap-sm md:gap-md min-w-0">
          <button
            onClick={toggleSidebar}
            className="lg:hidden shrink-0 w-10 h-10 flex items-center justify-center overflow-hidden rounded-full hover:bg-surface-container text-on-surface-variant"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <Link
            to="/home"
            className="font-heading text-lg sm:text-[22px] font-bold text-primary tracking-tight whitespace-nowrap shrink-0"
          >
            DEI Connect
          </Link>
          <div className="hidden md:flex relative ml-xl" ref={searchRef}>
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
              search
            </span>
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              onKeyDown={handleSearchKeyDown}
              className="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full w-72 lg:w-80 focus:ring-2 focus:ring-primary transition-all text-body-sm outline-none"
              placeholder="Search people by name..."
              type="text"
            />

            {searchOpen && query.trim() && (
              <div className="absolute top-full mt-2 left-0 w-full bg-white rounded-2xl shadow-glass border border-outline-variant/20 overflow-hidden z-50">
                {matches.length === 0 ? (
                  <p className="px-md py-md text-body-sm text-on-surface-variant">
                    No people found for "{query}".
                  </p>
                ) : (
                  <>
                    {matches.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => goToFeed(u.name)}
                        className="w-full flex items-center gap-sm px-md py-sm hover:bg-surface-container-low text-left transition-colors"
                      >
                        <img src={avatarFor(u.name)} alt={u.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
                        <div className="min-w-0">
                          <p className="font-label-md text-on-surface truncate">{u.name}</p>
                          <p className="text-xs text-on-surface-variant truncate">
                            {u.role} • {u.department}
                          </p>
                        </div>
                      </button>
                    ))}
                    <button
                      onClick={() => goToFeed(query.trim())}
                      className="w-full text-left px-md py-sm text-label-sm text-primary hover:bg-surface-container-low border-t border-outline-variant/10"
                    >
                      See all results for "{query}"
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-sm md:gap-md shrink-0">
          <div className="relative">
            <button
              onClick={() => setNotifOpen((prev) => !prev)}
              className="w-10 h-10 flex items-center justify-center overflow-hidden rounded-full hover:bg-surface-container transition-colors relative"
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined text-on-surface-variant">
                notifications
              </span>
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full" />
              )}
            </button>
            <NotificationDropdown open={notifOpen} onClose={() => setNotifOpen(false)} />
          </div>
          <Link
            to="/messages"
            className="hidden sm:flex w-10 h-10 items-center justify-center overflow-hidden rounded-full hover:bg-surface-container transition-colors"
            aria-label="Messages"
          >
            <span className="material-symbols-outlined text-on-surface-variant">
              mail
            </span>
          </Link>
          <div className="relative">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="h-9 w-9 rounded-full overflow-hidden border border-outline-variant ml-sm cursor-pointer hover:ring-2 hover:ring-primary transition-all"
            >
              <img
                alt={user?.name || "Profile"}
                className="w-full h-full object-cover"
                src={avatarForUser(user)}
              />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-sm w-48 bg-white rounded-xl shadow-glass border border-outline-variant/20 py-sm z-50 animate-fade-in">
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-sm px-md py-sm text-body-sm text-on-surface hover:bg-surface-container-low"
                >
                  <span className="material-symbols-outlined text-[18px]">person</span>
                  Profile
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-sm px-md py-sm text-body-sm text-on-surface hover:bg-surface-container-low"
                >
                  <span className="material-symbols-outlined text-[18px]">settings</span>
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-sm px-md py-sm text-body-sm text-error hover:bg-error-container/40 w-full text-left"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
