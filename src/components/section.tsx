import { cn } from "@/lib/utils";

const Section = ({ children, id, className }: { children: React.ReactNode, id?: string, className?: string }) => {
    return (
        <section 
            id={id} 
            className={cn("flex flex-col p-4 md:p-8 scroll-mt-16 md:scroll-mt-20", className)}
        >
            {children}
        </section>
    );
};

export default Section;