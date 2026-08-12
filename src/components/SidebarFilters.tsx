import * as Accordion from '@radix-ui/react-accordion';
import { IconChevronDown, IconFilter } from './icons';
import type { FilterGroups } from '../lib/types';

type Props = {
  groups: FilterGroups;
  category: string | null;
  tags: string[];
  stack: string[];
  onCategory: (category: string | null) => void;
  onToggleTag: (tag: string) => void;
  onToggleStack: (item: string) => void;
};

function ItemButton({
  label,
  active,
  single,
  onClick,
}: {
  label: string;
  active: boolean;
  single?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
        active ? 'text-ink' : 'text-muted hover:text-ink'
      }`}
    >
      <span
        className={`inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center border ${
          single ? 'rounded-full' : 'rounded-[4px]'
        } ${active ? 'border-terracotta bg-terracotta' : 'border-line'}`}
      >
        {active && <span className="h-1 w-1 rounded-full bg-background" />}
      </span>
      <span className="truncate">{label}</span>
    </button>
  );
}

function Group({
  value,
  title,
  children,
}: {
  value: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Accordion.Item value={value} className="border-b border-line">
      <Accordion.Header>
        <Accordion.Trigger className="group flex w-full items-center justify-between py-2.5 text-sm font-medium text-ink outline-none">
          {title}
          <IconChevronDown
            className="h-4 w-4 text-muted transition-transform duration-200 group-data-[state=open]:rotate-180"
            aria-hidden="true"
          />
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
        <div className="flex flex-col gap-0.5 pb-3">{children}</div>
      </Accordion.Content>
    </Accordion.Item>
  );
}

export default function SidebarFilters(props: Props) {
  const { groups, category, tags, stack, onCategory, onToggleTag, onToggleStack } = props;

  return (
    <div className="rounded-lg border border-line bg-surface/30 p-4">
      <h2 className="mb-2 flex items-center gap-2 font-brand text-xl font-semibold text-ink">
        <IconFilter className="h-4 w-4 text-terracotta" aria-hidden="true" />
        Filtros
      </h2>

      <Accordion.Root type="multiple">
        <Group value="categoria" title="Categoria">
          {groups.categories.map((c) => (
            <ItemButton
              key={c}
              label={c}
              single
              active={category === c}
              onClick={() => onCategory(category === c ? null : c)}
            />
          ))}
        </Group>

        <Group value="topicos" title="Tópicos">
          {groups.topics.map((t) => (
            <ItemButton
              key={t}
              label={t}
              active={tags.includes(t)}
              onClick={() => onToggleTag(t)}
            />
          ))}
        </Group>

        {groups.stack.length > 0 && (
          <Group value="stack" title="Stack">
            {groups.stack.map((s) => (
              <ItemButton
                key={s}
                label={s}
                active={stack.includes(s)}
                onClick={() => onToggleStack(s)}
              />
            ))}
          </Group>
        )}
      </Accordion.Root>
    </div>
  );
}
