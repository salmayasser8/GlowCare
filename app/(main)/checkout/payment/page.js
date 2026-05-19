import { Suspense } from "react";
import PaymentClient from "./PaymentClient";

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <PaymentClient />
    </Suspense>
  );
}
