import SidebarMatch from "@/components/sidebarm";

export default function DismatchLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="flex-row md:flex w-screen">
        <SidebarMatch />
        {children}  
      </div>
    </>
  );
}
