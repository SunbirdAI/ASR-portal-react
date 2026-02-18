import tw, {styled} from "twin.macro";

export const SamplePhrasesAccordion = styled.div`
  ${tw`
    md:col-span-2
    h-full
   `}
`;

export const PhraseList = styled.ul`
  ${tw`
    divide-y
    divide-[#E5E5E3]
   `}
`;

export const PhraseListItem = styled.li`
  ${tw`
    p-3
   `}
  &:hover {
    background: #efefed;
  }
`;
