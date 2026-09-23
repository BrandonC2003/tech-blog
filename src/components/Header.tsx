import Link from "next/link";
import GitHubButton from "./GitHubButton";
import { NOMBRE_SITIO } from "@/lib/sitio";

export default function Header() {
  return (
    <header>
      <nav>
        <Link href="/">{NOMBRE_SITIO}</Link> <GitHubButton />
      </nav>
    </header>
  );
}
