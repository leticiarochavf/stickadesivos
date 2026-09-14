import { ImageSourcePropType } from 'react-native';

/*
 * Catálogo alinhado com a loja Nuvemshop real (store_id 7130945),
 * conferido no painel e na loja publicada em 13/09/2026.
 *
 * nuvemshopProductId e nuvemshopVariantId são obrigatórios para a
 * ponte NubeSDK: o comando cart:add envia product_id + variant_id
 * para o carrinho nativo. Sem eles o item não entra no carrinho.
 *
 * Quando a API estiver configurada, /api/products substitui esta
 * lista. Ela continua aqui como conteúdo visual de reserva.
 */

const productImages = {
  redondo: require('../../assets/images/products/loja/redondo.webp'),
  quadrado: require('../../assets/images/products/loja/quadrado.webp'),
  lacre: require('../../assets/images/products/loja/lacre-void.webp'),
  etiqueta: require('../../assets/images/products/loja/etiqueta-rolo.webp')
} as const;

export type Product = {
  id: number;
  slug: string;
  name: string;
  price: number;
  compareAt?: number;
  category: string;
  format: string;
  material: string;
  badge: string;
  image: ImageSourcePropType;
  description: string;
  nuvemshopProductId?: number;
  nuvemshopVariantId?: number;
  nuvemshopVariants?: Array<{ id: number; label: string; price: number }>;
};

export const products: Product[] = [
  {
    id: 323949408,
    slug: 'adesivo-redondo-personalizado',
    name: 'Adesivo Redondo Personalizado',
    price: 72,
    compareAt: 80,
    category: 'Adesivos',
    format: 'Redondo',
    material: 'Vinil',
    badge: 'MAIS VENDIDO',
    image: productImages.redondo,
    description:
      'Adesivo redondo com impressão nítida e acabamento resistente, em quatro tamanhos ou na medida que você precisar.',
    nuvemshopProductId: 323949408,
    nuvemshopVariantId: 1585367392,
    nuvemshopVariants: [
      { id: 1585367392, label: '5x5 cm', price: 72 },
      { id: 1585367393, label: '7x7 cm', price: 72 },
      { id: 1585367394, label: '10x10 cm', price: 72 },
      { id: 1586782533, label: '3x3 cm', price: 72 }
      /* A variação "Personalizado" (1586782532) está sem preço na
         Nuvemshop, então fica fora até ser precificada. */
    ]
  },
  {
    id: 323949603,
    slug: 'adesivo-personalizado-quadrado',
    name: 'Adesivo Personalizado Quadrado',
    price: 120,
    compareAt: 150,
    category: 'Adesivos',
    format: 'Quadrado',
    material: 'Vinil',
    badge: 'PERSONALIZÁVEL',
    image: productImages.quadrado,
    description:
      'Formato quadrado para embalagens, rótulos e materiais da sua marca, impresso na sua arte.',
    nuvemshopProductId: 323949603,
    nuvemshopVariantId: 1435836401,
    nuvemshopVariants: [{ id: 1435836401, label: 'Padrão', price: 120 }]
  },
  {
    id: 323949707,
    slug: 'lacre-seguranca-void',
    name: 'Lacre de Segurança VOID',
    price: 180,
    compareAt: 330,
    category: 'Lacres',
    format: 'Retangular',
    material: 'Void',
    badge: 'MAIS VENDIDO',
    image: productImages.lacre,
    description:
      'Lacre com efeito Void: se alguém tentar abrir a embalagem, a marca de violação fica visível.',
    nuvemshopProductId: 323949707,
    nuvemshopVariantId: 1435836804,
    nuvemshopVariants: [{ id: 1435836804, label: 'Padrão', price: 180 }]
  },
  {
    id: 323949768,
    slug: 'etiqueta-personalizada-rolo',
    name: 'Etiqueta Personalizada em Rolo',
    price: 100,
    compareAt: 120,
    category: 'Etiquetas',
    format: 'Rolo',
    material: 'Vinil',
    badge: '',
    image: productImages.etiqueta,
    description:
      'Etiqueta em rolo, pronta para aplicar em potes, caixas e embalagens do seu produto.',
    nuvemshopProductId: 323949768,
    nuvemshopVariantId: 1435837134,
    nuvemshopVariants: [{ id: 1435837134, label: 'Padrão', price: 100 }]
  }
];

/*
 * Procura o produto pelo slug. A lista pode vir da API (catálogo da
 * loja) ou desta lista local. Quando o slug não existe, devolve o
 * primeiro produto disponível, para a tela nunca ficar sem conteúdo.
 */
export function findProduct(
  slug?: string | string[],
  lista: Product[] = products
): Product {
  const disponiveis = lista.length ? lista : products;
  const alvo = Array.isArray(slug) ? slug[0] : slug;
  const achado = alvo
    ? disponiveis.find((product) => product.slug === alvo)
    : undefined;

  return achado ?? disponiveis[0];
}
