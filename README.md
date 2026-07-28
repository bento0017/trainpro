# TrainPro — site

Página pública do TrainPro, software de gestão para ginásios e personal
trainers. HTML, CSS e JS estáticos: sem build, sem dependências, sem framework.

| Ficheiro | O quê |
|---|---|
| `index.html` | A página inteira |
| `styles.css` | Tokens e estilos |
| `app.js` | Leitor de entrada, seletor mensal/anual, revelações no scroll |

## Ver localmente

```bash
python3 -m http.server 8899
```

Depois abre <http://localhost:8899>.

## Notas

- Os preços estão escritos no HTML, em `data-monthly` e `data-annual` de cada
  `.plan__price`. Ao mudarem os preços, mudam aqui.
- O leitor de entrada do hero é uma simulação: os nomes são inventados.
- Sem testemunhos nem números de clientes, de propósito.

Contacto: contacttrainproapp@gmail.com
