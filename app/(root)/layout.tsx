import NavBar from "@/components/navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar hasEnvVars={true} />
      <main>{children}</main>
    </>
  );
}