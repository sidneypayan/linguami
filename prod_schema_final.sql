--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 17.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--
-- Name: calculate_level_from_xp(integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.calculate_level_from_xp(total_xp integer) RETURNS TABLE(level integer, xp_in_level integer, xp_for_next_level integer)
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
  current_level INTEGER := 1;
  xp_required INTEGER;
  xp_accumulated INTEGER := 0;
BEGIN
  LOOP
    xp_required := get_xp_for_level(current_level);

    IF xp_accumulated + xp_required > total_xp THEN
      EXIT;
    END IF;

    xp_accumulated := xp_accumulated + xp_required;
    current_level := current_level + 1;
  END LOOP;

  RETURN QUERY SELECT
    current_level,
    total_xp - xp_accumulated,
    get_xp_for_level(current_level);
END;
$$;


--
-- Name: cleanup_old_verification_tokens(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.cleanup_old_verification_tokens() RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    -- Supprimer les tokens expirés depuis plus de 7 jours
    DELETE FROM public.email_verification_tokens
    WHERE expires_at < (now() - interval '7 days');
END;
$$;


--
-- Name: FUNCTION cleanup_old_verification_tokens(); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.cleanup_old_verification_tokens() IS 'Nettoie les tokens de vérification expirés depuis plus de 7 jours. À exécuter via cron.';


--
-- Name: complete_course_lesson(uuid, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.complete_course_lesson(p_user_id uuid, p_lesson_id integer) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO user_course_progress (user_id, lesson_id, is_completed, completed_at)
  VALUES (p_user_id, p_lesson_id, true, NOW())
  ON CONFLICT (user_id, lesson_id)
  DO UPDATE SET
    is_completed = true,
    completed_at = NOW(),
    updated_at = NOW();
END;
$$;


--
-- Name: get_month_bounds(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_month_bounds() RETURNS TABLE(month_start date, month_end date)
    LANGUAGE plpgsql IMMUTABLE
    AS $$
BEGIN
  month_start := DATE_TRUNC('month', CURRENT_DATE)::DATE;
  month_end := (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month - 1 day')::DATE;

  RETURN QUERY SELECT month_start, month_end;
END;
$$;


--
-- Name: get_week_bounds(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_week_bounds() RETURNS TABLE(week_start date, week_end date)
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
  current_day_of_week INTEGER;
BEGIN
  -- PostgreSQL: 0 = Dimanche, 1 = Lundi, ..., 6 = Samedi
  -- On veut que la semaine commence le lundi
  current_day_of_week := EXTRACT(DOW FROM CURRENT_DATE);

  -- Calculer le lundi de la semaine actuelle
  week_start := CASE
    WHEN current_day_of_week = 0 THEN CURRENT_DATE - INTERVAL '6 days'  -- Dimanche
    ELSE CURRENT_DATE - INTERVAL '1 day' * (current_day_of_week - 1)    -- Autres jours
  END;

  -- Calculer le dimanche de la semaine actuelle
  week_end := week_start + INTERVAL '6 days';

  RETURN QUERY SELECT week_start::DATE, week_end::DATE;
END;
$$;


--
-- Name: get_xp_for_level(integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_xp_for_level(level integer) RETURNS integer
    LANGUAGE plpgsql IMMUTABLE
    AS $$
BEGIN
  RETURN FLOOR(100 * POWER(level, 1.5));
END;
$$;


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    learning_lang TEXT;
    spoken_lang TEXT;
    lang_level TEXT;
    user_name TEXT;
    user_avatar TEXT;
BEGIN
    -- Récupérer les métadonnées avec des valeurs par défaut
    learning_lang := COALESCE(NEW.raw_user_meta_data->>'learning_language', 'fr');
    spoken_lang := COALESCE(NEW.raw_user_meta_data->>'spoken_language', 'fr');
    lang_level := COALESCE(NEW.raw_user_meta_data->>'language_level', 'beginner');
    user_name := COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1));
    user_avatar := COALESCE(NEW.raw_user_meta_data->>'avatar_id', 'avatar1');

    -- Log pour debug
    RAISE NOTICE 'Creating profile for user %', NEW.email;
    RAISE NOTICE 'Learning language: %', learning_lang;
    RAISE NOTICE 'Spoken language: %', spoken_lang;

    -- Insérer le profil avec TOUS les champs requis
    INSERT INTO public.users_profile (
        id,
        email,
        name,
        learning_language,
        spoken_language,
        language_level,
        avatar_id,
        role,
        is_premium
    ) VALUES (
        NEW.id,
        NEW.email,
        user_name,
        learning_lang,
        spoken_lang,
        lang_level,
        user_avatar,
        'user',
        false
    );

    RAISE NOTICE 'Profile created successfully!';
    RETURN NEW;

EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RAISE WARNING 'Error detail: %', SQLSTATE;
    -- Ne pas bloquer la création de l'utilisateur
    RETURN NEW;
END;
$$;


--
-- Name: set_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
  new.updated_at = now();
  return new;
end; $$;


--
-- Name: sync_user_profile_timestamps(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.sync_user_profile_timestamps() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    -- Si created_at n'est pas défini, le récupérer depuis auth.users
    IF NEW.created_at IS NULL THEN
        SELECT created_at INTO NEW.created_at
        FROM auth.users
        WHERE id = NEW.id;
    END IF;

    -- Si updated_at n'est pas défini, utiliser NOW()
    IF NEW.updated_at IS NULL THEN
        NEW.updated_at = NOW();
    END IF;

    RETURN NEW;
END;
$$;


--
-- Name: update_blog_posts_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_blog_posts_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


--
-- Name: update_monthly_xp(uuid, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_monthly_xp(p_user_id uuid, p_xp_amount integer) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_month_start DATE;
  v_month_end DATE;
BEGIN
  -- Récupérer les limites du mois actuel
  SELECT * INTO v_month_start, v_month_end FROM get_month_bounds();

  -- Insérer ou mettre à jour le tracking mensuel
  INSERT INTO public.monthly_xp_tracking (user_id, month_start, month_end, monthly_xp)
  VALUES (p_user_id, v_month_start, v_month_end, p_xp_amount)
  ON CONFLICT (user_id, month_start)
  DO UPDATE SET
    monthly_xp = public.monthly_xp_tracking.monthly_xp + p_xp_amount,
    updated_at = NOW();
END;
$$;


--
-- Name: FUNCTION update_monthly_xp(p_user_id uuid, p_xp_amount integer); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.update_monthly_xp(p_user_id uuid, p_xp_amount integer) IS 'Met à jour le tracking mensuel (SECURITY DEFINER pour bypasser RLS)';


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


--
-- Name: update_user_goals_progress(uuid, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_user_goals_progress(p_user_id uuid, p_xp_amount integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  goal_record RECORD;
BEGIN
  -- Mettre à jour tous les objectifs actifs de l'utilisateur
  FOR goal_record IN
    SELECT id, current_xp, target_xp
    FROM public.user_goals
    WHERE user_id = p_user_id
      AND is_completed = FALSE
      AND period_end >= CURRENT_DATE
  LOOP
    -- Ajouter l'XP à l'objectif
    UPDATE public.user_goals
    SET
      current_xp = LEAST(goal_record.current_xp + p_xp_amount, goal_record.target_xp),
      is_completed = (goal_record.current_xp + p_xp_amount >= goal_record.target_xp),
      updated_at = NOW()
    WHERE id = goal_record.id;
  END LOOP;
END;
$$;


--
-- Name: update_users_profile_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_users_profile_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


--
-- Name: update_weekly_xp(uuid, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_weekly_xp(p_user_id uuid, p_xp_amount integer) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_week_start DATE;
  v_week_end DATE;
BEGIN
  -- Récupérer les limites de la semaine actuelle
  SELECT * INTO v_week_start, v_week_end FROM get_week_bounds();

  -- Insérer ou mettre à jour le tracking hebdomadaire
  INSERT INTO public.weekly_xp_tracking (user_id, week_start, week_end, weekly_xp)
  VALUES (p_user_id, v_week_start, v_week_end, p_xp_amount)
  ON CONFLICT (user_id, week_start)
  DO UPDATE SET
    weekly_xp = public.weekly_xp_tracking.weekly_xp + p_xp_amount,
    updated_at = NOW();
END;
$$;


--
-- Name: FUNCTION update_weekly_xp(p_user_id uuid, p_xp_amount integer); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.update_weekly_xp(p_user_id uuid, p_xp_amount integer) IS 'Met à jour le tracking hebdomadaire (SECURITY DEFINER pour bypasser RLS)';


--
-- Name: user_has_level_access(uuid, integer, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.user_has_level_access(p_user_id uuid, p_level_id integer, p_lang text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  -- Vérifier si le niveau est gratuit
  IF EXISTS (
    SELECT 1 FROM course_levels
    WHERE id = p_level_id AND is_free = true
  ) THEN
    RETURN true;
  END IF;

  -- Vérifier si l'utilisateur a acheté le niveau
  IF EXISTS (
    SELECT 1 FROM user_course_access
    WHERE user_id = p_user_id
      AND level_id = p_level_id
      AND lang = p_lang
      AND (expires_at IS NULL OR expires_at > NOW())
  ) THEN
    RETURN true;
  END IF;

  RETURN false;
END;
$$;


--
-- Name: verify_user_email(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.verify_user_email(verification_token text) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    token_record record;
    result jsonb;
BEGIN
    -- Chercher le token
    SELECT * INTO token_record
    FROM public.email_verification_tokens
    WHERE token = verification_token
    AND verified_at IS NULL
    AND expires_at > now();

    -- Token non trouvé ou expiré
    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Token invalide ou expiré'
        );
    END IF;

    -- Marquer le token comme vérifié
    UPDATE public.email_verification_tokens
    SET verified_at = now()
    WHERE token = verification_token;

    -- Marquer l'email comme vérifié dans le profil
    UPDATE public.users_profile
    SET email_verified = true
    WHERE id = token_record.user_id;

    -- Retourner le succès
    RETURN jsonb_build_object(
        'success', true,
        'user_id', token_record.user_id,
        'email', token_record.email
    );
END;
$$;


--
-- Name: FUNCTION verify_user_email(verification_token text); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.verify_user_email(verification_token text) IS 'Vérifie l''email d''un utilisateur à partir d''un token. Retourne un JSON avec success=true/false.';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: blog_posts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blog_posts (
    id bigint NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    excerpt text NOT NULL,
    content text NOT NULL,
    lang text NOT NULL,
    author_id uuid,
    img text,
    is_published boolean DEFAULT false,
    published_at timestamp with time zone,
    meta_description text,
    meta_keywords text[],
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT blog_posts_lang_check CHECK ((lang = ANY (ARRAY['fr'::text, 'en'::text, 'ru'::text])))
);


--
-- Name: TABLE blog_posts; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.blog_posts IS 'Blog posts with Markdown content, replacing static MDX files';


--
-- Name: COLUMN blog_posts.slug; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.blog_posts.slug IS 'URL-friendly identifier (unique per language)';


--
-- Name: COLUMN blog_posts.content; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.blog_posts.content IS 'Markdown content of the blog post';


--
-- Name: COLUMN blog_posts.published_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.blog_posts.published_at IS 'Publication date/time (for display and ordering)';


--
-- Name: blog_posts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.blog_posts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: blog_posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.blog_posts_id_seq OWNED BY public.blog_posts.id;


--
-- Name: books; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.books (
    id bigint NOT NULL,
    name text,
    title text,
    author text,
    image text,
    description text,
    publication_year integer,
    created_at timestamp with time zone DEFAULT now(),
    lang text,
    level text,
    CONSTRAINT books_level_check CHECK ((level = ANY (ARRAY['beginner'::text, 'intermediate'::text, 'advanced'::text])))
);


--
-- Name: COLUMN books.level; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.books.level IS 'Niveau de difficulté du livre (beginner, intermediate, advanced)';


--
-- Name: books_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.books ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.books_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: course_lessons; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.course_lessons (
    id integer NOT NULL,
    course_id integer NOT NULL,
    slug text NOT NULL,
    title_fr text NOT NULL,
    title_ru text NOT NULL,
    title_en text NOT NULL,
    order_index integer NOT NULL,
    objectives text[],
    estimated_minutes integer,
    blocks jsonb DEFAULT '[]'::jsonb NOT NULL,
    is_published boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    objectives_fr text[],
    objectives_ru text[],
    objectives_en text[],
    blocks_fr jsonb,
    blocks_ru jsonb,
    blocks_en jsonb,
    is_free boolean DEFAULT false
);


--
-- Name: TABLE course_lessons; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.course_lessons IS 'Leçons individuelles avec contenu structuré (blocks)';


--
-- Name: COLUMN course_lessons.blocks; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.course_lessons.blocks IS 'Structure JSON des blocks: dialogue, grammar, culture, exercise, etc.';


--
-- Name: COLUMN course_lessons.objectives_fr; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.course_lessons.objectives_fr IS 'Learning objectives in French';


--
-- Name: COLUMN course_lessons.objectives_ru; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.course_lessons.objectives_ru IS 'Learning objectives in Russian';


--
-- Name: COLUMN course_lessons.objectives_en; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.course_lessons.objectives_en IS 'Learning objectives in English';


--
-- Name: COLUMN course_lessons.blocks_fr; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.course_lessons.blocks_fr IS 'Lesson content blocks in French (JSONB)';


--
-- Name: COLUMN course_lessons.blocks_ru; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.course_lessons.blocks_ru IS 'Lesson content blocks in Russian (JSONB)';


--
-- Name: COLUMN course_lessons.blocks_en; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.course_lessons.blocks_en IS 'Lesson content blocks in English (JSONB)';


--
-- Name: course_lessons_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.course_lessons_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: course_lessons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.course_lessons_id_seq OWNED BY public.course_lessons.id;


--
-- Name: course_levels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.course_levels (
    id integer NOT NULL,
    slug text NOT NULL,
    name_fr text NOT NULL,
    name_ru text NOT NULL,
    name_en text NOT NULL,
    description_fr text,
    description_ru text,
    description_en text,
    price_eur numeric(10,2) DEFAULT 0.00,
    order_index integer NOT NULL,
    is_free boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    premium_discount_percent integer DEFAULT 20,
    price_premium_eur numeric(10,2)
);


--
-- Name: TABLE course_levels; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.course_levels IS 'Niveaux de la méthode (débutant, intermédiaire, avancé) avec prix';


--
-- Name: COLUMN course_levels.is_free; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.course_levels.is_free IS 'Si true, accessible sans achat (ex: niveau débutant)';


--
-- Name: COLUMN course_levels.premium_discount_percent; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.course_levels.premium_discount_percent IS 'Pourcentage de réduction pour les utilisateurs premium (0-100)';


--
-- Name: COLUMN course_levels.price_premium_eur; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.course_levels.price_premium_eur IS 'Prix pour les utilisateurs premium (si NULL, utiliser price_eur - discount)';


--
-- Name: course_levels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.course_levels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: course_levels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.course_levels_id_seq OWNED BY public.course_levels.id;


--
-- Name: courses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.courses (
    id integer NOT NULL,
    level_id integer NOT NULL,
    slug text NOT NULL,
    title_fr text NOT NULL,
    title_ru text NOT NULL,
    title_en text NOT NULL,
    description_fr text,
    description_ru text,
    description_en text,
    lang text NOT NULL,
    order_index integer NOT NULL,
    estimated_hours integer,
    cover_image text,
    is_published boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    target_language character varying(2) DEFAULT 'ru'::character varying NOT NULL
);


--
-- Name: TABLE courses; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.courses IS 'Cours/Modules thématiques dans chaque niveau';


--
-- Name: COLUMN courses.target_language; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.courses.target_language IS 'Langue enseignée par ce cours (ru = russe, fr = français)';


--
-- Name: courses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.courses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: courses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.courses_id_seq OWNED BY public.courses.id;


--
-- Name: email_verification_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_verification_tokens (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    token text NOT NULL,
    email text NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '48:00:00'::interval) NOT NULL,
    verified_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: TABLE email_verification_tokens; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.email_verification_tokens IS 'Stocke les tokens de vérification d''email. Les utilisateurs peuvent se connecter sans vérification,
mais certaines fonctionnalités sont limitées jusqu''à vérification.';


--
-- Name: exercises; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.exercises (
    id bigint NOT NULL,
    material_id bigint,
    type character varying(50) DEFAULT 'fill_in_blank'::character varying NOT NULL,
    title character varying(255) NOT NULL,
    level character varying(20) DEFAULT 'beginner'::character varying NOT NULL,
    lang character varying(10) NOT NULL,
    data jsonb NOT NULL,
    xp_reward integer DEFAULT 10 NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE exercises; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.exercises IS 'Audio cloze exercises merged into fill_in_blank type. Audio now comes from material.';


--
-- Name: COLUMN exercises.data; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.exercises.data IS 'JSON structure for fill_in_blank: {"questions": [{"id": 1, "text": "Je ____ à l''école.", "blanks": [{"position": 1, "correctAnswers": ["vais"], "hint": "Présent, 1ère personne"}], "explanation": "On utilise vais au présent"}]}';


--
-- Name: exercises_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.exercises_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: exercises_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.exercises_id_seq OWNED BY public.exercises.id;


--
-- Name: guest_translation_tracking; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.guest_translation_tracking (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    ip_address text NOT NULL,
    translation_count integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: user_xp_profile; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_xp_profile (
    user_id uuid NOT NULL,
    total_xp integer DEFAULT 0,
    current_level integer DEFAULT 1,
    xp_in_current_level integer DEFAULT 0,
    daily_streak integer DEFAULT 0,
    longest_streak integer DEFAULT 0,
    last_activity_date date,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    total_gold integer DEFAULT 0
);


--
-- Name: TABLE user_xp_profile; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.user_xp_profile IS 'Profil XP et niveau de chaque utilisateur';


--
-- Name: COLUMN user_xp_profile.total_gold; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_xp_profile.total_gold IS 'Total gold coins earned by the user (currency for future features)';


--
-- Name: users_profile; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users_profile (
    id uuid NOT NULL,
    email text NOT NULL,
    name text NOT NULL,
    role text,
    is_premium boolean DEFAULT false NOT NULL,
    learning_language text NOT NULL,
    spoken_language text NOT NULL,
    language_level text NOT NULL,
    avatar_id text DEFAULT 'avatar1'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    email_verified boolean DEFAULT false,
    theme_preference text DEFAULT 'light'::text,
    daily_xp_goal integer DEFAULT 100,
    email_reminders boolean DEFAULT true,
    streak_reminders boolean DEFAULT true,
    new_content_notifications boolean DEFAULT true,
    show_in_leaderboard boolean DEFAULT true,
    CONSTRAINT check_avatar_id CHECK ((avatar_id = ANY (ARRAY['avatar1'::text, 'avatar2'::text, 'avatar3'::text, 'avatar4'::text, 'avatar5'::text, 'avatar6'::text, 'avatar7'::text, 'avatar8'::text, 'avatar9'::text, 'avatar10'::text, 'avatar11'::text, 'avatar12'::text, 'avatar13'::text, 'avatar14'::text]))),
    CONSTRAINT check_language_level CHECK ((language_level = ANY (ARRAY['beginner'::text, 'intermediate'::text, 'advanced'::text]))),
    CONSTRAINT check_learning_language CHECK ((learning_language = ANY (ARRAY['en'::text, 'fr'::text, 'ru'::text]))),
    CONSTRAINT check_spoken_language CHECK ((spoken_language = ANY (ARRAY['en'::text, 'fr'::text, 'ru'::text]))),
    CONSTRAINT users_profile_theme_preference_check CHECK ((theme_preference = ANY (ARRAY['light'::text, 'dark'::text])))
);


--
-- Name: TABLE users_profile; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.users_profile IS 'User profile data - Cleaned up unused columns on 2025-11-11';


--
-- Name: COLUMN users_profile.spoken_language; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users_profile.spoken_language IS 'Langue maternelle/parlée par l''utilisateur (english, french, russian)';


--
-- Name: COLUMN users_profile.language_level; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users_profile.language_level IS 'Niveau de langue de l''utilisateur (beginner, intermediate, advanced)';


--
-- Name: COLUMN users_profile.avatar_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users_profile.avatar_id IS 'ID de l''avatar choisi parmi les avatars prédéfinis (exemple: avatar1, avatar2, etc.)';


--
-- Name: COLUMN users_profile.theme_preference; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users_profile.theme_preference IS 'Préférence de thème de l''utilisateur: light ou dark';


--
-- Name: COLUMN users_profile.daily_xp_goal; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users_profile.daily_xp_goal IS 'Daily XP goal set by the user (50-500)';


--
-- Name: COLUMN users_profile.email_reminders; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users_profile.email_reminders IS 'User wants daily email reminders';


--
-- Name: COLUMN users_profile.streak_reminders; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users_profile.streak_reminders IS 'User wants streak reminder notifications';


--
-- Name: COLUMN users_profile.new_content_notifications; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users_profile.new_content_notifications IS 'User wants new content notifications';


--
-- Name: COLUMN users_profile.show_in_leaderboard; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users_profile.show_in_leaderboard IS 'User profile is visible in public leaderboard';


--
-- Name: leaderboard_view; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.leaderboard_view AS
 SELECT up.id,
    up.name,
    up.avatar_id,
    up.learning_language,
    xp.total_xp,
    xp.current_level,
    xp.daily_streak,
    xp.total_gold
   FROM (public.users_profile up
     JOIN public.user_xp_profile xp ON ((xp.user_id = up.id)))
  WHERE ((up.show_in_leaderboard = true) AND (xp.total_xp > 0));


--
-- Name: VIEW leaderboard_view; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON VIEW public.leaderboard_view IS 'Public leaderboard data filtered by show_in_leaderboard setting';


--
-- Name: lessons; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lessons (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    title_fr text,
    title_ru text,
    level text,
    slug text,
    blocks jsonb,
    "order" integer,
    lang text,
    id bigint NOT NULL
);


--
-- Name: lessons_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.lessons ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.lessons_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: materials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.materials (
    id bigint NOT NULL,
    lang character varying(5),
    section character varying(50),
    title text,
    content text,
    content_accented text,
    image_filename text,
    audio_filename text,
    video_url text,
    level character varying(20),
    chapter_number integer,
    book_id bigint,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT materials_level_check CHECK (((level)::text = ANY (ARRAY['beginner'::text, 'intermediate'::text, 'advanced'::text])))
);


--
-- Name: COLUMN materials.lang; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.materials.lang IS 'Content language: fr, ru, or en';


--
-- Name: COLUMN materials.section; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.materials.section IS 'Material category/section';


--
-- Name: COLUMN materials.content; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.materials.content IS 'Main text content (without stress marks for Russian)';


--
-- Name: COLUMN materials.content_accented; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.materials.content_accented IS 'Russian text with stress marks (ударение)';


--
-- Name: COLUMN materials.image_filename; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.materials.image_filename IS 'Image filename only (not full URL) - stored in R2';


--
-- Name: COLUMN materials.audio_filename; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.materials.audio_filename IS 'Audio filename only (not full URL) - stored in R2';


--
-- Name: COLUMN materials.video_url; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.materials.video_url IS 'Full video URL (usually YouTube)';


--
-- Name: COLUMN materials.level; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.materials.level IS 'Difficulty level: beginner, intermediate, or advanced';


--
-- Name: COLUMN materials.chapter_number; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.materials.chapter_number IS 'Chapter number for book-chapters section';


--
-- Name: COLUMN materials.created_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.materials.created_at IS 'Timestamp when the material was created';


--
-- Name: COLUMN materials.updated_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.materials.updated_at IS 'Timestamp when the material was last updated (auto-updated by trigger)';


--
-- Name: materials_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.materials ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.materials_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: monthly_xp_tracking; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.monthly_xp_tracking (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    month_start date NOT NULL,
    month_end date NOT NULL,
    monthly_xp integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE monthly_xp_tracking; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.monthly_xp_tracking IS 'Suivi de l''XP gagné par mois pour le leaderboard mensuel';


--
-- Name: COLUMN monthly_xp_tracking.month_start; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.monthly_xp_tracking.month_start IS 'Premier jour du mois';


--
-- Name: COLUMN monthly_xp_tracking.month_end; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.monthly_xp_tracking.month_end IS 'Dernier jour du mois';


--
-- Name: COLUMN monthly_xp_tracking.monthly_xp; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.monthly_xp_tracking.monthly_xp IS 'XP total gagné durant ce mois';


--
-- Name: monthly_leaderboard_view; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.monthly_leaderboard_view AS
 SELECT mxt.user_id,
    mxt.monthly_xp,
    mxt.month_start,
    mxt.month_end,
    up.name,
    up.avatar_id
   FROM (public.monthly_xp_tracking mxt
     JOIN public.users_profile up ON ((up.id = mxt.user_id)))
  WHERE ((up.show_in_leaderboard = true) AND (mxt.monthly_xp > 0));


--
-- Name: VIEW monthly_leaderboard_view; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON VIEW public.monthly_leaderboard_view IS 'Monthly XP rankings filtered by show_in_leaderboard setting';


--
-- Name: public_users_profile; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.public_users_profile AS
 SELECT up.id,
    up.name,
    up.avatar_id,
    up.learning_language
   FROM public.users_profile up
  WHERE (up.show_in_leaderboard = true);


--
-- Name: VIEW public_users_profile; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON VIEW public.public_users_profile IS 'Public user profiles for users who opted in to leaderboard visibility';


--
-- Name: user_achievements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_achievements (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    achievement_type character varying(50) NOT NULL,
    unlocked_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE user_achievements; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.user_achievements IS 'Badges et réalisations débloqués par les utilisateurs';


--
-- Name: user_course_access; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_course_access (
    id integer NOT NULL,
    user_id uuid NOT NULL,
    level_id integer NOT NULL,
    lang text NOT NULL,
    purchase_date timestamp with time zone DEFAULT now(),
    expires_at timestamp with time zone,
    payment_id text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE user_course_access; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.user_course_access IS 'Achats et accès des utilisateurs par niveau';


--
-- Name: user_course_access_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_course_access_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_course_access_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_course_access_id_seq OWNED BY public.user_course_access.id;


--
-- Name: user_course_progress; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_course_progress (
    id integer NOT NULL,
    user_id uuid NOT NULL,
    lesson_id integer NOT NULL,
    is_completed boolean DEFAULT false,
    completed_at timestamp with time zone,
    last_visited_at timestamp with time zone DEFAULT now(),
    time_spent_seconds integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE user_course_progress; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.user_course_progress IS 'Progression des utilisateurs dans les leçons';


--
-- Name: user_course_progress_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_course_progress_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_course_progress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_course_progress_id_seq OWNED BY public.user_course_progress.id;


--
-- Name: user_exercise_progress; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_exercise_progress (
    id bigint NOT NULL,
    user_id uuid,
    exercise_id bigint,
    completed boolean DEFAULT false,
    score integer,
    attempts integer DEFAULT 0,
    last_attempt_at timestamp with time zone,
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: user_exercise_progress_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_exercise_progress_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_exercise_progress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_exercise_progress_id_seq OWNED BY public.user_exercise_progress.id;


--
-- Name: user_goals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_goals (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    goal_type character varying(20) NOT NULL,
    target_xp integer NOT NULL,
    current_xp integer DEFAULT 0,
    period_start date NOT NULL,
    period_end date NOT NULL,
    is_completed boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    reward_given boolean DEFAULT false,
    CONSTRAINT user_goals_goal_type_check CHECK (((goal_type)::text = ANY ((ARRAY['daily'::character varying, 'weekly'::character varying, 'monthly'::character varying])::text[])))
);


--
-- Name: TABLE user_goals; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.user_goals IS 'Objectifs quotidiens/hebdomadaires/mensuels des utilisateurs';


--
-- Name: COLUMN user_goals.reward_given; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_goals.reward_given IS 'Indique si le bonus XP/Gold a été attribué pour cet objectif (évite les doublons)';


--
-- Name: user_lessons; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_lessons (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid DEFAULT gen_random_uuid() NOT NULL,
    lesson_id bigint NOT NULL,
    is_studied boolean DEFAULT false NOT NULL
);


--
-- Name: user_lessons_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.user_lessons ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.user_lessons_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: user_materials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_materials (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    user_id uuid,
    material_id bigint,
    is_being_studied boolean DEFAULT true,
    is_studied boolean DEFAULT false
);


--
-- Name: user_materials_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.user_materials ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.user_materials_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: user_words; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_words (
    id bigint NOT NULL,
    user_id uuid NOT NULL,
    word_ru text,
    word_fr text,
    created_at timestamp with time zone DEFAULT now(),
    material_id bigint,
    word_sentence text,
    card_state text DEFAULT 'new'::text NOT NULL,
    ease_factor real DEFAULT 2.5 NOT NULL,
    "interval" integer DEFAULT 0 NOT NULL,
    repetition integer DEFAULT 0 NOT NULL,
    lapses integer DEFAULT 0 NOT NULL,
    last_review_date timestamp with time zone,
    reviews_count bigint,
    learning_step integer,
    next_review_date timestamp with time zone,
    updated_at timestamp with time zone,
    is_suspended boolean,
    word_en text,
    word_lang character varying(2) NOT NULL,
    CONSTRAINT at_least_one_word CHECK (((word_ru IS NOT NULL) OR (word_fr IS NOT NULL) OR (word_en IS NOT NULL)))
);


--
-- Name: COLUMN user_words.word_lang; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_words.word_lang IS 'Language being learned when this word was added (ru, fr, en, etc.)';


--
-- Name: user_words_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.user_words ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.user_words_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: weekly_xp_tracking; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.weekly_xp_tracking (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    week_start date NOT NULL,
    week_end date NOT NULL,
    weekly_xp integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE weekly_xp_tracking; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.weekly_xp_tracking IS 'Suivi de l''XP gagné par semaine pour le leaderboard hebdomadaire';


--
-- Name: COLUMN weekly_xp_tracking.week_start; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.weekly_xp_tracking.week_start IS 'Lundi de la semaine (début de semaine)';


--
-- Name: COLUMN weekly_xp_tracking.week_end; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.weekly_xp_tracking.week_end IS 'Dimanche de la semaine (fin de semaine)';


--
-- Name: COLUMN weekly_xp_tracking.weekly_xp; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.weekly_xp_tracking.weekly_xp IS 'XP total gagné durant cette semaine';


--
-- Name: weekly_leaderboard_view; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.weekly_leaderboard_view AS
 SELECT wxt.user_id,
    wxt.weekly_xp,
    wxt.week_start,
    wxt.week_end,
    up.name,
    up.avatar_id
   FROM (public.weekly_xp_tracking wxt
     JOIN public.users_profile up ON ((up.id = wxt.user_id)))
  WHERE ((up.show_in_leaderboard = true) AND (wxt.weekly_xp > 0));


--
-- Name: VIEW weekly_leaderboard_view; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON VIEW public.weekly_leaderboard_view IS 'Weekly XP rankings filtered by show_in_leaderboard setting';


--
-- Name: xp_rewards_config; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.xp_rewards_config (
    id integer NOT NULL,
    action_type character varying(50) NOT NULL,
    xp_amount integer NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    gold_amount integer DEFAULT 0
);


--
-- Name: TABLE xp_rewards_config; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.xp_rewards_config IS 'Configuration des récompenses XP pour différentes actions';


--
-- Name: COLUMN xp_rewards_config.gold_amount; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.xp_rewards_config.gold_amount IS 'Amount of gold coins awarded for this action';


--
-- Name: xp_rewards_config_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.xp_rewards_config_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: xp_rewards_config_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.xp_rewards_config_id_seq OWNED BY public.xp_rewards_config.id;


--
-- Name: xp_transactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.xp_transactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    xp_amount integer NOT NULL,
    source_type character varying(50) NOT NULL,
    source_id text,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    gold_earned integer DEFAULT 0
);


--
-- Name: TABLE xp_transactions; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.xp_transactions IS 'Historique de tous les gains XP';


--
-- Name: COLUMN xp_transactions.gold_earned; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.xp_transactions.gold_earned IS 'Gold coins earned in this transaction';


--
-- Name: blog_posts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_posts ALTER COLUMN id SET DEFAULT nextval('public.blog_posts_id_seq'::regclass);


--
-- Name: course_lessons id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_lessons ALTER COLUMN id SET DEFAULT nextval('public.course_lessons_id_seq'::regclass);


--
-- Name: course_levels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_levels ALTER COLUMN id SET DEFAULT nextval('public.course_levels_id_seq'::regclass);


--
-- Name: courses id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courses ALTER COLUMN id SET DEFAULT nextval('public.courses_id_seq'::regclass);


--
-- Name: exercises id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exercises ALTER COLUMN id SET DEFAULT nextval('public.exercises_id_seq'::regclass);


--
-- Name: user_course_access id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_course_access ALTER COLUMN id SET DEFAULT nextval('public.user_course_access_id_seq'::regclass);


--
-- Name: user_course_progress id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_course_progress ALTER COLUMN id SET DEFAULT nextval('public.user_course_progress_id_seq'::regclass);


--
-- Name: user_exercise_progress id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_exercise_progress ALTER COLUMN id SET DEFAULT nextval('public.user_exercise_progress_id_seq'::regclass);


--
-- Name: xp_rewards_config id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.xp_rewards_config ALTER COLUMN id SET DEFAULT nextval('public.xp_rewards_config_id_seq'::regclass);


--
-- Name: blog_posts blog_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_pkey PRIMARY KEY (id);


--
-- Name: blog_posts blog_posts_slug_lang_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_slug_lang_key UNIQUE (slug, lang);


--
-- Name: books books_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_pkey PRIMARY KEY (id);


--
-- Name: course_lessons course_lessons_course_id_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_lessons
    ADD CONSTRAINT course_lessons_course_id_slug_key UNIQUE (course_id, slug);


--
-- Name: course_lessons course_lessons_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_lessons
    ADD CONSTRAINT course_lessons_pkey PRIMARY KEY (id);


--
-- Name: course_levels course_levels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_levels
    ADD CONSTRAINT course_levels_pkey PRIMARY KEY (id);


--
-- Name: course_levels course_levels_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_levels
    ADD CONSTRAINT course_levels_slug_key UNIQUE (slug);


--
-- Name: courses courses_level_id_slug_lang_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_level_id_slug_lang_key UNIQUE (level_id, slug, lang);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: email_verification_tokens email_verification_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_verification_tokens
    ADD CONSTRAINT email_verification_tokens_pkey PRIMARY KEY (id);


--
-- Name: email_verification_tokens email_verification_tokens_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_verification_tokens
    ADD CONSTRAINT email_verification_tokens_token_key UNIQUE (token);


--
-- Name: exercises exercises_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exercises
    ADD CONSTRAINT exercises_pkey PRIMARY KEY (id);


--
-- Name: guest_translation_tracking guest_translation_tracking_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guest_translation_tracking
    ADD CONSTRAINT guest_translation_tracking_pkey PRIMARY KEY (id);


--
-- Name: lessons lessons_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_id_key UNIQUE (id);


--
-- Name: lessons lessons_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_pkey PRIMARY KEY (id);


--
-- Name: materials materials_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.materials
    ADD CONSTRAINT materials_id_key UNIQUE (id);


--
-- Name: materials materials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.materials
    ADD CONSTRAINT materials_pkey PRIMARY KEY (id);


--
-- Name: monthly_xp_tracking monthly_xp_tracking_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.monthly_xp_tracking
    ADD CONSTRAINT monthly_xp_tracking_pkey PRIMARY KEY (id);


--
-- Name: monthly_xp_tracking monthly_xp_tracking_user_id_month_start_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.monthly_xp_tracking
    ADD CONSTRAINT monthly_xp_tracking_user_id_month_start_key UNIQUE (user_id, month_start);


--
-- Name: user_words unique_user_translation; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_words
    ADD CONSTRAINT unique_user_translation UNIQUE (user_id, word_ru, word_fr);


--
-- Name: user_achievements user_achievements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT user_achievements_pkey PRIMARY KEY (id);


--
-- Name: user_achievements user_achievements_user_id_achievement_type_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT user_achievements_user_id_achievement_type_key UNIQUE (user_id, achievement_type);


--
-- Name: user_course_access user_course_access_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_course_access
    ADD CONSTRAINT user_course_access_pkey PRIMARY KEY (id);


--
-- Name: user_course_access user_course_access_user_id_level_id_lang_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_course_access
    ADD CONSTRAINT user_course_access_user_id_level_id_lang_key UNIQUE (user_id, level_id, lang);


--
-- Name: user_course_progress user_course_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_course_progress
    ADD CONSTRAINT user_course_progress_pkey PRIMARY KEY (id);


--
-- Name: user_course_progress user_course_progress_user_id_lesson_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_course_progress
    ADD CONSTRAINT user_course_progress_user_id_lesson_id_key UNIQUE (user_id, lesson_id);


--
-- Name: user_exercise_progress user_exercise_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_exercise_progress
    ADD CONSTRAINT user_exercise_progress_pkey PRIMARY KEY (id);


--
-- Name: user_exercise_progress user_exercise_progress_user_id_exercise_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_exercise_progress
    ADD CONSTRAINT user_exercise_progress_user_id_exercise_id_key UNIQUE (user_id, exercise_id);


--
-- Name: user_goals user_goals_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_goals
    ADD CONSTRAINT user_goals_pkey PRIMARY KEY (id);


--
-- Name: user_lessons user_lessons_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_lessons
    ADD CONSTRAINT user_lessons_pkey PRIMARY KEY (id);


--
-- Name: user_materials user_materials_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_materials
    ADD CONSTRAINT user_materials_id_key UNIQUE (id);


--
-- Name: user_materials user_materials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_materials
    ADD CONSTRAINT user_materials_pkey PRIMARY KEY (id);


--
-- Name: user_words user_words_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_words
    ADD CONSTRAINT user_words_id_key UNIQUE (id);


--
-- Name: user_words user_words_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_words
    ADD CONSTRAINT user_words_pkey PRIMARY KEY (id);


--
-- Name: user_xp_profile user_xp_profile_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_xp_profile
    ADD CONSTRAINT user_xp_profile_pkey PRIMARY KEY (user_id);


--
-- Name: users_profile users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_profile
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: weekly_xp_tracking weekly_xp_tracking_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.weekly_xp_tracking
    ADD CONSTRAINT weekly_xp_tracking_pkey PRIMARY KEY (id);


--
-- Name: weekly_xp_tracking weekly_xp_tracking_user_id_week_start_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.weekly_xp_tracking
    ADD CONSTRAINT weekly_xp_tracking_user_id_week_start_key UNIQUE (user_id, week_start);


--
-- Name: xp_rewards_config xp_rewards_config_action_type_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.xp_rewards_config
    ADD CONSTRAINT xp_rewards_config_action_type_key UNIQUE (action_type);


--
-- Name: xp_rewards_config xp_rewards_config_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.xp_rewards_config
    ADD CONSTRAINT xp_rewards_config_pkey PRIMARY KEY (id);


--
-- Name: xp_transactions xp_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.xp_transactions
    ADD CONSTRAINT xp_transactions_pkey PRIMARY KEY (id);


--
-- Name: idx_blog_posts_lang; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_blog_posts_lang ON public.blog_posts USING btree (lang);


--
-- Name: idx_blog_posts_lang_published; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_blog_posts_lang_published ON public.blog_posts USING btree (lang, is_published, published_at DESC);


--
-- Name: idx_blog_posts_published; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_blog_posts_published ON public.blog_posts USING btree (is_published, published_at DESC);


--
-- Name: idx_blog_posts_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_blog_posts_slug ON public.blog_posts USING btree (slug);


--
-- Name: idx_courses_lang; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_courses_lang ON public.courses USING btree (lang);


--
-- Name: idx_courses_lang_target; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_courses_lang_target ON public.courses USING btree (lang, target_language);


--
-- Name: idx_courses_level; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_courses_level ON public.courses USING btree (level_id);


--
-- Name: idx_courses_published; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_courses_published ON public.courses USING btree (is_published);


--
-- Name: idx_courses_target_language; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_courses_target_language ON public.courses USING btree (target_language);


--
-- Name: idx_email_verification_tokens_token; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_verification_tokens_token ON public.email_verification_tokens USING btree (token);


--
-- Name: idx_email_verification_tokens_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_verification_tokens_user_id ON public.email_verification_tokens USING btree (user_id);


--
-- Name: idx_exercises_lang; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_exercises_lang ON public.exercises USING btree (lang);


--
-- Name: idx_exercises_material_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_exercises_material_id ON public.exercises USING btree (material_id);


--
-- Name: idx_exercises_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_exercises_type ON public.exercises USING btree (type);


--
-- Name: idx_guest_translation_tracking_ip; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_guest_translation_tracking_ip ON public.guest_translation_tracking USING btree (ip_address);


--
-- Name: idx_lessons_course; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lessons_course ON public.course_lessons USING btree (course_id);


--
-- Name: idx_lessons_published; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lessons_published ON public.course_lessons USING btree (is_published);


--
-- Name: idx_materials_book_id_chapter; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_materials_book_id_chapter ON public.materials USING btree (book_id, chapter_number) WHERE (book_id IS NOT NULL);


--
-- Name: idx_materials_created_at_desc; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_materials_created_at_desc ON public.materials USING btree (created_at DESC);


--
-- Name: idx_materials_lang_section; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_materials_lang_section ON public.materials USING btree (lang, section);


--
-- Name: idx_materials_level; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_materials_level ON public.materials USING btree (level);


--
-- Name: idx_monthly_xp_tracking_month_start; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_monthly_xp_tracking_month_start ON public.monthly_xp_tracking USING btree (month_start);


--
-- Name: idx_monthly_xp_tracking_monthly_xp; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_monthly_xp_tracking_monthly_xp ON public.monthly_xp_tracking USING btree (monthly_xp);


--
-- Name: idx_monthly_xp_tracking_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_monthly_xp_tracking_user_id ON public.monthly_xp_tracking USING btree (user_id);


--
-- Name: idx_progress_completed; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_progress_completed ON public.user_course_progress USING btree (is_completed);


--
-- Name: idx_progress_lesson; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_progress_lesson ON public.user_course_progress USING btree (lesson_id);


--
-- Name: idx_progress_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_progress_user ON public.user_course_progress USING btree (user_id);


--
-- Name: idx_unique_username; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_unique_username ON public.users_profile USING btree (name);


--
-- Name: INDEX idx_unique_username; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON INDEX public.idx_unique_username IS 'Garantit l''unicité du pseudo utilisateur';


--
-- Name: idx_user_access_level; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_access_level ON public.user_course_access USING btree (level_id);


--
-- Name: idx_user_access_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_access_user ON public.user_course_access USING btree (user_id);


--
-- Name: idx_user_achievements_unlocked_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_achievements_unlocked_at ON public.user_achievements USING btree (unlocked_at);


--
-- Name: idx_user_achievements_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_achievements_user_id ON public.user_achievements USING btree (user_id);


--
-- Name: idx_user_exercise_progress_exercise_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_exercise_progress_exercise_id ON public.user_exercise_progress USING btree (exercise_id);


--
-- Name: idx_user_exercise_progress_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_exercise_progress_user_id ON public.user_exercise_progress USING btree (user_id);


--
-- Name: idx_user_goals_goal_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_goals_goal_type ON public.user_goals USING btree (goal_type);


--
-- Name: idx_user_goals_is_completed; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_goals_is_completed ON public.user_goals USING btree (is_completed);


--
-- Name: idx_user_goals_period_end; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_goals_period_end ON public.user_goals USING btree (period_end);


--
-- Name: idx_user_goals_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_goals_user_id ON public.user_goals USING btree (user_id);


--
-- Name: idx_user_words_state; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_words_state ON public.user_words USING btree (user_id, card_state);


--
-- Name: idx_user_words_user_lang; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_words_user_lang ON public.user_words USING btree (user_id, word_lang);


--
-- Name: idx_user_xp_profile_level; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_xp_profile_level ON public.user_xp_profile USING btree (current_level);


--
-- Name: idx_user_xp_profile_streak; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_xp_profile_streak ON public.user_xp_profile USING btree (daily_streak);


--
-- Name: idx_user_xp_profile_total_xp; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_xp_profile_total_xp ON public.user_xp_profile USING btree (total_xp);


--
-- Name: idx_users_profile_avatar_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_profile_avatar_id ON public.users_profile USING btree (avatar_id);


--
-- Name: idx_users_profile_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_profile_created_at ON public.users_profile USING btree (created_at DESC);


--
-- Name: idx_users_profile_language_level; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_profile_language_level ON public.users_profile USING btree (language_level);


--
-- Name: idx_users_profile_spoken_language; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_profile_spoken_language ON public.users_profile USING btree (spoken_language);


--
-- Name: idx_users_profile_theme_preference; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_profile_theme_preference ON public.users_profile USING btree (theme_preference);


--
-- Name: idx_users_profile_updated_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_profile_updated_at ON public.users_profile USING btree (updated_at DESC);


--
-- Name: idx_weekly_xp_tracking_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_weekly_xp_tracking_user_id ON public.weekly_xp_tracking USING btree (user_id);


--
-- Name: idx_weekly_xp_tracking_week_start; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_weekly_xp_tracking_week_start ON public.weekly_xp_tracking USING btree (week_start);


--
-- Name: idx_weekly_xp_tracking_weekly_xp; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_weekly_xp_tracking_weekly_xp ON public.weekly_xp_tracking USING btree (weekly_xp);


--
-- Name: idx_xp_transactions_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_xp_transactions_created_at ON public.xp_transactions USING btree (created_at);


--
-- Name: idx_xp_transactions_source_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_xp_transactions_source_type ON public.xp_transactions USING btree (source_type);


--
-- Name: idx_xp_transactions_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_xp_transactions_user_id ON public.xp_transactions USING btree (user_id);


--
-- Name: blog_posts blog_posts_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_blog_posts_updated_at();


--
-- Name: user_words set_timestamp_user_words; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_timestamp_user_words BEFORE UPDATE ON public.user_words FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: users_profile sync_user_profile_timestamps_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER sync_user_profile_timestamps_trigger BEFORE INSERT ON public.users_profile FOR EACH ROW EXECUTE FUNCTION public.sync_user_profile_timestamps();


--
-- Name: course_lessons update_course_lessons_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_course_lessons_updated_at BEFORE UPDATE ON public.course_lessons FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: course_levels update_course_levels_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_course_levels_updated_at BEFORE UPDATE ON public.course_levels FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: courses update_courses_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: exercises update_exercises_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_exercises_updated_at BEFORE UPDATE ON public.exercises FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: materials update_materials_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_materials_updated_at BEFORE UPDATE ON public.materials FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: monthly_xp_tracking update_monthly_xp_tracking_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_monthly_xp_tracking_updated_at BEFORE UPDATE ON public.monthly_xp_tracking FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: user_course_progress update_user_course_progress_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_user_course_progress_updated_at BEFORE UPDATE ON public.user_course_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: user_exercise_progress update_user_exercise_progress_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_user_exercise_progress_updated_at BEFORE UPDATE ON public.user_exercise_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: user_goals update_user_goals_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_user_goals_updated_at BEFORE UPDATE ON public.user_goals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: user_xp_profile update_user_xp_profile_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_user_xp_profile_updated_at BEFORE UPDATE ON public.user_xp_profile FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: weekly_xp_tracking update_weekly_xp_tracking_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_weekly_xp_tracking_updated_at BEFORE UPDATE ON public.weekly_xp_tracking FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: users_profile users_profile_updated_at_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER users_profile_updated_at_trigger BEFORE UPDATE ON public.users_profile FOR EACH ROW EXECUTE FUNCTION public.update_users_profile_updated_at();


--
-- Name: blog_posts blog_posts_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_author_id_fkey FOREIGN KEY (author_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: course_lessons course_lessons_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_lessons
    ADD CONSTRAINT course_lessons_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: courses courses_level_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_level_id_fkey FOREIGN KEY (level_id) REFERENCES public.course_levels(id) ON DELETE CASCADE;


--
-- Name: email_verification_tokens email_verification_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_verification_tokens
    ADD CONSTRAINT email_verification_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: exercises exercises_material_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exercises
    ADD CONSTRAINT exercises_material_id_fkey FOREIGN KEY (material_id) REFERENCES public.materials(id) ON DELETE CASCADE;


--
-- Name: materials materials_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.materials
    ADD CONSTRAINT materials_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id);


--
-- Name: monthly_xp_tracking monthly_xp_tracking_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.monthly_xp_tracking
    ADD CONSTRAINT monthly_xp_tracking_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_achievements user_achievements_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT user_achievements_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_course_access user_course_access_level_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_course_access
    ADD CONSTRAINT user_course_access_level_id_fkey FOREIGN KEY (level_id) REFERENCES public.course_levels(id) ON DELETE CASCADE;


--
-- Name: user_course_access user_course_access_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_course_access
    ADD CONSTRAINT user_course_access_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_course_progress user_course_progress_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_course_progress
    ADD CONSTRAINT user_course_progress_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.course_lessons(id) ON DELETE CASCADE;


--
-- Name: user_course_progress user_course_progress_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_course_progress
    ADD CONSTRAINT user_course_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_exercise_progress user_exercise_progress_exercise_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_exercise_progress
    ADD CONSTRAINT user_exercise_progress_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES public.exercises(id) ON DELETE CASCADE;


--
-- Name: user_exercise_progress user_exercise_progress_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_exercise_progress
    ADD CONSTRAINT user_exercise_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_goals user_goals_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_goals
    ADD CONSTRAINT user_goals_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_materials user_materials_material_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_materials
    ADD CONSTRAINT user_materials_material_id_fkey FOREIGN KEY (material_id) REFERENCES public.materials(id);


--
-- Name: user_words user_words_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_words
    ADD CONSTRAINT user_words_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users_profile(id);


--
-- Name: user_xp_profile user_xp_profile_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_xp_profile
    ADD CONSTRAINT user_xp_profile_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users_profile(id) ON DELETE CASCADE;


--
-- Name: users_profile users_profile_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_profile
    ADD CONSTRAINT users_profile_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id);


--
-- Name: weekly_xp_tracking weekly_xp_tracking_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.weekly_xp_tracking
    ADD CONSTRAINT weekly_xp_tracking_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: xp_transactions xp_transactions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.xp_transactions
    ADD CONSTRAINT xp_transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: exercises Admins can delete exercises; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can delete exercises" ON public.exercises FOR DELETE USING ((EXISTS ( SELECT 1
   FROM public.users_profile
  WHERE ((users_profile.id = auth.uid()) AND (users_profile.role = 'admin'::text)))));


--
-- Name: exercises Admins can insert exercises; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can insert exercises" ON public.exercises FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM public.users_profile
  WHERE ((users_profile.id = auth.uid()) AND (users_profile.role = 'admin'::text)))));


--
-- Name: blog_posts Admins can manage all blog posts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all blog posts" ON public.blog_posts USING ((EXISTS ( SELECT 1
   FROM public.users_profile
  WHERE ((users_profile.id = auth.uid()) AND (users_profile.role = 'admin'::text)))));


--
-- Name: exercises Admins can update exercises; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update exercises" ON public.exercises FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.users_profile
  WHERE ((users_profile.id = auth.uid()) AND (users_profile.role = 'admin'::text)))));


--
-- Name: guest_translation_tracking Admins can view guest tracking stats; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view guest tracking stats" ON public.guest_translation_tracking FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.users_profile
  WHERE ((users_profile.id = auth.uid()) AND (users_profile.role = 'admin'::text)))));


--
-- Name: xp_rewards_config Anyone can view xp rewards config; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view xp rewards config" ON public.xp_rewards_config FOR SELECT USING (true);


--
-- Name: monthly_xp_tracking Authenticated users can view all monthly tracking for leaderboa; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can view all monthly tracking for leaderboa" ON public.monthly_xp_tracking FOR SELECT USING ((auth.role() = 'authenticated'::text));


--
-- Name: weekly_xp_tracking Authenticated users can view all weekly tracking for leaderboar; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can view all weekly tracking for leaderboar" ON public.weekly_xp_tracking FOR SELECT USING ((auth.role() = 'authenticated'::text));


--
-- Name: user_xp_profile Authenticated users can view all xp profiles for leaderboard; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can view all xp profiles for leaderboard" ON public.user_xp_profile FOR SELECT USING ((auth.role() = 'authenticated'::text));


--
-- Name: blog_posts Authors can manage their own posts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authors can manage their own posts" ON public.blog_posts USING ((author_id = auth.uid()));


--
-- Name: materials Enable all for admin; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable all for admin" ON public.materials USING ((auth.uid() IN ( SELECT users_profile.id
   FROM public.users_profile
  WHERE (users_profile.role = 'admin'::text)))) WITH CHECK ((auth.uid() IN ( SELECT users_profile.id
   FROM public.users_profile
  WHERE (users_profile.role = 'admin'::text))));


