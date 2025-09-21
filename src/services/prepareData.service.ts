type DataMapper<T> = {
    itemValueKey: keyof T;
    itemTextKey: keyof T;
};

export function prepareDataToRender<T extends Record<string, any>>(
    data: { data: T[] } | null | undefined,
    mapper: DataMapper<T>
): { itemValue: string | number; itemText: string }[] {
    if (!data || !data.data) return [];

    return data.data.map((item) => ({
        itemValue: item[mapper.itemValueKey] as string | number,
        itemText: item[mapper.itemTextKey] as string,
    }));
}
