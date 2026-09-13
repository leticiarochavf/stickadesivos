import { ImageSourcePropType } from 'react-native';

const productImages = {
  1: require('../../assets/images/products/product-1.png'),
  2: require('../../assets/images/products/product-2.png'),
  3: require('../../assets/images/products/product-3.png'),
  4: require('../../assets/images/products/product-4.png'),
  5: require('../../assets/images/products/product-5.png'),
  6: require('../../assets/images/products/product-6.png'),
  7: require('../../assets/images/products/product-7.png'),
  8: require('../../assets/images/products/product-8.png'),
  9: require('../../assets/images/products/product-9.png'),
  10: require('../../assets/images/products/product-10.png')
} as const;

export type Product = {
  id: number;
  slug: string;
  name: string;
  price: number;
  category: string;
  format: string;
  material: string;
  badge: string;
  image: ImageSourcePropType;
  description: string;
};

export const products: Product[] = [
  { id: 1, slug: 'adesivo-redondo-personalizado', name: 'Adesivo Redondo Personalizado', price: 59.9, category: 'Adesivos', format: 'Redondo', material: 'Vinil Brilho', badge: 'MAIS VENDIDO', image: productImages[1], description: 'Adesivos redondos com impressão nítida e acabamento resistente para destacar sua marca.' },
  { id: 2, slug: 'adesivo-retangular-personalizado', name: 'Adesivo Retangular Personalizado', price: 69.9, category: 'Adesivos', format: 'Retangular', material: 'Vinil Brilho', badge: 'PERSONALIZÁVEL', image: productImages[2], description: 'Formato versátil para embalagens, etiquetas e materiais da sua empresa.' },
  { id: 3, slug: 'adesivo-feito-com-amor', name: 'Adesivo Feito com Amor', price: 49.9, category: 'Adesivos Prontos', format: 'Redondo', material: 'Vinil Fosco', badge: '', image: productImages[3], description: 'Uma opção pronta e delicada para fechar embalagens e agradecer seus clientes.' },
  { id: 4, slug: 'adesivo-obrigado-pela-compra', name: 'Adesivo Obrigado pela Compra', price: 39.9, category: 'Adesivos Prontos', format: 'Retangular', material: 'Vinil Fosco', badge: '', image: productImages[4], description: 'Adesivo pronto para deixar cada pedido mais especial.' },
  { id: 5, slug: 'adesivo-holografico-personalizado', name: 'Adesivo Holográfico Personalizado', price: 99.9, category: 'Adesivos', format: 'Redondo', material: 'Holográfico', badge: 'PERSONALIZÁVEL', image: productImages[5], description: 'Acabamento holográfico que muda com a luz e valoriza a apresentação do produto.' },
  { id: 6, slug: 'adesivo-transparente-personalizado', name: 'Adesivo Transparente Personalizado', price: 79.9, category: 'Adesivos', format: 'Retangular', material: 'Transparente', badge: 'PERSONALIZÁVEL', image: productImages[6], description: 'A transparência certa para aplicações em vidros, potes e embalagens.' },
  { id: 7, slug: 'lacre-seguranca-personalizado', name: 'Lacre de Segurança Personalizado', price: 149.9, category: 'Lacres', format: 'Retangular', material: 'Void', badge: 'MAIS VENDIDO', image: productImages[7], description: 'Lacres de segurança personalizados para proteger e identificar suas embalagens.' },
  { id: 8, slug: 'adesivo-oval-personalizado', name: 'Adesivo Oval Personalizado', price: 59.9, category: 'Adesivos', format: 'Oval', material: 'Vinil Brilho', badge: 'PERSONALIZÁVEL', image: productImages[8], description: 'Formato oval para uma aplicação diferente e marcante.' },
  { id: 9, slug: 'adesivo-redes-sociais', name: 'Adesivo para Redes Sociais', price: 29.9, category: 'Etiquetas', format: 'Recortado', material: 'Vinil Brilho', badge: '', image: productImages[9], description: 'Leve seus canais digitais para as embalagens e facilite o contato com seus clientes.' },
  { id: 10, slug: 'adesivo-artesanal', name: 'Adesivo Artesanal Personalizado', price: 49.9, category: 'Etiquetas', format: 'Redondo', material: 'Kraft', badge: 'ARTESANAL', image: productImages[10], description: 'Acabamento kraft com aparência artesanal para marcas autorais e produtos feitos à mão.' }
];

export function findProduct(slug?: string) {
  return products.find((product) => product.slug === slug) ?? products[0];
}