--
-- Name: user_lessons Enable all for users based on user_id; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable all for users based on user_id" ON public.user_lessons USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));


--
-- Name: user_materials Enable all for users based on user_id; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable all for users based on user_id" ON public.user_materials USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));


--
-- Name: user_words Enable all for users based on user_id; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable all for users based on user_id" ON public.user_words USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));


--
-- Name: books Enable read access for all users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable read access for all users" ON public.books FOR SELECT USING (true);


--
-- Name: lessons Enable read access for all users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable read access for all users" ON public.lessons FOR SELECT USING (true);


--
-- Name: materials Enable read access for all users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable read access for all users" ON public.materials FOR SELECT USING (true);


--
-- Name: exercises Exercises are viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Exercises are viewable by everyone" ON public.exercises FOR SELECT USING (true);


--
-- Name: email_verification_tokens Functions can manage tokens; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Functions can manage tokens" ON public.email_verification_tokens USING ((((current_setting('request.jwt.claims'::text, true))::json ->> 'role'::text) = 'service_role'::text));


--
-- Name: blog_posts Public can view published blog posts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can view published blog posts" ON public.blog_posts FOR SELECT USING ((is_published = true));


--
-- Name: email_verification_tokens Service role can manage all tokens; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role can manage all tokens" ON public.email_verification_tokens TO service_role USING (true) WITH CHECK (true);


