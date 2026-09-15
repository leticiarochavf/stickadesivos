/*
 * AJUSTA OS PRODUTOS DA LOJA PELA API
 * -------------------------------------------------------------
 * O painel da Nuvemshop não aceita preenchimento automático: é uma
 * aplicação React que ignora valor escrito por fora. Então estes
 * ajustes vão pela API, que é confiável e registra o que mudou.
 *
 * O que este script faz:
 *   1. corrige o endereço (URL) de cada produto
 *   2. preenche título e descrição de SEO
 *   3. põe cada produto na categoria certa
 *
 * O que ele NÃO faz, de propósito:
 *   - não mexe em preço
 *   - não mexe em peso, dimensão nem estoque
 *   - não apaga nada
 *
 * Como usar:
 *   1. preencha NUVEMSHOP_ACCESS_TOKEN no .env
 *   2. node scripts/ajustar-produtos.mjs          (só mostra o que faria)
 *   3. node scripts/ajustar-produtos.mjs --aplicar  (grava de verdade)
 *
 * Exige a permissão "Write products" no app, liberada no Portal de
 * Parceiros. Se o token foi gerado antes disso, reinstale o app
 * para receber um token com a permissão nova.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function carregarEnv() {
  try {
    const conteudo = readFileSync(resolve(process.cwd(), '.env'), 'utf8');
    conteudo.split(/\r?\n/).forEach((linha) => {
      const par = linha.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
      if (!par || process.env[par[1]] !== undefined) return;
      process.env[par[1]] = par[2].replace(/^(['"])(.*)\1$/, '$2');
    });
  } catch {
    /* sem .env: usa as variáveis do ambiente */
  }
}

carregarEnv();

const STORE_ID = process.env.NUVEMSHOP_STORE_ID;
const TOKEN = process.env.NUVEMSHOP_ACCESS_TOKEN;
const USER_AGENT =
  process.env.NUVEMSHOP_USER_AGENT || 'StickAdesivos (contato@stickadesivos.com.br)';

const APLICAR = process.argv.includes('--aplicar');

if (!STORE_ID || !TOKEN) {
  console.error('Faltam NUVEMSHOP_STORE_ID e NUVEMSHOP_ACCESS_TOKEN no .env.');
  process.exit(1);
}

async function api(caminho, opcoes = {}) {
  const resposta = await fetch(
    `https://api.nuvemshop.com.br/2025-03/${STORE_ID}${caminho}`,
    {
      method: opcoes.method || 'GET',
      headers: {
        Authentication: `bearer ${TOKEN}`,
        'User-Agent': USER_AGENT,
        'Content-Type': 'application/json'
      },
      body: opcoes.body ? JSON.stringify(opcoes.body) : undefined
    }
  );

  const texto = await resposta.text();
  const dados = texto ? JSON.parse(texto) : null;

  if (!resposta.ok) {
    const erro = new Error(`HTTP ${resposta.status}`);
    erro.detalhe = dados;
    throw erro;
  }

  return dados;
}

/*
 * O que cada produto deve ter. O título respeita 70 caracteres e a
 * descrição, 160 — limites que o próprio painel indica.
 */
const AJUSTES = [
  {
    id: 323949408,
    handle: 'adesivo-redondo-personalizado',
    categoria: 'Adesivos Personalizados',
    seo_title: 'Adesivo Redondo Personalizado em Criciúma | Stick Adesivos',
    seo_description:
      'Adesivo redondo personalizado com a sua arte, em vinil. Tamanhos de 3x3 a 10x10 cm. Produção em Criciúma/SC e envio para todo o Brasil.'
  },
  {
    id: 323949603,
    handle: 'adesivo-quadrado-personalizado',
    categoria: 'Adesivos Personalizados',
    seo_title: 'Adesivo Quadrado Personalizado | Stick Adesivos Criciúma',
    seo_description:
      'Adesivo quadrado personalizado em vinil, impresso com a sua arte. Ideal para embalagem, rótulo e identificação de produto. Criciúma/SC.'
  },
  {
    id: 323949707,
    handle: 'lacre-de-seguranca-void',
    categoria: 'Lacres de Segurança',
    seo_title: 'Lacre de Segurança VOID Personalizado | Stick Adesivos',
    seo_description:
      'Lacre com efeito VOID: mostra se a embalagem foi aberta. Personalizado com a sua marca. Criciúma/SC, envio para todo o Brasil.'
  },
  {
    id: 323949768,
    handle: 'etiqueta-personalizada-em-rolo',
    categoria: 'Etiquetas',
    seo_title: 'Etiqueta Personalizada em Rolo | Stick Adesivos',
    seo_description:
      'Etiqueta em rolo personalizada para potes, caixas e embalagens. Impressa com a sua arte, pronta para aplicar. Criciúma/SC.'
  }
];

function textoPt(valor) {
  if (typeof valor === 'string') return valor;
  if (!valor || typeof valor !== 'object') return '';
  return valor.pt || Object.values(valor)[0] || '';
}

async function principal() {
  console.log(APLICAR ? 'Modo: APLICANDO alterações\n' : 'Modo: simulação, nada será gravado\n');

  const categorias = await api('/categories?per_page=100');
  const porNome = new Map(
    categorias.map((categoria) => [textoPt(categoria.name).trim(), categoria.id])
  );

  console.log('Categorias da loja:');
  for (const [nome, id] of porNome) console.log(`  ${id}  ${nome}`);
  console.log();

  for (const ajuste of AJUSTES) {
    const produto = await api(`/products/${ajuste.id}`);
    const nome = textoPt(produto.name);
    const handleAtual = textoPt(produto.handle);
    const categoriaId = porNome.get(ajuste.categoria);

    console.log(`- ${nome}`);
    console.log(`    endereço : ${handleAtual}  ->  ${ajuste.handle}`);
    console.log(`    categoria: ${(produto.categories || []).map((c) => textoPt(c.name)).join(', ') || '(nenhuma)'}  ->  ${ajuste.categoria}`);
    console.log(`    SEO      : ${textoPt(produto.seo_title) || '(vazio)'}  ->  ${ajuste.seo_title}`);

    if (!categoriaId) {
      console.log(`    ATENÇÃO: categoria "${ajuste.categoria}" não existe na loja. Produto não alterado.\n`);
      continue;
    }

    if (!APLICAR) {
      console.log('    (simulação)\n');
      continue;
    }

    try {
      await api(`/products/${ajuste.id}`, {
        method: 'PUT',
        body: {
          handle: { pt: ajuste.handle },
          seo_title: { pt: ajuste.seo_title },
          seo_description: { pt: ajuste.seo_description },
          categories: [categoriaId]
        }
      });
      console.log('    gravado\n');
    } catch (erro) {
      console.log(`    FALHOU: ${erro.message}`, JSON.stringify(erro.detalhe)?.slice(0, 200), '\n');
    }
  }

  if (!APLICAR) {
    console.log('Nada foi gravado. Rode de novo com --aplicar para valer.');
  }
}

principal().catch((erro) => {
  console.error('Erro:', erro.message, JSON.stringify(erro.detalhe)?.slice(0, 300));
  process.exit(1);
});
