"use client";

import JadwalSholatCard from "@/app/widgets/JadwalShalat";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function EmbedContent() {
  const searchParams = useSearchParams();
  const cityId = searchParams.get("city") || "1301";
  return <JadwalSholatCard cityId={cityId} />;
}

export default function Page() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const insideIframe = window.self !== window.top;

    if (!insideIframe) {
      router.push("/home");
    } else {
      setAllowed(true);
    }

    setChecked(true);
  }, []);

  if (!checked) return null;

  if (!allowed) return null;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmbedContent />
    </Suspense>
  );
}
