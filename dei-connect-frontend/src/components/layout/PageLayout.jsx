import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import CreatePostModal from "../home/CreatePostModal";

// Wraps every authenticated page with the shared Navbar + Sidebar shell.
export default function PageLayout({ children }) {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Navbar />
      <div className="max-w-container-max mx-auto flex px-gutter">
        <Sidebar />
        <main className="flex-1 min-w-0 py-lg lg:pl-gutter">{children}</main>
      </div>
      <CreatePostModal />
    </div>
  );
}
