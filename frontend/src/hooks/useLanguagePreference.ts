import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Language } from '../translations';

/**
 * Custom hook to manage user's language preference with database persistence
 * - Loads language from database on mount
 * - Saves language to database when changed
 * - Persists across sessions
 */
export function useLanguagePreference(userId: string | undefined) {
  const [language, setLanguage] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(true);

  // Load language preference from database
  useEffect(() => {
    const loadLanguagePreference = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('preferred_language')
          .eq('id', userId)
          .single();

        if (error) throw error;

        if (data?.preferred_language) {
          setLanguage(data.preferred_language as Language);
        }
      } catch (error) {
        console.error('Error loading language preference:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLanguagePreference();
  }, [userId]);

  // Save language preference to database
  const updateLanguage = async (newLanguage: Language) => {
    setLanguage(newLanguage);

    if (!userId) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({ preferred_language: newLanguage })
        .eq('id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  };

  return {
    language,
    setLanguage: updateLanguage,
    isLoading
  };
}
