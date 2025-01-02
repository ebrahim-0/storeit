import UserData from "@/components/UserData";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <UserData />
      {children}
    </>
  );
}
