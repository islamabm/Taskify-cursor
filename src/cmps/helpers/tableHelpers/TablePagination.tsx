import * as React from "react";
import { Table } from '@tanstack/react-table';
import { Button } from "../../../components/ui/button";

interface TablePaginationProps {
    table: Table<any>;
}

const TablePagination = ({ table }: TablePaginationProps) => {
    const paginationState = table.getState().pagination;

    return (
        <div className="flex items-center space-x-2">
            <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
            >
                Prev
            </Button>
            <span>
                Page {paginationState.pageIndex + 1} of {table.getPageCount()}
            </span>
            <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
            >
                Next
            </Button>
        </div>
    );
};

export default TablePagination;
