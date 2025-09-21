import React from 'react';
import * as XLSX from 'xlsx';
import { Table } from '@tanstack/react-table';
import ToastComponent from '../ToastComponent';
import { IconWithTooltip } from '../IconWithTooltip';

interface DownloadToExcelBtnTableProps {
    readonly table: Table<any>;
    readonly excelConfig: {
        fields: {
            key: string;
            header: string;
            formatter?: (value: any) => any;
        }[];
        fileName: string;
    };
}

export function DownloadToExcelBtnTable({ table, excelConfig }: DownloadToExcelBtnTableProps) {
    const [toastProps, setToastProps] = React.useState<{
        key: number;
        variant: 'success' | 'destructive';
        title: string;
        description: string;
    } | null>(null);

    const exportToExcel = async () => {
        const filteredData = table.getFilteredRowModel().rows.map(row => row.original);

        if (!filteredData || filteredData.length === 0) {
            const toastModule = await import('../../../services/toast.service');
            toastModule.toastService.showToast(setToastProps, "There is no data to export", "destructive");
            return;
        }

        const formattedData = filteredData.map(item => {
            const row: { [key: string]: any } = {};  // Declare row with an index signature
            excelConfig.fields.forEach(field => {
                row[field.header] = field.formatter ? field.formatter(item[field.key]) : item[field.key];
            });
            return row;
        });

        const ws = XLSX.utils.json_to_sheet(formattedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Reports');
        XLSX.writeFile(wb, excelConfig.fileName);
    };

    return (
        <>
            <IconWithTooltip iconName='Download' tooltipTitle='Download excel file' onClick={exportToExcel} />
            {toastProps && (
                <ToastComponent
                    key={toastProps.key}
                    variant={toastProps.variant}
                    title={toastProps.title}
                    description={toastProps.description}
                />
            )}
        </>
    );
}
