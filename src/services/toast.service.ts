export const toastService = {
    showToast
};

function showToast(
    setToastProps: (props: { key: number; variant: 'success' | 'destructive'; title: string; description: string; }) => void,
    message: string,
    variant: 'success' | 'destructive'
) {
    const title = variant === 'success' ? "Success! Everything went smoothly." : "Uh oh! Something went wrong.";
    setToastProps({
        key: new Date().getTime(),
        variant: variant,
        title: title,
        description: message,
    });
}
