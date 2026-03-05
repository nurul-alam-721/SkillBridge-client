import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Category } from "@/services/tutor.service";
import { getCategoryConfig } from "../categories/CategoryCard";

interface CategoriesSectionProps {
  categories: Category[];
}

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  if (categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">
            Subjects
          </p>
          <h2 className="text-2xl font-bold tracking-tight">Browse by Category</h2>
        </div>
        <Link
          href="/categories"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {categories.slice(0, 8).map((cat) => {
          const { icon: Icon, color } = getCategoryConfig(cat.name);
          return (
            <Link
              key={cat.id}
              href={`/tutors?categoryId=${cat.id}`}
              className="group flex items-center gap-3 rounded-2xl border bg-card px-5 py-5 transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${color}`}>
                <Icon className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{cat.name}</p>
                {cat.description && (
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {cat.description}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}