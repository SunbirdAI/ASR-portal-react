import tw, { styled } from "twin.macro";

export const Button = styled.button`${tw`relative`}`;

export const RelativeDiv = styled.div`${tw`relative`}`;

export const OuterRing = styled.div`
${tw`
relative
flex
items-center
justify-center
rounded-full
w-11
h-11
transition-all
duration-200
`};
background: var(--color-surface);
border: 1px solid var(--color-border);
color: var(--color-text);
&:hover {
  background: var(--color-pill);
}
`;

export const DropDownList = styled.ul`
${tw`
absolute
rounded-xl
top-full
right-0
mt-2
w-44
bg-white
shadow-md
transition-all
duration-300
ease-in
`};
background: var(--color-surface);
border: 1px solid var(--color-border);
box-shadow: var(--color-elev-soft);
color: var(--color-text);
`;

export const SectionLabel = styled.p`
${tw`m-0 px-5 pt-2 pb-2 text-xs font-semibold uppercase tracking-wider`};
color: var(--color-muted);
`;

export const ThemeOptions = styled.div`
${tw`px-3 pb-3 flex flex-col gap-2`};
`;

export const ThemeOption = styled.button`
${tw`w-full rounded-full px-3 py-2 text-xs font-semibold cursor-pointer transition duration-200 ease-in-out text-left`};
color: var(--color-text);
background: ${(props) =>
  props.active ? "var(--color-surface)" : "var(--color-pill)"};
border: 1px solid
  ${(props) =>
    props.active ? "var(--color-accent)" : "var(--color-border)"};
box-shadow: ${(props) => (props.active ? "var(--color-elev-soft)" : "none")};
&:hover {
  background: var(--color-surface);
}
`;
