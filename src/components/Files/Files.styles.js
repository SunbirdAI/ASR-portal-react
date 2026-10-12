import tw, { styled } from "twin.macro";

export const DashboardShell = styled.div`
  ${tw`grid gap-6 items-start`}
  grid-template-columns: 1fr;

  @media (min-width: 1080px) {
    grid-template-columns: 360px minmax(0, 1fr);
  }
`;

export const SessionRail = styled.aside`
  ${tw`flex flex-col gap-4 p-4 md:p-5`}
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 24px;
  box-shadow: var(--color-elev-shadow);

  @media (min-width: 1080px) {
    position: sticky;
    top: 96px;
    max-height: calc(100vh - 124px);
  }
`;

export const RailHeader = styled.header`
  ${tw`flex items-start justify-between gap-3`}

  h1 {
    ${tw`m-0 text-xl font-medium`}
    color: var(--color-navy);
  }

  p {
    ${tw`m-0 mt-1 text-sm`}
    color: var(--color-muted);
  }
`;

export const SearchInput = styled.input`
  ${tw`w-full px-4 py-3 text-sm outline-none`}
  color: var(--color-text);
  background: var(--color-surface-strong);
  border: 1px solid var(--color-border);
  border-radius: 999px;

  &:focus {
    border-color: var(--color-accent-strong);
    box-shadow: 0 0 0 3px var(--color-focus-ring);
  }
`;

export const SessionList = styled.div`
  ${tw`flex flex-col gap-2 overflow-auto pr-1`}
`;

export const SessionItem = styled.button`
  ${tw`w-full flex items-start gap-3 p-3 text-left cursor-pointer transition duration-200`}
  color: var(--color-text);
  background: ${(props) =>
    props.active ? "var(--color-accent-soft)" : "var(--color-surface-strong)"};
  border: 1px solid
    ${(props) =>
      props.active ? "rgba(220, 120, 40, 0.28)" : "var(--color-border)"};
  border-radius: 18px;

  &:hover {
    border-color: var(--color-accent-strong);
  }

  h2 {
    ${tw`m-0 text-sm font-medium truncate`}
  }

  p {
    ${tw`m-0 mt-1 text-xs`}
    color: var(--color-muted);
  }
`;

export const SessionIcon = styled.span`
  ${tw`inline-flex items-center justify-center shrink-0`}
  width: 38px;
  height: 38px;
  color: var(--color-accent-strong);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 14px;
`;

export const Workspace = styled.main`
  ${tw`flex flex-col gap-5 p-4 md:p-6`}
  min-height: 680px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 24px;
  box-shadow: var(--color-elev-shadow);
`;

export const WorkspaceHeader = styled.header`
  ${tw`flex flex-col md:flex-row md:items-start md:justify-between gap-4`}

  h2 {
    ${tw`m-0 text-xl font-medium leading-snug`}
    color: var(--color-navy);
  }

  p {
    ${tw`m-0 mt-2 text-sm`}
    color: var(--color-muted);
  }
`;

export const MetadataGrid = styled.div`
  ${tw`grid gap-3`}
  grid-template-columns: repeat(2, minmax(0, 1fr));

  @media (min-width: 760px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

export const MetadataCard = styled.div`
  ${tw`p-4`}
  background: var(--color-surface-strong);
  border: 1px solid var(--color-border);
  border-radius: 18px;

  span {
    ${tw`block text-xs font-medium`}
    color: var(--color-muted);
    letter-spacing: 0;
  }

  strong {
    ${tw`block mt-2 text-sm font-medium truncate`}
    color: var(--color-text);
  }
`;

export const PlayerCard = styled.section`
  ${tw`flex flex-col gap-4 p-4`}
  background: var(--color-surface-strong);
  border: 1px solid var(--color-border);
  border-radius: 22px;
`;

export const Waveform = styled.div`
  ${tw`flex items-center gap-1 px-4 py-5`}
  height: 112px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 18px;
`;

export const WaveBar = styled.span`
  ${tw`block flex-1`}
  min-width: 3px;
  max-width: 12px;
  background: var(--color-accent-strong);
  border-radius: 999px;
  opacity: 0.5;
`;

export const Toolbar = styled.div`
  ${tw`flex flex-wrap items-center justify-between gap-3`}
`;

export const ButtonGroup = styled.div`
  ${tw`flex flex-wrap gap-2`}
`;

export const ExportButton = styled.button`
  ${tw`inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium cursor-pointer transition duration-200`}
  color: var(--color-text);
  background: var(--color-surface-strong);
  border: 1px solid var(--color-border);
  border-radius: 999px;

  &:hover {
    color: var(--color-accent-strong);
    border-color: var(--color-accent-strong);
  }
`;

export const PrimaryLink = styled.a`
  ${tw`inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium no-underline`}
  color: #ffffff;
  background: var(--color-accent-strong);
  border-radius: 999px;
`;

export const TranscriptPanel = styled.section`
  ${tw`flex flex-col`}
  border-top: 1px solid var(--color-border);
`;

export const TranscriptLine = styled.div`
  ${tw`grid gap-3 py-4`}
  grid-template-columns: 56px minmax(0, 1fr);
  border-bottom: 1px solid var(--color-border);

  p {
    ${tw`m-0 text-sm md:text-base leading-7`}
  }
`;

export const Timestamp = styled.span`
  ${tw`text-xs font-medium pt-1`}
  color: var(--color-muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
`;

export const EmptyState = styled.div`
  ${tw`flex flex-col items-center justify-center text-center gap-3 p-8`}
  min-height: 420px;
  color: var(--color-muted);
  background: var(--color-surface);
  border: 1px dashed var(--color-border);
  border-radius: 24px;

  h2 {
    ${tw`m-0 text-xl font-medium`}
    color: var(--color-navy);
  }

  p {
    ${tw`m-0 max-w-md text-sm md:text-base leading-7`}
  }
`;
