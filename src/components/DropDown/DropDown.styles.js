import tw, { styled } from "twin.macro";

export const Button = styled.button`${tw`relative`}`

export const RelativeDiv = styled.div`${tw`relative`}`

export const Stripe = styled.div`
${tw`
bg-white
h-1
w-7 
transform 
transition-all 
duration-300
`}`

export const OuterRing = styled.div`
${tw`
relative 
flex 
overflow-hidden 
items-center 
justify-center 
rounded-full 
w-12 
h-12 
transform 
transition-all 
bg-slate-700 
ring-0 
ring-gray-300 
hover:ring-8 
group-focus:ring-4 
ring-opacity-30 
duration-200 
shadow-md`}`

export const FlexRing = styled.div`
${tw`
flex 
flex-col 
justify-between 
w-5 
h-5 
transform 
transition-all
duration-300 
origin-center 
overflow-hidden
`}`

export const XBar = styled.div`
${tw`
absolute 
bg-white 
h-1 
w-5 
transform 
transition-all 
duration-500 
delay-300`}`

export const XContainer = styled.div`
${tw`
absolute
items-center
justify-between 
transform
transition-all
duration-500
top-2.5
`}`

export const DropDownList = styled.ul`
${tw`
absolute 
rounded-lg 
top-full 
right-0 
mt-2 
w-40 
bg-white 
shadow-lg 
ring-1 
ring-gray-300 
transition-all 
duration-300
ease-in
`}`

export const DropDownItem = styled.li`
${tw`
py-3 
px-5 
text-start 
font-medium 
hover:bg-blue-100 
cursor-pointer
`}`

export const LoginButton = styled.button`
${tw`
px-3
py-2
text-white
bg-sunbird-orange
rounded-md
inline-flex
items-center
justify-center
hover:opacity-90
cursor-pointer

`}`;