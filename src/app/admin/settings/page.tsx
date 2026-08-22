import { getSiteSettings } from "@/app/actions/settings";
import { SettingsForm } from "./settings-form";
import { Settings, Globe, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Site Settings | Admin Portal",
};

export default async function SettingsPage() {
  const siteSettings = await getSiteSettings();

  return (
    <div className="space-y-6 w-full">
      {/* ── Top Header Bar ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-accent-500 flex items-center justify-center text-white shadow-md shrink-0">
            <Settings className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-primary-900 tracking-tight">
                Global Website Settings
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent-50 text-accent-700 border border-accent-200">
                <Globe className="h-3 w-3" /> Live Synced
              </span>
            </div>
            <p className="text-xs text-primary-500 mt-0.5">
              Configure company contact information, physical office address, business operating hours, and social media channels.
            </p>
          </div>
        </div>
      </div>

      <SettingsForm initialData={siteSettings || {}} />
    </div>
  );
}
