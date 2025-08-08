"use client";

// should receive 9 children to lay out in a box
export default function TrioLayout({ children }: { children: React.ReactNode[] }) {

    return (
        <div className={trioLayoutClass}>
            {children.map((child : any, index : number) => (
                <div key={index} className="flex items-center justify-center">
                    {child}
                </div>
            ))}
        </div>
    )
}


const trioLayoutClass = `
    grid
    grid-cols-3
    grid-rows-3
    gap-0
`;