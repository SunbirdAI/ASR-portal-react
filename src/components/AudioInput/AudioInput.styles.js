import tw, { styled } from 'twin.macro';

export const Container = styled.div`
  ${tw`
    flex
    flex-col
    items-stretch
    justify-start
    p-0
    gap-4
    w-full
  `}
  @media (min-width: 768px) {
    ${tw`flex-row items-center`}
  }
`;


export const DropZoneContainer = styled.div`
  ${tw`
    flex
    flex-1
    justify-center
    items-center
    p-6
    text-black
    border-2
    border-dashed
    rounded-2xl
    cursor-pointer
    transition
    duration-200
    ease-in-out
  `}
  color: var(--color-text);
  border-color: var(--color-border);
  background: var(--color-surface);
  &:hover {
    border-color: var(--color-border);
    background: var(--color-pill);
  }
  &.active {
    border-color: var(--color-accent);
    background: var(--color-accent-soft);
    color: var(--color-text);
  }
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.35);
  min-height: 132px;
  font-size: 15px;
  text-align: center;
  line-height: 1.5;
`;

export const RecordingArea = styled.div`
  ${tw`
    flex
    items-center
    justify-center
    w-full
    md:w-auto
  `}
`;

export const LoadingContainer = styled.div`
  ${tw`
    flex
    justify-center
    items-center
    w-full
    h-full
  `}
`;

export const VerticalDottedLine = styled.div`
  ${tw`hidden md:block w-0 h-16 bg-transparent border-l-2 border-dotted my-4 mx-2`}
  border-color: var(--color-border);
`;