--
-- Name: users_profile Service role has full access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role has full access" ON public.users_profile TO service_role USING (true) WITH CHECK (true);


--
-- Name: POLICY "Service role has full access" ON users_profile; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON POLICY "Service role has full access" ON public.users_profile IS 'Le service role a accès complet pour les opérations backend';


--
-- Name: guest_translation_tracking Service role has full access to guest tracking; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role has full access to guest tracking" ON public.guest_translation_tracking TO service_role USING (true) WITH CHECK (true);


--
-- Name: email_verification_tokens Users can create own verification tokens; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create own verification tokens" ON public.email_verification_tokens FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));


--
-- Name: POLICY "Users can create own verification tokens" ON email_verification_tokens; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON POLICY "Users can create own verification tokens" ON public.email_verification_tokens IS 'Permet aux utilisateurs authentifiés de créer leurs propres tokens de vérification';


--
-- Name: users_profile Users can delete own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete own profile" ON public.users_profile FOR DELETE TO authenticated USING ((auth.uid() = id));


--
-- Name: POLICY "Users can delete own profile" ON users_profile; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON POLICY "Users can delete own profile" ON public.users_profile IS 'Les utilisateurs peuvent supprimer leur propre profil';


--
-- Name: email_verification_tokens Users can delete own verification tokens; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete own verification tokens" ON public.email_verification_tokens FOR DELETE TO authenticated USING ((auth.uid() = user_id));


