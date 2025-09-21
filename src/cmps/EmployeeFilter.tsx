import React from 'react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select";

export default function EmployeeFilter({ employees, selectedEmployees, onChange }) {
    const sortedEmployees = employees.sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div className="w-full md:w-96 mb-6">
            <Select
                value={selectedEmployees.length === 0 ? "all" : selectedEmployees.join(",")}
                onValueChange={(value) => {
                    if (value === "all") {
                        onChange([]);
                    } else {
                        onChange(value.split(","));
                    }
                }}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Filter employees..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value="all">All Employees</SelectItem>
                        {sortedEmployees.map(emp => (
                            <SelectItem key={emp.id} value={emp.id}>
                                {emp.name}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
}