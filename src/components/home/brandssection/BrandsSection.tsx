import Image from "next/image";

const brands = [
  { id: 1, name: "Nike", image: "/brands/nike.png" },
  { id: 2, name: "Adidas", image: "/brands/adidas.png" },
  { id: 3, name: "Puma", image: "/brands/puma.png" },
  { id: 4, name: "Reebok", image: "/brands/reebok.png" },
  { id: 5, name: "New Balance", image: "/brands/newbalance.png" },
  { id: 6, name: "Under Armour", image: "/brands/underarmour.png" },
];

const BrandsSection = () => {
  return (
    <section className="py-8 px-12">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 justify-items-center">
        {brands.map((brand) => (
          <div key={brand.id} className="flex items-center justify-center">
            <Image 
              src={brand.image} 
              alt={brand.name} 
              width={100} 
              height={50} 
              className="w-auto h-12 object-contain"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default BrandsSection;
