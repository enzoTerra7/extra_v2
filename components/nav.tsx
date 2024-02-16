import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClassNameValue } from "tailwind-merge";
import { motion } from "framer-motion";

interface Nav {
  containerStyle: ClassNameValue;
  linkStyle: ClassNameValue;
  underlineStyle: ClassNameValue;
}

const links = [
  { path: "/", name: "Home" },
  { path: "/projects", name: "Projetos" },
  { path: "/contact", name: "Contato" },
];

export function Nav({ containerStyle, linkStyle, underlineStyle }: Nav) {
  const path = usePathname();

  return (
    <nav className={cn("", containerStyle)}>
      {links.map((link, index) => (
        <Link
          href={link.path}
          key={index}
          className={cn(
            `capitalize ${(link.path == path && "text-primary font-bold") || ""}`,
            linkStyle,
          )}
        >
          {link.path == path && (
            <motion.span
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              transition={{ type: "tween" }}
              layoutId="underline"
              className={cn("", underlineStyle)}
            />
          )}
          {link.name}
        </Link>
      ))}
    </nav>
  );
}
