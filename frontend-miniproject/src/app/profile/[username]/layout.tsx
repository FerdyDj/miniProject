import Sidebar from "@/components/sidebar";

export default async function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="flex w-screen">
        <Sidebar />
        {children}
      </div>
    </>
  );
}
