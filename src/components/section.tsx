
const Section = ({ children, id, className }: { children: React.ReactNode, id?: string, className?: string }) => {
    return (
        <section id={id} className={`flex flex-col ${className}`}>{children}</section>
    )
}

export default Section