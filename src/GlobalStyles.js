import tw, {styled} from 'twin.macro';

export const Wrapper = styled.div`
  ${tw`
    w-full
    mx-auto
    px-4
    pt-6
    pb-8
    md:px-8
    lg:px-10
   `}
  max-width: 1200px;
  min-height: calc(100vh - 88px);
`;
