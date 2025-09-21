"use client"

import * as React from "react"
import { format, parse } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "../../lib/utils"
import { Button } from "../../components/ui/button"
import { Calendar } from "../../components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../../components/ui/popover"



interface DatePickerProps {
    readonly onDateChange: (newDate: string) => void;

    readonly whichComponent: string
    readonly selectedDate: string
}

export function DatePicker({ onDateChange, whichComponent, selectedDate }: DatePickerProps) {
    const [date, setDate] = React.useState<Date>()

    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const handleSelectDate = (newDate: Date | undefined) => {
        if (!newDate) return;
        setDate(newDate);
        setIsPopoverOpen(false);
        onDateChange(format(newDate, "dd/MM/yyyy"));
    };
    const initialDate = selectedDate ? parse(selectedDate, "dd/MM/yyyy", new Date()) : date;


    const handleButtonClick = () => {
        setIsPopoverOpen(true);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    onClick={handleButtonClick}

                    variant={"outline"}
                    className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {initialDate ? format(initialDate, "dd/MM/yyyy") : <span>{whichComponent === "from" ? "From date" : "To date"}</span>}
                </Button>
            </PopoverTrigger>
            {isPopoverOpen && (
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleSelectDate}
                        initialFocus
                    />
                </PopoverContent>)}
        </Popover>
    )
}
