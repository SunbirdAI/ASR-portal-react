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
