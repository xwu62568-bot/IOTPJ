# 温室APP

This is a code bundle for 温室APP. The original project is available at:
https://www.figma.com/design/ZJvaPbeueHgxniIECEcgZa/%E6%B8%A9%E5%AE%A4APP.

## Local Development

```bash
npm install
npm run dev
```

## Build And Preview

```bash
npm run build
npm run preview
```

## Deploy To Vercel

1. Push this repository to GitHub.
2. In Vercel, import the repository.
3. Set project config:
   - Root Directory: `APP`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add environment variables in Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy.

`vercel.json` is already included for SPA route rewrites.

## Supabase Client

Supabase client is defined in `src/lib/supabase.ts`.

  
