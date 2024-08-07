import Link from "next/link";
import { Metric } from "@tremor/react";

export function Logo() {
  return (
    <Link href="/dashboard">
      <Metric className="font-black tracking-tight uppercase text-5xl">
        <span className="text-sky-600">EX</span>
        TRAS
      </Metric>
    </Link>
  );
}