--
-- Name: POLICY "Users can delete own verification tokens" ON email_verification_tokens; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON POLICY "Users can delete own verification tokens" ON public.email_verification_tokens IS 'Permet aux utilisateurs de supprimer leurs anciens tokens (utile pour resendVerificationEmail)';


--
-- Name: user_goals Users can delete their own goals; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own goals" ON public.user_goals FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: user_achievements Users can insert their own achievements; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own achievements" ON public.user_achievements FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: user_exercise_progress Users can insert their own exercise progress; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own exercise progress" ON public.user_exercise_progress FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: user_goals Users can insert their own goals; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own goals" ON public.user_goals FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: monthly_xp_tracking Users can insert their own monthly tracking; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own monthly tracking" ON public.monthly_xp_tracking FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: users_profile Users can insert their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own profile" ON public.users_profile FOR INSERT TO authenticated WITH CHECK ((auth.uid() = id));


--
-- Name: POLICY "Users can insert their own profile" ON users_profile; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON POLICY "Users can insert their own profile" ON public.users_profile IS 'Les utilisateurs peuvent créer leur propre profil lors de l''inscription';


--
-- Name: weekly_xp_tracking Users can insert their own weekly tracking; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own weekly tracking" ON public.weekly_xp_tracking FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: user_xp_profile Users can insert their own xp profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own xp profile" ON public.user_xp_profile FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: xp_transactions Users can insert their own xp transactions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own xp transactions" ON public.xp_transactions FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: users_profile Users can update own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own profile" ON public.users_profile FOR UPDATE TO authenticated USING ((auth.uid() = id)) WITH CHECK ((auth.uid() = id));


