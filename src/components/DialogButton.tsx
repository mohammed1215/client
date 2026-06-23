import { DialogTrigger } from "./ui/dialog";

const className = {
    yellow: "cursor-pointer rounded-md flex gap-2 text-sm px-2 py-1 hover:scale-105 transition-all items-center font-semibold bg-[var(--button-primary)] disabled:bg-[var(--button-primary)]/90 text-primary-foreground hover:brightness-110",
    dark: "cursor-pointer border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground px-2 py-1 rounded-md hover:scale-105 dark:bg-input/30 dark:border-input dark:hover:bg-input/50 cursor-pointer dark:border-(--border2)! disabled:bg-[var(--button-primary)]/90 text-primary-foreground hover:brightness-110",
};

export const DialogButton = ({
    children,
    variant = "yellow",
}: {
    children: React.ReactNode;
    variant: "yellow" | "dark";
}) => {
    return (
        <DialogTrigger className={className[variant]}>{children}</DialogTrigger>
    );
};
