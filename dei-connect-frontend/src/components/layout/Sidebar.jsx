import { NavLink, Link } from "react-router-dom";
import { NAV_ITEMS } from "../../utils/constants";
import { useApp } from "../../hooks/useApp";
import { classNames } from "../../utils/helpers";

function NavItems({ onNavigate }) {
  return (
    <nav className="flex flex-col gap-xs pt-md">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={onNavigate}
          className={({ isActive }) =>
            classNames(
              "flex items-center gap-md px-4 py-3 rounded-xl transition-all duration-200 font-label-md",
              isActive
                ? "bg-primary/10 text-primary font-bold"
                : "text-on-surface-variant hover:text-primary hover:bg-surface-container/50"
            )
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={classNames("material-symbols-outlined", isActive && "icon-fill")}
              >
                {item.icon}
              </span>
              <span className="tracking-wide">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

// Desktop sidebar: always visible, sticky under the navbar.
export default function Sidebar() {
  const { sidebarOpen, closeSidebar, openCreatePost } = useApp();

  return (
    <>
      <aside className="hidden lg:flex flex-col gap-sm p-md h-[calc(100vh-64px)] w-64 sticky top-16 overflow-y-auto border-r border-outline-variant/20 shrink-0">
        <NavItems />
        <div className="mt-lg px-4">
          <button
            onClick={openCreatePost}
            className="w-full bg-primary-container text-white py-3 rounded-xl font-label-md flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-md"
          >
            <span className="material-symbols-outlined">add_circle</span>
            Create Post
          </button>
        </div>
        <div className="mt-auto pb-8 flex flex-col gap-xs pt-lg border-t border-outline-variant/20">
          <Link to="/help" className="flex items-center gap-md px-4 py-2 text-on-surface-variant hover:text-primary text-sm transition-all">
            <span className="material-symbols-outlined text-lg">help</span>
            Help
          </Link>
        </div>
      </aside>

      {/* Mobile drawer */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
            onClick={closeSidebar}
          />
          <div className="relative w-72 bg-white h-full p-md shadow-glass animate-fade-in flex flex-col">
            <div className="flex items-center justify-between mb-md px-2">
              <span className="font-heading text-headline-md text-primary">DEI Connect</span>
              <button onClick={closeSidebar} className="p-2 rounded-full hover:bg-surface-container">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <NavItems onNavigate={closeSidebar} />
            <div className="px-4 mt-md">
              <button
                onClick={() => {
                  closeSidebar();
                  openCreatePost();
                }}
                className="w-full bg-primary-container text-white py-3 rounded-xl font-label-md flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-md"
              >
                <span className="material-symbols-outlined">add_circle</span>
                Create Post
              </button>
            </div>
            <div className="mt-auto pt-lg border-t border-outline-variant/20">
              <Link
                to="/help"
                onClick={closeSidebar}
                className="flex items-center gap-md px-4 py-2 text-on-surface-variant hover:text-primary text-sm transition-all"
              >
                <span className="material-symbols-outlined text-lg">help</span>
                Help
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
