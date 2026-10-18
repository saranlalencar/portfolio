import { profile } from '@/data'
import { isFilled } from '@/lib/placeholder'

/**
 * Rodape enxuto de proposito.
 *
 * Ele nao repete os canais de contato nem a formacao: a secao de Contato
 * vem imediatamente acima com os tres canais, e o hero ja diz o curso e a
 * instituicao. Repetir tudo aqui era a mesma informacao duas vezes, a poucos
 * centimetros de distancia. O que fica e so o fecho da pagina — assinatura,
 * credito tecnico e o cinturao de Orion.
 */
export function Footer() {
  const year = new Date().getFullYear()

  /*
    Rodape sem fundo proprio (a cor base vem do `body`): o halo de Contato
    transborda de proposito para ca — e o que costura a ultima secao no
    rodape. Um `bg-night` opaco aqui pintava por cima desse transbordo e
    deixava um corte reto na emenda: medido, salto de 27 (de 255) em um
    pixel na borda direita, no modo claro. Mesmo defeito que as secoes
    tinham. O `overflow-hidden` fica — ele existe para a marca-d'agua de
    Orion, posicionada para fora da caixa de proposito.
  */
  return (
    <footer className="relative overflow-hidden">
      {/*
        Marca-d'agua de Orion: o mesmo cinturao da marca e do hero, so que
        quieto — ~8% de opacidade, sem animacao. Assina a pagina sem repetir o
        campo interativo do hero.
      */}
      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        className="pointer-events-none absolute -bottom-10 -right-8 size-56 text-iris opacity-[0.08] sm:size-72"
      >
        <g stroke="currentColor" strokeWidth="1.2" fill="none">
          <path d="M30 10 72 15 40 50 50 55 60 60 33 94 75 90" />
        </g>
        <g fill="currentColor">
          <circle cx="30" cy="10" r="2.6" />
          <circle cx="72" cy="15" r="2.4" />
          <circle cx="40" cy="50" r="2" />
          <circle cx="50" cy="55" r="2.2" />
          <circle cx="60" cy="60" r="2" />
          <circle cx="33" cy="94" r="2.4" />
          <circle cx="75" cy="90" r="2.6" />
        </g>
      </svg>

      <div className="container-page relative pb-12 pt-8 sm:pb-14">
        <div className="flex flex-col gap-3 border-t border-line pt-8 text-xs text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {isFilled(profile.name) ? profile.name : 'Portfólio'}. Todos os direitos reservados.
          </p>
          <p className="tracking-wide">Construído com React, TypeScript, Vite e Tailwind CSS.</p>
        </div>

        {/* Ultimo detalhe da pagina: o cinturao de Orion, o mesmo motivo da marca e do hero. */}
        <div className="mt-8 flex justify-center">
          <span className="orion-belt" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </div>
      </div>
    </footer>
  )
}