--
-- Name: POLICY "Users can update own profile" ON users_profile; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON POLICY "Users can update own profile" ON public.users_profile IS 'Les utilisateurs peuvent modifier uniquement leur propre profil';


--
-- Name: user_exercise_progress Users can update their own exercise progress; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own exercise progress" ON public.user_exercise_progress FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: user_goals Users can update their own goals; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own goals" ON public.user_goals FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: monthly_xp_tracking Users can update their own monthly tracking; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own monthly tracking" ON public.monthly_xp_tracking FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: weekly_xp_tracking Users can update their own weekly tracking; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own weekly tracking" ON public.weekly_xp_tracking FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: user_xp_profile Users can update their own xp profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own xp profile" ON public.user_xp_profile FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: users_profile Users can view own complete profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own complete profile" ON public.users_profile FOR SELECT TO authenticated USING ((auth.uid() = id));


--
-- Name: email_verification_tokens Users can view own verification tokens; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own verification tokens" ON public.email_verification_tokens FOR SELECT TO authenticated USING ((auth.uid() = user_id));


--
-- Name: user_achievements Users can view their own achievements; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own achievements" ON public.user_achievements FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: user_exercise_progress Users can view their own exercise progress; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own exercise progress" ON public.user_exercise_progress FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: user_goals Users can view their own goals; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own goals" ON public.user_goals FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: user_xp_profile Users can view their own xp profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own xp profile" ON public.user_xp_profile FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: xp_transactions Users can view their own xp transactions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own xp transactions" ON public.xp_transactions FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: user_course_access access_own_records; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY access_own_records ON public.user_course_access USING ((auth.uid() = user_id));


