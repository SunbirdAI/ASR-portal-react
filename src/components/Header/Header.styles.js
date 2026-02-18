import tw, {styled} from "twin.macro";


export const Nav = styled.div`
  ${tw`
    flex
    justify-between
    items-center
    px-4
    py-3
    md:px-8
    lg:px-10
    top-0
    z-50
    sticky
  `}
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
`;

export const Brand = styled.div`
  ${tw`flex items-center gap-3`}
`;


export const Title = styled.h1`
  ${tw`
    font-bold
    text-sunbird-navy-blue
    text-lg
    md:text-xl
    m-0
    tracking-tight
  `}
  color: var(--color-text);
`;

export const Logo = styled.img`
  ${tw`h-8 md:h-9`}
`;
