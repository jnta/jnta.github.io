import { useEffect, useMemo, useState } from 'react';
import { IconClose, IconGrid, IconList, IconSearch, IconSliders } from './icons';
import type { FilterGroups, PostCardData } from '../lib/types';
import Diagram from './Diagram';
import SidebarFilters from './SidebarFilters';

type Sort = 'newest' | 'oldest';
type View = 'grid' | 'list';

type FilterState = {
  category: string | null;
  tags: string[];
  stack: string[];
  search: string;
  sort: Sort;
};

const DEFAULT_STATE: FilterState = {
  category: null,
  tags: [],
  stack: [],
  search: '',
  sort: 'newest',
};

function readState(): FilterState {
  const p = new URLSearchParams(window.location.search);
  return {
    category: p.get('category'),
    tags: (p.get('tags') ?? '').split(',').filter(Boolean),
    stack: (p.get('stack') ?? '').split(',').filter(Boolean),
    search: p.get('search') ?? '',
    sort: p.get('sort') === 'oldest' ? 'oldest' : 'newest',
  };
}

function writeState(state: FilterState) {
  const p = new URLSearchParams();
  if (state.category) p.set('category', state.category);
  if (state.tags.length) p.set('tags', state.tags.join(','));
  if (state.stack.length) p.set('stack', state.stack.join(','));
  if (state.search) p.set('search', state.search);
  if (state.sort !== 'newest') p.set('sort', state.sort);
  const qs = p.toString();
  const url = window.location.pathname + (qs ? `?${qs}` : '');
  window.history.replaceState(null, '', url);
}

function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative flex-1">
      <IconSearch 
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar artigos, tópicos ou tecnologias..."
        className="h-10 w-full rounded-md border border-line bg-background pl-9 pr-9 text-sm text-ink placeholder:text-muted focus:border-terracotta focus:outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Limpar busca"
          className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-muted hover:text-ink"
        >
          <IconClose  className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function ViewToggle({ view, onChange }: { view: View; onChange: (v: View) => void }) {
  const base =
    'inline-flex h-10 items-center gap-1.5 px-3 text-sm transition-colors first:rounded-l-md last:rounded-r-md';
  const active = 'bg-surface text-ink';
  const idle = 'text-muted hover:text-ink';
  return (
    <div className="inline-flex rounded-md border border-line" role="group" aria-label="Alternar visualização">
      <button
        type="button"
        onClick={() => onChange('grid')}
        aria-pressed={view === 'grid'}
        className={`${base} ${view === 'grid' ? active : idle}`}
      >
        <IconGrid  className="h-4 w-4" /> Grade
      </button>
      <button
        type="button"
        onClick={() => onChange('list')}
        aria-pressed={view === 'list'}
        className={`${base} ${view === 'list' ? active : idle}`}
      >
        <IconList  className="h-4 w-4" /> Lista
      </button>
    </div>
  );
}

function SortSelect({ value, onChange }: { value: Sort; onChange: (v: Sort) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as Sort)}
      aria-label="Ordenar por"
      className="h-10 cursor-pointer rounded-md border border-line bg-background px-3 text-sm text-muted focus:border-terracotta focus:outline-none"
    >
      <option value="newest">Mais recentes</option>
      <option value="oldest">Mais antigos</option>
    </select>
  );
}

function Card({ post }: { post: PostCardData }) {
  const href = `/blog/${post.slug}/`;
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-line bg-surface/40 transition-all duration-200 hover:-translate-y-1 hover:shadow-lift">
      <a href={href} className="block aspect-[16/10] overflow-hidden border-b border-line" tabIndex={-1}>
        <Diagram
          seed={post.slug}
          label={post.cover}
          className="transition-transform duration-300 group-hover:scale-[1.04]"
        />
      </a>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-brand text-xl font-semibold leading-snug">
          <a href={href} className="line-clamp-2 transition-colors hover:text-terracotta">
            {post.title}
          </a>
        </h3>
        <p className="line-clamp-3 text-sm leading-relaxed text-muted">{post.description}</p>
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-line pt-3">
          <span className="font-mono text-xs text-muted">
            {post.readingTime} · {post.dateLabel}
          </span>
          <span className="rounded-md border border-line px-2 py-0.5 font-mono text-xs text-olive">
            {post.topic}
          </span>
        </div>
      </div>
      <div
        className="pointer-events-none absolute inset-0 hatch opacity-0 transition-opacity duration-200 group-hover:opacity-[0.12]"
        aria-hidden="true"
      />
    </article>
  );
}

