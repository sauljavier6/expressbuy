import Image from "next/image";

const Footer = () => {
  const pros = [
    { icon: "/icons/transport.png", title: "FREE SHIPPING & RETURN", description: "Free shipping on all orders over $99." },
    { icon: "/icons/dollar.png", title: "MONEY BACK GUARANTEE", description: "100% money-back guarantee." },
    { icon: "/icons/24-hours-support.png", title: "LIVE SUPPORT 24/7", description: "Get support anytime." },
  ];

  const socialMedia = [
    { icon: "/icons/facebook.png", alt: "Facebook" },
    { icon: "/icons/instagram.png", alt: "Instagram" },
  ];

  const paymentMethods = [
    { icon: "/icons/visa.png", alt: "Visa" },
    { icon: "/icons/mastercard.png", alt: "MasterCard" },
    { icon: "/icons/paypal.png", alt: "PayPal" },
    { icon: "/icons/AmericanExpress.png", alt: "AmericanExpress" },
  ];

  return (
    <footer className="bg-gray-900 text-white py-10 px-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Beneficios (lado izquierdo) */}
        <div className="space-y-4">
          {pros.map((pro, index) => (
            <div key={index} className="flex items-center space-x-3">
              <Image src={pro.icon} alt={pro.title} width={40} height={40} />
              <div>
                <h3 className="text-sm font-semibold">{pro.title}</h3>
                <p className="text-xs text-gray-400">{pro.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Redes sociales y métodos de pago (lado derecho) */}
        <div className="flex flex-col space-y-6 items-end">
          {/* Redes Sociales */}
          <div>
            <h3 className="text-sm font-semibold mb-2 text-right">Follow Us</h3>
            <div className="flex space-x-4 justify-end">
              {socialMedia.map((social, index) => (
                <Image key={index} src={social.icon} alt={social.alt} width={30} height={30} />
              ))}
            </div>
          </div>

          {/* Métodos de Pago */}
          <div>
            <h3 className="text-sm font-semibold mb-2 text-right">Payment Methods</h3>
            <div className="flex space-x-4 justify-end">
              {paymentMethods.map((payment, index) => (
                <Image key={index} src={payment.icon} alt={payment.alt} width={50} height={30} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Derechos Reservados */}
      <div className="text-center mt-8 text-sm">
        © {new Date().getFullYear()} ExpressBuy - All rights reserved. by     <a href="https://www.facebook.com/profile.php?id=61571089566319&locale=es_LA" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Souls Web Solutions</a> 
      </div>
    </footer>
  );
};

export default Footer;
