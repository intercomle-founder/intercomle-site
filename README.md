# IntercomLE Official Website & Legal Pages (`intercomle-site`)

Site estático multi-idioma (**EN / PT / ES**), responsivo (*mobile-first*) e pronto para publicação gratuita no **GitHub Pages** (`https://intercomle-founder.github.io/intercomle-site/`).

## Estrutura
- `index.html` — Landing page interativa (simulador L⇄R ao vivo, paletas de cor do app, matriz de compatibilidade e Beta *Founding Member*)
- `privacy.html` — Política de Privacidade (LGPD, GDPR e Data Safety da Google Play)
- `terms.html` — Termos de Uso (isenção de hardware Bluetooth, CTB/trânsito e licença Pro vitalícia)
- `support.html` — Central de suporte, configuração de Bluetooth LE Audio e envio de feedback Beta
- `styles.css`, `app.js`, `i18n.js`, `assets/favicon.svg`, `.nojekyll`

## Como subir para o GitHub Pages (repositório público separado do código Android)

1. Crie no GitHub (conta `intercomle-founder`) um repositório **público** chamado **`intercomle-site`**.
2. No PowerShell, entre nesta pasta e envie os arquivos:

```powershell
cd C:\Dev\intercomle-site
git init
git branch -M main
git add .
git commit -m "Publish IntercomLE landing page and legal docs"
git remote add origin https://github.com/intercomle-founder/intercomle-site.git
git push -u origin main
```

3. No GitHub, abra **`intercomle-site` > Settings > Pages**:
   - **Source:** `Deploy from a branch`
   - **Branch:** `main` / `/ (root)` → **Save**.
4. Aguarde ~1 minuto. Seus links oficiais para colar no **Google Play Console** serão:
   - **Site:** `https://intercomle-founder.github.io/intercomle-site/`
   - **Política de Privacidade:** `https://intercomle-founder.github.io/intercomle-site/privacy.html`
   - **Termos / Suporte:** `https://intercomle-founder.github.io/intercomle-site/support.html`
