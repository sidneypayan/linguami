const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://capnpewksfdnllttnvzu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhcG5wZXdrc2ZkbmxsdHRudnp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzU1MzUwMiwiZXhwIjoyMDc5MTI5NTAyfQ.iU3xNj5CO_RBtGCCNpXl5LeobwRf1VGxV17sOqKPtDY'
);

async function updateConversationBlock() {
  // Get current lesson
  const { data: lesson, error: fetchError } = await supabase
    .from('course_lessons')
    .select('id, blocks_fr')
    .eq('slug', 'saluer-prendre-conge')
    .single();

  if (fetchError) {
    console.error('Error fetching:', fetchError);
    return;
  }

  // Find and update the conversation block
  const blocks = lesson.blocks_fr;
  const conversationIndex = blocks.findIndex(b => b.type === 'conversation');
  
  if (conversationIndex === -1) {
    console.error('Conversation block not found');
    return;
  }

  // Update dialogue - change last exchange
  blocks[conversationIndex].dialogue = [
    {
      "text": "Bonsoir !",
      "speaker": "Inconnu(e)"
    },
    {
      "text": "...",
      "speaker": "Vous"
    },
    {
      "text": "Je m'appelle Claire. Et vous ?",
      "speaker": "Inconnu(e)"
    },
    {
      "text": "...",
      "speaker": "Vous"
    },
    {
      "text": "Enchantée ! Bonne soirée !",
      "speaker": "Inconnu(e)"
    },
    {
      "text": "...",
      "speaker": "Vous"
    }
  ];

  // Update questions to match
  blocks[conversationIndex].questions = [
    {
      "answer": "Bonsoir !",
      "question": "Comment répondre à \"Bonsoir !\" ?"
    },
    {
      "answer": "Je m'appelle [votre prénom]. / Moi, c'est [votre prénom]. Enchanté(e) !",
      "question": "Comment vous présenter après \"Et vous ?\" ?"
    },
    {
      "answer": "Enchanté(e) ! Bonne soirée ! / Merci, à vous aussi !",
      "question": "Comment répondre poliment à \"Bonne soirée !\" ?"
    }
  ];

  // Update the lesson
  const { error: updateError } = await supabase
    .from('course_lessons')
    .update({ blocks_fr: blocks })
    .eq('id', lesson.id);

  if (updateError) {
    console.error('Error updating:', updateError);
    return;
  }

  console.log('Conversation block updated successfully!');
}

updateConversationBlock();
