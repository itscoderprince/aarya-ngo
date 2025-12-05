import { Suspense } from "react";
import DonateClient from "./DonateClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DonateClient />
    </Suspense>
  );
}
