import tw, { styled } from "twin.macro";

export const TextAreaShell = styled.div`
  ${tw`w-full rounded-2xl p-3 md:p-4`}
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  box-shadow: var(--color-elev-shadow);
`;

export const TextArea = styled.textarea`
   ${tw`
    w-full
    h-72
    p-4
    text-black
    transition
    rounded-xl
    focus:text-black
    focus:bg-white
    focus:outline-none
    resize-none
  `}
  color: var(--color-text);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  font-size: 15px;
  line-height: 1.65;
  &:focus {
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px var(--color-focus-ring);
    background: var(--color-accent-soft);
  }
  @media (max-width: 768px) {
    min-height: 230px;
  }
`;

/* ── Timestamped segment view ─────────────────────────────── */

export const SegmentList = styled.div`
  ${tw`w-full flex flex-col gap-3`}
  max-height: 22rem;
  overflow-y: auto;
  padding: 0.25rem 0.25rem 0.25rem 0;

  /* subtle scrollbar */
  scrollbar-width: thin;
  scrollbar-color: var(--color-border) transparent;
  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: var(--color-border);
    border-radius: 999px;
  }
`;

export const SegmentItem = styled.div`
  ${tw`flex flex-col gap-1 rounded-xl p-3`}
  background: var(--color-pill, rgba(0,0,0,0.04));
  border: 1px solid var(--color-border);
  transition: background 0.15s ease;

  &:hover {
    background: var(--color-accent-soft);
    border-color: var(--color-accent);
  }
`;

export const TimeBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-family: "JetBrains Mono", "Fira Code", ui-monospace, monospace;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--color-accent);
  background: var(--color-accent-soft);
  border: 1px solid var(--color-accent, #d97706);
  border-radius: 999px;
  padding: 1px 8px;
  width: fit-content;
`;

export const SegmentText = styled.p`
  ${tw`m-0`}
  font-size: 15px;
  line-height: 1.7;
  color: var(--color-text);
`;

