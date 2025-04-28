import SidebarOrganizer from "@/components/sidebaror";


export default function DismatchLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="flex-row md:flex w-screen">
        <SidebarOrganizer />
        {children}  
      </div>
    </>
  );
}
