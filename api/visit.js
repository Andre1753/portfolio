export default async function handler(req, res) {
    // 1. Configurar CORS (Para permitir que o seu GitHub Pages acesse a API)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*'); // No futuro, troque pelo seu link do GitHub Pages
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { SUPABASE_URL, SUPABASE_KEY } = process.env;

    // Rota POST: Cria a visita (Telemetria inicial)
    if (req.method === 'POST') {
        const { referrer, screen, lang, ua } = req.body;

        const response = await fetch(`${SUPABASE_URL}/rest/v1/visits`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({
                referrer,
                screen_res: screen,
                language: lang,
                user_agent: ua
            })
        });

        const data = await response.json();
        return res.status(201).json(data[0]);
    }

    // Rota PATCH: Atualiza com os dados do Formulário
    if (req.method === 'PATCH') {
        const { id, visitor_name, company, job_title, contact_info } = req.body;

        if (!id) return res.status(400).json({ error: 'ID da visita não encontrado' });

        await fetch(`${SUPABASE_URL}/rest/v1/visits?id=eq.${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            },
            body: JSON.stringify({
                visitor_name,
                company,
                job_title,
                contact_info
            })
        });

        return res.status(200).json({ success: true });
    }

    return res.status(405).json({ message: 'Método não permitido' });
}