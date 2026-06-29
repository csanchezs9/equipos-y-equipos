import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/data/catalog";
import { ArrowRight } from "@/components/icons";

export function ProductCard({
  product,
  reveal = true,
}: {
  product: Product;
  index?: number;
  reveal?: boolean;
}) {
  return (
    <Link
      href={`/equipos/${product.slug}`}
      {...(reveal ? { "data-reveal": "scale" } : {})}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-ink-2 transition-colors duration-500 hover:border-brand/60"
    >
      <div className="relative aspect-square overflow-hidden bg-white sm:aspect-4/3">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1280px) 30vw, 22vw"
            className="object-contain p-2 transition-transform duration-700 [transition-timing-function:var(--ease-out-expo)] group-hover:scale-105 sm:p-6"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-mute">
            sin imagen
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3 sm:gap-2 sm:p-5">
        {product.categoryNames[0] && (
          <span className="kicker line-clamp-1 text-[0.5rem] sm:text-[0.62rem]">
            {product.categoryNames[0]}
          </span>
        )}
        <h3 className="font-display text-sm leading-tight text-bone sm:text-lg">
          {product.name}
        </h3>
        <p className="hidden text-sm text-mute sm:line-clamp-2 sm:block">
          {product.description}
        </p>

        <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-xs font-medium text-brand sm:pt-3 sm:text-sm">
          Ver ficha
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 sm:h-4 sm:w-4" />
        </span>
      </div>
    </Link>
  );
}
