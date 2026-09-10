import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/layout/PageLayout";
import Button from "../components/common/Button";
import Switch from "../components/common/Switch";
import Modal from "../components/common/Modal";
import Loader from "../components/common/Loader";
import { useAuth } from "../hooks/useAuth";
import { getSettings, updateSettingsSection } from "../services/settingsService";
import { updateProfile } from "../services/profileService";
import { changePassword, deactivateAccount } from "../services/authService";

const TABS = [
  { id: "account", label: "Account", icon: "person" },
  { id: "notifications", label: "Notifications", icon: "notifications" },
  { id: "privacy", label: "Privacy", icon: "shield" },
  { id: "security", label: "Security", icon: "lock" },
  { id: "appearance", label: "Appearance", icon: "palette" },
  { id: "danger", label: "Danger Zone", icon: "warning" },
];

export default function Settings() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("account");
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedFlash, setSavedFlash] = useState("");

  // Account form (separate from global settings so name changes flow through AuthContext)
  const [accountForm, setAccountForm] = useState({ name: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({ current: "", next: "", confirm: "" });
  const [passwordMessage, setPasswordMessage] = useState("");
  const [deactivateOpen, setDeactivateOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await getSettings();
      setSettings(data);
      setAccountForm({ name: user?.name || "", email: user?.email || "" });
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const flashSaved = () => {
    setSavedFlash("Saved");
    setTimeout(() => setSavedFlash(""), 1500);
  };

  const handleSection = async (section, partial) => {
    const next = await updateSettingsSection(section, partial);
    setSettings(next);
    flashSaved();
  };

  const handleSaveAccount = async (e) => {
    e.preventDefault();
    await updateProfile({ name: accountForm.name });
    updateUser({ name: accountForm.name });
    flashSaved();
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwordForm.current || !passwordForm.next) {
      setPasswordMessage("Please fill in all password fields.");
      return;
    }
    if (passwordForm.next !== passwordForm.confirm) {
      setPasswordMessage("New passwords do not match.");
      return;
    }
    try {
      await changePassword({ currentPassword: passwordForm.current, newPassword: passwordForm.next });
      setPasswordMessage("Password updated successfully.");
      setPasswordForm({ current: "", next: "", confirm: "" });
    } catch (err) {
      setPasswordMessage(err.message || "Unable to update password.");
    }
  };

  const handleDeactivate = async () => {
    await deactivateAccount();
    setDeactivateOpen(false);
    logout();
    navigate("/");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading || !settings) {
    return (
      <PageLayout>
        <Loader label="Loading settings..." />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-lg">
        <div>
          <h1 className="font-heading text-headline-md text-primary">Settings</h1>
          <p className="text-body-sm text-on-surface-variant">Manage your account, privacy, and preferences.</p>
        </div>
        {savedFlash && (
          <span className="flex items-center gap-xs text-secondary text-sm font-semibold animate-fade-in">
            <span className="material-symbols-outlined text-lg">check_circle</span>
            {savedFlash}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-lg">
        <div className="card-surface rounded-3xl p-md h-fit lg:sticky lg:top-20">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-md px-md py-3 rounded-xl transition-all text-left ${
                activeTab === tab.id
                  ? tab.id === "danger"
                    ? "bg-error-container/50 text-on-error-container font-bold"
                    : "bg-primary/10 text-primary font-bold"
                  : "text-on-surface-variant hover:bg-surface-container-low"
              }`}
            >
              <span className="material-symbols-outlined">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-md px-md py-3 rounded-xl text-error hover:bg-error-container/40 transition-all mt-sm"
          >
            <span className="material-symbols-outlined">logout</span>
            Logout
          </button>
        </div>

        <div className="lg:col-span-3 card-surface rounded-3xl p-xl">
          {/* ACCOUNT */}
          {activeTab === "account" && (
            <form onSubmit={handleSaveAccount} className="space-y-lg max-w-md">
              <h2 className="font-heading text-title-lg text-primary">Account Details</h2>
              <div>
                <label className="text-sm font-semibold text-on-surface-variant block mb-sm">Full Name</label>
                <input
                  value={accountForm.name}
                  onChange={(e) => setAccountForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-md py-sm border border-outline-variant/30 rounded-lg outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-on-surface-variant block mb-sm">Email</label>
                <input
                  value={accountForm.email}
                  disabled
                  className="w-full px-md py-sm border border-outline-variant/30 rounded-lg bg-surface-container-low text-on-surface-variant"
                />
                <p className="text-xs text-outline mt-1">Contact support to change your registered email.</p>
              </div>
              <Button type="submit">Save Changes</Button>
            </form>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div className="max-w-md">
              <h2 className="font-heading text-title-lg text-primary mb-md">Notification Preferences</h2>
              <div className="divide-y divide-outline-variant/10">
                <Switch
                  label="Direct Messages"
                  description="Get notified when someone messages you"
                  checked={settings.notifications.messages}
                  onChange={(v) => handleSection("notifications", { messages: v })}
                />
                <Switch
                  label="Faculty Announcements"
                  description="Official updates from faculty and departments"
                  checked={settings.notifications.announcements}
                  onChange={(v) => handleSection("notifications", { announcements: v })}
                />
                <Switch
                  label="Group Activity"
                  description="New messages and updates in your groups"
                  checked={settings.notifications.groupActivity}
                  onChange={(v) => handleSection("notifications", { groupActivity: v })}
                />
                <Switch
                  label="Campus Events"
                  description="Reminders for upcoming events and symposiums"
                  checked={settings.notifications.events}
                  onChange={(v) => handleSection("notifications", { events: v })}
                />
                <Switch
                  label="Weekly Email Digest"
                  description="A summary of your activity sent every week"
                  checked={settings.notifications.emailDigest}
                  onChange={(v) => handleSection("notifications", { emailDigest: v })}
                />
              </div>
            </div>
          )}

          {/* PRIVACY */}
          {activeTab === "privacy" && (
            <div className="max-w-md space-y-lg">
              <h2 className="font-heading text-title-lg text-primary">Privacy</h2>
              <div>
                <label className="text-sm font-semibold text-on-surface-variant block mb-sm">Who can see my profile</label>
                <select
                  value={settings.privacy.profileVisibility}
                  onChange={(e) => handleSection("privacy", { profileVisibility: e.target.value })}
                  className="w-full px-md py-sm border border-outline-variant/30 rounded-lg outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary bg-white"
                >
                  <option value="everyone">Everyone on DEI Connect</option>
                  <option value="connections">My connections only</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-on-surface-variant block mb-sm">Who can message me</label>
                <select
                  value={settings.privacy.messagePermission}
                  onChange={(e) => handleSection("privacy", { messagePermission: e.target.value })}
                  className="w-full px-md py-sm border border-outline-variant/30 rounded-lg outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary bg-white"
                >
                  <option value="everyone">Everyone on DEI Connect</option>
                  <option value="connections">My connections only</option>
                </select>
              </div>
              <div className="divide-y divide-outline-variant/10 pt-sm border-t border-outline-variant/20">
                <Switch
                  label="Show Online Status"
                  description="Let others see when you're active"
                  checked={settings.privacy.showOnlineStatus}
                  onChange={(v) => handleSection("privacy", { showOnlineStatus: v })}
                />
                <Switch
                  label="Show Email on Profile"
                  description="Display your college email publicly"
                  checked={settings.privacy.showEmail}
                  onChange={(v) => handleSection("privacy", { showEmail: v })}
                />
              </div>
            </div>
          )}

          {/* SECURITY */}
          {activeTab === "security" && (
            <div className="max-w-md space-y-xl">
              <div>
                <h2 className="font-heading text-title-lg text-primary mb-md">Change Password</h2>
                <form onSubmit={handleChangePassword} className="space-y-md">
                  {passwordMessage && (
                    <div
                      className={`text-body-sm px-md py-sm rounded-lg ${
                        passwordMessage.includes("success")
                          ? "bg-secondary/10 text-secondary"
                          : "bg-error-container/60 text-on-error-container"
                      }`}
                    >
                      {passwordMessage}
                    </div>
                  )}
                  <input
                    type="password"
                    placeholder="Current Password"
                    value={passwordForm.current}
                    onChange={(e) => setPasswordForm((prev) => ({ ...prev, current: e.target.value }))}
                    className="w-full px-md py-sm border border-outline-variant/30 rounded-lg outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary"
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={passwordForm.next}
                    onChange={(e) => setPasswordForm((prev) => ({ ...prev, next: e.target.value }))}
                    className="w-full px-md py-sm border border-outline-variant/30 rounded-lg outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary"
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirm: e.target.value }))}
                    className="w-full px-md py-sm border border-outline-variant/30 rounded-lg outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary"
                  />
                  <Button type="submit">Update Password</Button>
                </form>
              </div>
              <div className="pt-lg border-t border-outline-variant/20">
                <Switch
                  label="Two-Factor Authentication"
                  description="Add an extra layer of security to your account"
                  checked={settings.security.twoFactor}
                  onChange={(v) => handleSection("security", { twoFactor: v })}
                />
              </div>
            </div>
          )}

          {/* APPEARANCE */}
          {activeTab === "appearance" && (
            <div className="max-w-md space-y-lg">
              <h2 className="font-heading text-title-lg text-primary">Appearance</h2>
              <div className="flex items-center gap-md p-md bg-surface-container-low rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white shrink-0">
                  <span className="material-symbols-outlined">palette</span>
                </div>
                <p className="text-body-sm text-on-surface-variant">
                  DEI Connect currently uses the institute's signature <strong className="text-on-surface">Heritage</strong> theme.
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-on-surface-variant block mb-sm">Text Size</label>
                <div className="flex gap-sm">
                  {["small", "default", "large"].map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSection("appearance", { fontSize: size })}
                      className={`flex-1 py-2 rounded-lg text-label-sm font-semibold capitalize transition-all ${
                        settings.appearance.fontSize === size
                          ? "bg-primary text-white"
                          : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-on-surface-variant block mb-sm">Language</label>
                <select
                  value={settings.appearance.language}
                  onChange={(e) => handleSection("appearance", { language: e.target.value })}
                  className="w-full px-md py-sm border border-outline-variant/30 rounded-lg outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary bg-white"
                >
                  <option>English</option>
                  <option>Hindi</option>
                </select>
              </div>
            </div>
          )}

          {/* DANGER ZONE */}
          {activeTab === "danger" && (
            <div className="max-w-md space-y-lg">
              <h2 className="font-heading text-title-lg text-error">Danger Zone</h2>
              <div className="p-lg rounded-2xl border border-error/20 bg-error-container/20">
                <h3 className="font-label-md text-on-surface mb-xs">Deactivate Account</h3>
                <p className="text-body-sm text-on-surface-variant mb-md">
                  You'll be logged out and your profile will be hidden from other members.
                  This is a demo action — no data is permanently deleted.
                </p>
                <Button variant="danger" onClick={() => setDeactivateOpen(true)}>
                  Deactivate My Account
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        open={deactivateOpen}
        onClose={() => setDeactivateOpen(false)}
        title="Deactivate Account?"
        footer={
          <div className="flex gap-sm justify-end">
            <Button variant="ghost" onClick={() => setDeactivateOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeactivate}>
              Yes, Deactivate
            </Button>
          </div>
        }
      >
        <p className="text-body-sm text-on-surface-variant">
          Are you sure you want to deactivate your DEI Connect account? You can always come back and log in again later.
        </p>
      </Modal>
    </PageLayout>
  );
}