--
-- Name: blog_posts; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

--
-- Name: books; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

--
-- Name: course_lessons; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;

--
-- Name: course_levels; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.course_levels ENABLE ROW LEVEL SECURITY;

--
-- Name: course_levels course_levels_public_read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY course_levels_public_read ON public.course_levels FOR SELECT USING (true);


--
-- Name: courses; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

--
-- Name: courses courses_public_read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY courses_public_read ON public.courses FOR SELECT USING ((is_published = true));


--
-- Name: email_verification_tokens; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.email_verification_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: exercises; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

--
-- Name: guest_translation_tracking; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.guest_translation_tracking ENABLE ROW LEVEL SECURITY;

--
-- Name: lessons; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

--
-- Name: course_lessons lessons_public_read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY lessons_public_read ON public.course_lessons FOR SELECT USING ((is_published = true));


--
-- Name: materials; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;

--
-- Name: monthly_xp_tracking; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.monthly_xp_tracking ENABLE ROW LEVEL SECURITY;

--
-- Name: user_course_progress progress_own_records; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY progress_own_records ON public.user_course_progress USING ((auth.uid() = user_id));


--
-- Name: user_achievements; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

--
-- Name: user_course_access; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_course_access ENABLE ROW LEVEL SECURITY;

--
-- Name: user_course_progress; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_course_progress ENABLE ROW LEVEL SECURITY;

--
-- Name: user_exercise_progress; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_exercise_progress ENABLE ROW LEVEL SECURITY;

--
-- Name: user_goals; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;

--
-- Name: user_lessons; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_lessons ENABLE ROW LEVEL SECURITY;

--
-- Name: user_materials; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_materials ENABLE ROW LEVEL SECURITY;

--
-- Name: user_words; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_words ENABLE ROW LEVEL SECURITY;

--
-- Name: user_xp_profile; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_xp_profile ENABLE ROW LEVEL SECURITY;

--
-- Name: users_profile; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.users_profile ENABLE ROW LEVEL SECURITY;

--
-- Name: weekly_xp_tracking; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.weekly_xp_tracking ENABLE ROW LEVEL SECURITY;

--
-- Name: xp_rewards_config; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.xp_rewards_config ENABLE ROW LEVEL SECURITY;

--
-- Name: xp_transactions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--

