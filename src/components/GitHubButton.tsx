import { REPO_URL } from "@/lib/sitio";

// Enlace externo: se usa <a> y no <Link>, porque sale de nuestra app
export default function GitHubButton({ texto = "GitHub" }: { texto?: string }) {
  return (
    <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
      {texto}
    </a>
  );
}
