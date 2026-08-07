import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getSiteSettings } from "@/app/actions/settings";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteSettings = await getSiteSettings();

  return (
    <div className="flex min-h-screen flex-col">
      <Header siteSettings={siteSettings} />
      <main className="flex-1">{children}</main>
      <Footer siteSettings={siteSettings} />
    </div>
  );
}
