'use client';

import Link from 'next/link';

interface BrandCardProps {
  name: string;
  logo?: string; // URL логотипа (опционально)
}

export default function BrandCard({ name, logo }: BrandCardProps) {
  return (
    <Link
      href={`/catalog?brand=${encodeURIComponent(name)}`}
      className="group block"
    >
      <div className="card h-full min-h-[120px] flex flex-col items-center justify-center p-6 transition-all duration-200 hover:scale-105 hover:shadow-2xl hover:border-accent-blue/50 cursor-pointer">
        {/* Логотип или первая буква */}
        <div className="w-16 h-16 mb-3 flex items-center justify-center bg-gradient-to-br from-accent-blue/20 to-accent-blue-dark/20 rounded-xl group-hover:from-accent-blue/30 group-hover:to-accent-blue-dark/30 transition-all duration-200">
          {logo ? (
            <img
              src={logo}
              alt={`${name} logo`}
              className="w-12 h-12 object-contain"
            />
          ) : (
            <span className="text-2xl font-bold text-accent-blue">
              {name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {/* Название бренда */}
        <h3 className="text-base sm:text-lg font-semibold text-center text-dark-bg group-hover:text-accent-blue transition-colors duration-200">
          {name}
        </h3>
      </div>
    </Link>
  );
}
