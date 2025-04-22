import VerifyoPage from "@/components/verifyo";

export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const token = (await params).token;
  
  return (
    <div>
      <VerifyoPage token={token} />
    </div>
  );
}
