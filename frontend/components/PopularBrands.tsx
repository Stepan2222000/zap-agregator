import BrandCard from './BrandCard';

const POPULAR_BRANDS = [
  { name: 'Audi' },
  { name: 'BMW' },
  { name: 'Mercedes' },
  { name: 'Toyota' },
  { name: 'Volkswagen' },
  { name: 'Ford' },
  { name: 'Nissan' },
  { name: 'Honda' },
  { name: 'Mazda' },
  { name: 'Hyundai' },
  { name: 'Kia' },
  { name: 'Renault' },
];

export default function PopularBrands() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Заголовок секции */}
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Популярные бренды
          </h2>
          <p className="text-dark-text-secondary text-lg sm:text-xl max-w-2xl mx-auto">
            Найдите запчасти для вашего автомобиля от ведущих производителей
          </p>
        </div>

        {/* Сетка брендов */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {POPULAR_BRANDS.map((brand) => (
            <BrandCard key={brand.name} name={brand.name} />
          ))}
        </div>
      </div>
    </section>
  );
}
