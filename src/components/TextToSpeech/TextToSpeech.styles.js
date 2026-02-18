import tw, { styled } from "twin.macro";

export const FieldGroup = styled.div`
  ${tw`w-full flex flex-col gap-2`}
`;

export const FieldLabel = styled.label`
  ${tw`text-sm font-semibold`}
  color: var(--color-text);
`;

export const FieldHint = styled.p`
  ${tw`m-0 text-xs md:text-sm`}
  color: var(--color-muted);
`;

export const TtsTextArea = styled.textarea`
  ${tw`
    w-full
    rounded-xl
    border
    p-3
    resize-none
    text-black
    bg-white
    outline-none
    transition
    duration-200
    ease-in-out
  `}
  min-height: 190px;
  line-height: 1.65;
  color: var(--color-text);
  background: var(--color-surface);
  border-color: var(--color-border);
  &:focus {
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px var(--color-focus-ring);
    background: var(--color-accent-soft);
  }
`;

export const SpeakerSelect = styled.select`
  ${tw`
    w-full
    rounded-xl
    border
    px-4
    py-3
    bg-white
    text-black
    outline-none
    transition
    duration-200
    ease-in-out
  `}
  color: var(--color-text);
  background: var(--color-surface);
  border-color: var(--color-border);
  &:focus {
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px var(--color-focus-ring);
    background: var(--color-accent-soft);
  }
`;

export const CharacterCounter = styled.span`
  ${tw`text-xs ml-auto`}
  color: var(--color-muted);
`;

export const AudioPreview = styled.audio`
  ${tw`w-full`}
`;

export const PlaceholderCard = styled.div`
  ${tw`w-full p-4 rounded-xl text-sm`}
  border: 1px dashed var(--color-border);
  color: var(--color-muted);
  background: var(--color-surface);
`;

export const LoadingNotice = styled.div`
  ${tw`w-full p-4 rounded-xl flex flex-col gap-2`}
  border: 1px solid var(--color-border);
  background: var(--color-pill);
`;

export const LoadingTitle = styled.p`
  ${tw`m-0 text-sm font-semibold`}
  color: var(--color-text);
`;

export const LoadingMeta = styled.p`
  ${tw`m-0 text-xs md:text-sm`}
  color: var(--color-muted);
`;
