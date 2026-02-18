import tw, { styled } from "twin.macro";

export const Nav = styled.div`
  ${tw`
    flex
    fixed
    inset-x-0
    bottom-0
    items-center
    justify-center
    p-4
    bg-white
    text-black
    z-50
  `}
  background: var(--color-surface);
  color: var(--color-text);
  border-top: 1px solid var(--color-border);
`;

export const AudioPlayerContainer = styled.div`
  ${tw`w-full max-w-xl`}
`;

export const FooterContainer = styled.footer`
  ${tw`
    w-full
    flex
    flex-col
    md:flex-row
    md:items-center
    md:justify-between
    gap-3
    p-3
    rounded-2xl
  `}
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  box-shadow: var(--color-elev-shadow);
`;

export const ButtonContainer = styled.div`
  ${tw`w-full md:w-auto flex justify-end`}
`;

export const EditButtonContainer = styled.div`
  ${tw`absolute right-40 max-sm:right-20 bottom-4`}
  @media (max-width: 60px) {
    ${tw`relative mt-4`}
  }
`;

export const TextNav = styled.p`
  ${tw`m-0`}
  font-size: 14px;
`;
