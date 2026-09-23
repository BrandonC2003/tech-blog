import type { Metadata } from "next";
import { Chakra_Petch, IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// next/font descarga las fuentes al compilar y las sirve desde tu dominio.
// `variable` crea una variable CSS que globals.css conecta con Tailwind.
const chakra = Chakra_Petch({
  variable: "--font-chakra",
  subsets: ["latin"],
  weight: ["500", "600", "700"], // no es una fuente variable: hay que elegir pesos
});

const plex = IBM_Plex_Sans({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tech Blog",
  description: "Artículos sobre Next.js, bases de datos, frontend y más",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${chakra.variable} ${plex.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Header />
        {/* flex-1 empuja el footer al fondo aunque la página tenga poco contenido */}
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