function ListRow({ post }: { post: PostCardData }) {
  const href = `/blog/${post.slug}/`;
  return (
    <article className="group relative flex gap-5 overflow-hidden rounded-lg border border-line bg-surface/40 p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lift">
      <a href={href} className="hidden w-40 shrink-0 overflow-hidden rounded-md border border-line sm:block" tabIndex={-1}>
        <Diagram seed={post.slug} label={post.cover} className="transition-transform duration-300 group-hover:scale-[1.04]" />
      </a>
      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="font-brand text-xl font-semibold leading-snug">
          <a href={href} className="line-clamp-2 transition-colors hover:text-terracotta">
            {post.title}
          </a>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{post.description}</p>
        <div className="mt-auto flex items-center gap-3 pt-3">
          <span className="font-mono text-xs text-muted">
            {post.readingTime} · {post.dateLabel}
          </span>
          <span className="rounded-md border border-line px-2 py-0.5 font-mono text-xs text-olive">
            {post.topic}
          </span>
        </div>
      </div>
      <div
        className="pointer-events-none absolute inset-0 hatch opacity-0 transition-opacity duration-200 group-hover:opacity-[0.12]"
        aria-hidden="true"
      />
    </article>
  );
}

export default function BlogExplorer({
  posts,
  groups,
}: {
  posts: PostCardData[];
  groups: FilterGroups;
}) {
  const [state, setState] = useState<FilterState>(DEFAULT_STATE);
  const [view, setView] = useState<View>('grid');
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setState(readState());
    const onPop = () => setState(readState());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    writeState(state);
  }, [state]);

  const update = (patch: Partial<FilterState>) => setState((s) => ({ ...s, ...patch }));

  const filtered = useMemo(() => {
    let list = posts;
    if (state.category) list = list.filter((p) => p.category === state.category);
    if (state.tags.length) list = list.filter((p) => state.tags.some((t) => p.tags.includes(t)));
    if (state.stack.length) list = list.filter((p) => state.stack.some((s) => p.stack.includes(s)));
    if (state.search) {
      const q = state.search.toLowerCase();
      list = list.filter((p) =>
        [p.title, p.description, p.category, p.topic, ...p.tags, ...p.stack]
          .join(' ')
          .toLowerCase()
          .includes(q),
      );
    }
    const sorted = [...list].sort(
      (a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf(),
    );
    if (state.sort === 'oldest') sorted.reverse();
    return sorted;
  }, [posts, state]);

  const hasFilters =
    !!state.category || state.tags.length > 0 || state.stack.length > 0 || !!state.search;

  const filtersPanel = (
    <SidebarFilters
      groups={groups}
      category={state.category}
      tags={state.tags}
      stack={state.stack}
      onCategory={(c) => update({ category: c })}
      onToggleTag={(t) =>
        update({ tags: state.tags.includes(t) ? state.tags.filter((x) => x !== t) : [...state.tags, t] })
      }
      onToggleStack={(s) =>
        update({ stack: state.stack.includes(s) ? state.stack.filter((x) => x !== s) : [...state.stack, s] })
      }
    />
  );

  return (
    <div>
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
        {/* Mobile drawer trigger */}
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="inline-flex w-fit items-center gap-2 rounded-md border border-line px-3 py-2 text-sm text-ink lg:hidden"
        >
          <IconSliders  className="h-4 w-4 text-terracotta" />
          Filtrar
        </button>

        <aside className="hidden w-60 shrink-0 lg:block">{filtersPanel}</aside>

        <main className="min-w-0 flex-1">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <SearchBar value={state.search} onChange={(v) => update({ search: v })} />
            <div className="flex items-center gap-3">
              <SortSelect value={state.sort} onChange={(s) => update({ sort: s })} />
              <ViewToggle view={view} onChange={setView} />
            </div>
          </div>

          {hasFilters && (
            <div className="mb-4">
              <button
                type="button"
                onClick={() => update({ category: null, tags: [], stack: [], search: '' })}
                className="font-mono text-xs text-terracotta hover:underline"
              >
                Limpar filtros
              </button>
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="rounded-lg border border-dashed border-line p-12 text-center">
              <p className="font-brand text-lg text-ink">Nenhum artigo encontrado</p>
              <p className="mt-1 text-sm text-muted">Tente ajustar os filtros ou a busca.</p>
            </div>
          ) : view === 'grid' ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((p) => (
                <Card key={p.slug} post={p} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filtered.map((p) => (
                <ListRow key={p.slug} post={p} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-overlay"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 w-[290px] overflow-y-auto bg-background p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-brand text-lg font-medium text-ink">Filtros</span>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Fechar"
                className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-surface hover:text-ink"
              >
                <IconClose  className="h-5 w-5" />
              </button>
            </div>
            {filtersPanel}
          </div>
        </div>
      )}
    </div>
  );
}
