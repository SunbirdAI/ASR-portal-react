import tw, { styled } from "twin.macro";

export const MainContainer = styled.div`
  ${tw`
    flex
    flex-col-reverse
    w-full
    gap-5
    relative
  `}
  @media (min-width: 1024px) {
    ${tw`grid`}
    grid-template-columns: minmax(320px, 0.95fr) minmax(420px, 1.2fr);
    align-items: start;
  }
`;

export const LanguageDropdown = styled.select`
  ${tw`
    w-full
    px-4
    py-3
    my-2
    border
    rounded-xl
    bg-white
    text-black
    transition
    duration-200
    ease-in-out
    outline-none
  `}
  background: var(--color-surface);
  color: var(--color-text);
  border-color: var(--color-border);
  &:focus {
    border-color: var(--color-accent);
    background: var(--color-accent-soft);
    box-shadow: 0 0 0 3px var(--color-focus-ring);
  }
`;

export const ResponsiveContainer = styled.div`
  ${tw`w-full flex flex-col gap-4 p-4 rounded-2xl`}
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  box-shadow: var(--color-elev-shadow);
`;

export const ButtonContainer = styled.div`
  ${tw`w-full flex flex-wrap items-center gap-3`}
`;

export const AudioPlayerContainer = styled.div`
  ${tw`w-full`}
`;

export const DynamicMainContainer = styled(MainContainer)`
  padding-bottom: ${props => (props.hasFooter ? "8px" : "0")};
`;

export const Note = styled.div`
  ${tw`
    flex
    p-3
    w-full
    items-start
    text-black
    rounded-xl
    mb-5
    justify-between
    relative
    gap-3
  `}
  color: var(--color-text);
  border: 1px solid var(--color-border);
  background: var(--color-accent-soft);
`;

export const CloseButton = styled.button`
  ${tw`
    bg-transparent
    border-0
    text-black
    cursor-pointer
    text-base
    h-8
    w-8
    rounded-full
  `}
  color: var(--color-text);
  &:hover {
    background: var(--color-pill);
  }
`;

export const FeedbackContainer = styled.div`
  ${tw`
    w-full
    flex
    flex-col
    items-start
    p-4
    mt-2
    rounded-xl
    gap-3
  `}
  background: var(--color-surface);
  border: 1px solid var(--color-border);
`;

export const RatingStars = styled.div`
  ${tw`
    flex
    justify-start
    gap-1
  `}
  span {
    ${tw`
      text-3xl
      cursor-pointer
      transition
      duration-200
      ease-in-out
    `}
    &:hover {
      transform: scale(1.06);
    }
  }
`;

export const FeedbackTextarea = styled.textarea`
  ${tw`
    w-full
    p-3
    border
    rounded-xl
    outline-none
    resize-none
    text-black
    bg-white
  `}
  color: var(--color-text);
  background: var(--color-surface);
  border-color: var(--color-border);
  min-height: 100px;
  &:focus {
    border-color: var(--color-accent);
    background: var(--color-accent-soft);
    box-shadow: 0 0 0 3px var(--color-focus-ring);
  }
`;

export const WorkflowPanel = styled.section`
  ${tw`w-full flex flex-col gap-4`}
`;

export const ResultPanel = styled.section`
  ${tw`w-full flex flex-col gap-4`}
`;

export const SectionHeading = styled.h2`
  ${tw`m-0 text-2xl md:text-3xl font-bold text-sunbird-navy-blue`}
  color: var(--color-text);
`;

export const SectionSubtext = styled.p`
  ${tw`m-0 text-sm md:text-base`}
  color: var(--color-muted);
`;

export const ProgressTrack = styled.ol`
  ${tw`m-0 p-0 list-none flex flex-col md:flex-row gap-2 md:gap-3`}
`;

export const ProgressStep = styled.li`
  ${tw`text-sm px-3 py-2 rounded-full`}
  color: var(--color-text);
  background: ${props =>
    props.active ? "var(--color-surface)" : "var(--color-pill)"};
  border: 1px solid var(--color-border);
  border-bottom: ${props =>
    props.active ? "2px solid var(--color-accent)" : "1px solid var(--color-border)"};
  box-shadow: ${props => (props.active ? "var(--color-elev-soft)" : "none")};
`;

export const StepCard = styled.article`
  ${tw`w-full p-4 rounded-2xl flex flex-col gap-3`}
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  box-shadow: var(--color-elev-soft);
`;

export const StepMeta = styled.span`
  ${tw`inline-flex items-center w-fit px-3 py-1 text-xs rounded-full font-semibold tracking-wide uppercase`}
  color: var(--color-text);
  background: var(--color-pill);
  border: 1px solid var(--color-border);
`;

export const StepTitle = styled.h3`
  ${tw`m-0 text-lg font-semibold text-sunbird-navy-blue`}
  color: var(--color-text);
`;

export const StepDescription = styled.p`
  ${tw`m-0 text-sm`}
  color: var(--color-muted);
`;

export const StatusPill = styled.span`
  ${tw`inline-flex items-center w-fit px-3 py-1 text-xs rounded-full font-medium`}
  color: var(--color-text);
  background: ${props =>
    props.ready ? "var(--color-accent-soft)" : "var(--color-pill)"};
  border: 1px solid
    ${props =>
      props.ready ? "rgba(217, 119, 6, 0.35)" : "var(--color-border)"};
`;

export const TranscriptToolbar = styled.div`
  ${tw`w-full flex flex-wrap items-center justify-between gap-3`}
`;

export const NoteText = styled.p`
  ${tw`m-0 text-sm leading-6`}
`;

export const GlassButton = styled.button`
  ${tw`border rounded-full font-semibold px-5 py-3 cursor-pointer transition duration-200 ease-in-out`}
  min-height: 46px;
  color: var(--color-accent);
  background: var(--color-surface);
  border-color: var(--color-accent);
  &:hover {
    background: var(--color-accent-soft);
  }
  &:focus-visible {
    outline: 3px solid var(--color-focus-ring);
    outline-offset: 2px;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const GhostButton = styled.button`
  ${tw`border rounded-full font-semibold px-5 py-3 cursor-pointer transition duration-200 ease-in-out`}
  min-height: 44px;
  color: var(--color-text);
  background: var(--color-pill);
  border-color: var(--color-border);
  &:hover {
    background: var(--color-surface);
    box-shadow: var(--color-elev-soft);
  }
  &:focus-visible {
    outline: 3px solid var(--color-focus-ring);
    outline-offset: 2px;
  }
`;
