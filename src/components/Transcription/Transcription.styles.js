import tw, { styled } from "twin.macro";

export const ModeShell = styled.section`
  ${tw`
    w-full
    flex
    flex-col
    gap-4
  `}
`;

export const ModeHeader = styled.header`
  ${tw`w-full p-4 rounded-2xl`}
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  box-shadow: var(--color-elev-shadow);
`;

export const ModeTitle = styled.h2`
  ${tw`m-0 text-xl md:text-2xl font-bold text-sunbird-navy-blue`}
  color: var(--color-text);
`;

export const ModeDescription = styled.p`
  ${tw`m-0 mt-2 text-sm md:text-base`}
  color: var(--color-muted);
`;

export const ModeTabs = styled.div`
  ${tw`
    flex
    w-full
    p-1
    rounded-2xl
    gap-1
    overflow-x-auto
  `}
  background: transparent;
  border: none;
`;

export const ModeTab = styled.button`
  ${tw`
    rounded-full
    px-4
    py-2.5
    text-sm
    md:text-base
    font-semibold
    cursor-pointer
    transition
    duration-200
    ease-in-out
    whitespace-nowrap
  `}
  color: var(--color-text);
  background: ${props =>
    props.active ? "var(--color-surface)" : "var(--color-pill)"};
  border: 1px solid var(--color-border);
  border-bottom: ${props =>
    props.active ? "2px solid var(--color-accent)" : "1px solid var(--color-border)"};
  box-shadow: ${props => (props.active ? "var(--color-elev-soft)" : "none")};
  &:hover {
    background: var(--color-surface);
  }
  &:focus-visible {
    outline: 3px solid var(--color-focus-ring);
    outline-offset: 2px;
  }
`;

export const ModeContent = styled.div`
  ${tw`
    w-full
    flex
    flex-col
    gap-4
  `}
`;
