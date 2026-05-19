"use client"
import { Header } from "@/components/shared";
import { cn } from "@/lib/utils";

export default function AuthLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <div  className="page p-0 bg-linear-to-br  to-primary from-accent">
   

    <main className="flex-col md:flex-row">
        <div className=" flex-[0.3] md:flex-1 p-4  ">
            <Header profile={null}/>
            <div
            className="mx-auto max-w-md relative w-full h-full"
            >
            {/* The parent is relative, children are absolutely positioned for a scattered tile effect */}
               <Tile className="text-accent top-[10%] md:top-[7%] md:left-[10%] rotate-[-7deg]">
                    learn it.
               </Tile>
                 <Tile className="z-3 text-white top-[40%] md:top-[49%] left-[20%] md:left-[20%] rotate-[10deg] md:rotate-[-5deg]">
                    share it.
                </Tile>
                <Tile className="z-2 text-secondary top-[24%] md:top-[27%] left-[47%] md:left-[47%] rotate-[-12deg] md:rotate-[12deg]"> 
                    save it.
                </Tile>
              
                <Tile className="z-4 text-primary top-[30%] left-[70%] md:top-[70%] md:left-[55%] rotate-[7deg]">
                    deskkit.
                </Tile>
            </div>
        </div>
        <div className="flex-1 md:flex-1  bg-surface w-full rounded-0 rounded-t-3xl md:rounded-l-3xl md:rounded-t-none  h-full flex items-center justify-center">
            {children}
        </div>

    </main>
    
    </div>
  );
}
type TileProps = {  
    children: React.ReactNode;
    className: string;
}
function Tile({ children, className }: TileProps) {
  return (
    <div className={cn("absolute text-md md:text-5xl  font-bold z-1 bg-black rounded-md md:rounded-2xl text-nowrap px-5 py-3 md:px-8 md:py-6 shadow-[2px_4px_12px_0_rgba(0,0,0,0.7)]", className)}>
      {children}
    </div>
  );
}