import { getSiteSettings } from "@/app/actions/settings";
import { SettingsForm } from "./settings-form";

export const metadata = {
  title: "Site Settings | Admin",
};

export default async function SettingsPage() {
  const siteSettings = await getSiteSettings();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Site Settings</h1>
        <p className="text-neutral-500 mt-1">
          Update your company contact details, office hours, and social media links. Changes appear on the website immediately.
        </p>
      </div>

      <SettingsForm initialData={siteSettings || {}} />
    </div>
  );
}
