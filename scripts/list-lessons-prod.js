const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://psomseputtsdizmmqugy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzb21zZXB1dHRzZGl6bW1xdWd5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTk0NTkzOSwiZXhwIjoyMDU1NTIxOTM5fQ.4fCtRWcobxYPt2_egoqGyD9u82G_LdgIOfi8u28VvSs'
);

async function main() {
  const { data: lessons } = await supabase
    .from('lessons')
    .select('id, title_fr, level, lang')
    .order('lang')
    .order('level')
    .order('order');

  console.log('=== TOUTES LES LECONS (' + (lessons?.length || 0) + ') ===\n');

  // Group by lang and level
  const byLang = {};
  lessons?.forEach(l => {
    const key = l.lang + '-' + l.level;
    if (!byLang[key]) byLang[key] = [];
    byLang[key].push(l);
  });

  for (const [key, list] of Object.entries(byLang).sort()) {
    console.log(key.toUpperCase() + ' (' + list.length + ' lecons):');
    list.forEach((l, i) => console.log('   ' + (i + 1) + '. ' + l.title_fr));
    console.log('');
  }

  // Summary
  console.log('=== RESUME ===');
  const langs = [...new Set(lessons?.map(l => l.lang) || [])];
  for (const lang of langs) {
    const langLessons = lessons?.filter(l => l.lang === lang) || [];
    console.log(lang.toUpperCase() + ': ' + langLessons.length + ' lecons totales');
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    levels.forEach(lvl => {
      const count = langLessons.filter(l => l.level === lvl).length;
      if (count > 0) console.log('  ' + lvl + ': ' + count);
    });
  }
}

main();
