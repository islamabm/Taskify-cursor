import React, { useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '../../components/ui/alert-dialog';
import { useNavigate } from 'react-router-dom';
import { IconWithTooltip } from './IconWithTooltip';
import ToastComponent from './ToastComponent';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toastService } from '../../services/toast.service';
import { userStatusesService } from '../../services/userStatuses.service';
import { priorityService } from '../../services/priority.service';
import { departmentsService } from '../../services/departments.service';
import { taskTypesService } from '../../services/taskTypes.service';
import { userTypesService } from '../../services/userTypes.service';
import { taskStatusesService } from '../../services/taskStatuses.service';
import { businessService } from '../../services/businesses.service';
import { tasksService } from '../../services/task.service';
import { employeesService } from '../../services/employees.service';
import { navigateService } from '../../services/navigate.service';
import { routeService } from '../../services/route.service';
import { queryKeysService } from '../../services/queryKeys.service';
import { logsService } from '../../services/logs.service';

interface AreYouSureModalProps {
    readonly iconName: string;
    readonly tooltipTitle: string;
    readonly alertDialogTitle: string;
    readonly alertDialogCancelText: string;
    readonly alertDialogActionText: string;
    readonly whichCmp: string;
    readonly usefulVariable?: number;
    readonly usefulVariable2?: number;
    readonly queryOptionalVariable?: string;
}

export function AreYouSureModal({
    iconName,
    tooltipTitle,
    alertDialogTitle,
    alertDialogCancelText,
    alertDialogActionText,
    whichCmp,
    usefulVariable,
    usefulVariable2,
    queryOptionalVariable
}: AreYouSureModalProps) {

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [toastProps, setToastProps] = useState<{
        key: number;
        variant: 'success' | 'destructive';
        title: string;
        description: string;
    } | null>(null);

    const deleteMutation = useMutation({
        mutationFn: (params: { id: number, isDeleted: string, id2: string }) => {
            const { id, isDeleted, id2 } = params;

            console.log("id2", id2)
            switch (whichCmp) {
                case 'employeeStatus':
                    return userStatusesService.deleteUserStatus(id);
                case 'department':
                    return departmentsService.deleteDepartment(id);
                case 'priority':
                    return priorityService.deletePriorityLevel(id);
                case 'sub-department':
                    return departmentsService.deleteDepartment(id);
                case 'task-type':
                    return taskTypesService.deleteTaskType(id);
                case 'user-type':
                    return userTypesService.deleteUserType(id);
                case 'task-status':
                    return taskStatusesService.deleteTaskStatus(id);
                case 'business':
                    return businessService.deleteBusiness(id);
                case 'task':
                    return tasksService.deleteTask(id);
                case 'log':
                    return logsService.deleteLog(id);
                case 'employee':
                    return employeesService.deleteEmployee(id);
                case 'logout':
                    return handleLogout();
                default:
                    throw new Error('Invalid action type');
            }
        },
        onSuccess: (res, variables) => {
            const { id, id2 } = variables; // Access the id from the mutation variables

            // if (res.result === 0) {
            //     toastService.showToast(setToastProps, "There was an issue with your request. Please try again.", "destructive");
            // } else {
            switch (whichCmp) {
                case 'employeeStatus':
                    queryClient.invalidateQueries({ queryKey: [queryKeysService.USER_STATUSES] });
                    toastService.showToast(setToastProps, "Status deleted successfully", 'success');
                    break;
                case 'priority':
                    queryClient.invalidateQueries({ queryKey: [queryKeysService.PRIORITY_LEVELS] });
                    toastService.showToast(setToastProps, "Priority level deleted successfully", 'success');
                    break;
                case 'department':
                    queryClient.invalidateQueries({ queryKey: [queryKeysService.DEPARTMENTS] });
                    toastService.showToast(setToastProps, "Department deleted successfully", 'success');
                    break;
                case 'sub-department':
                    queryClient.invalidateQueries({ queryKey: [queryKeysService.SUB_DEPARTMENTS, queryOptionalVariable + ""] });
                    toastService.showToast(setToastProps, "Department deleted successfully", 'success');
                    break;
                case 'task-type':
                    queryClient.invalidateQueries({ queryKey: [queryKeysService.TASK_TYPES] });
                    toastService.showToast(setToastProps, "Task type deleted successfully", 'success');
                    break;
                case 'user-type':
                    queryClient.invalidateQueries({ queryKey: [queryKeysService.USER_TYPES] });
                    toastService.showToast(setToastProps, "User type deleted successfully", 'success');
                    break;
                case 'task-status':
                    queryClient.invalidateQueries({ queryKey: [queryKeysService.TASK_STATUSES] });
                    toastService.showToast(setToastProps, "Task status deleted successfully", 'success');
                    break;
                case 'business':
                    queryClient.invalidateQueries({ queryKey: [queryKeysService.BUSINESSES] });
                    toastService.showToast(setToastProps, "Business deleted successfully", 'success');
                    break;
                case 'task':
                    queryClient.invalidateQueries({ queryKey: [queryKeysService.TASKS] });
                    queryClient.invalidateQueries({ queryKey: [queryKeysService.TICKET, id + ""] }); // Use the id here
                    toastService.showToast(setToastProps, "Task deleted successfully", 'success');
                    navigateService.handleNavigation(navigate, routeService.TASKS);
                    break;
                case 'log':
                    // queryKeysService.TICKET, selectedTicketID
                    queryClient.invalidateQueries({ queryKey: [queryKeysService.TICKET, id2] }); // Use the id here
                    queryClient.invalidateQueries({ queryKey: [queryKeysService.TICKET, id2 + ""] }); // Use the id here
                    queryClient.invalidateQueries({ queryKey: [queryKeysService.WORK_LOGS_BY_TICKET_ID, id2 + ""] }); // Use the id here
                    // queryClient.invalidateQueries({ queryKey: [queryKeysService.WORK_LOGS_BY_TICKET_ID, id2] }); // Use the id here
                    toastService.showToast(setToastProps, "Task deleted successfully", 'success');
                    // navigateService.handleNavigation(navigate, routeService.TASKS);
                    break;
                case 'employee':
                    queryClient.invalidateQueries({ queryKey: [queryKeysService.USERS] });
                    toastService.showToast(setToastProps, "Employee deleted successfully", 'success');
                    break;
                default:
                    break;
            }
            // }
        },
        onError: (res) => {
            toastService.showToast(setToastProps, `There was an issue with your request. ${res.message}`, 'destructive');
        },
    });

    const handleAction = async () => {
        if (!usefulVariable) {
            toastService.showToast(setToastProps, 'There was an issue with your request. Please try again', 'destructive');
            throw new Error('ID is required');
        }
        if (usefulVariable2 === 9 && whichCmp === 'task') {
            toastService.showToast(setToastProps, 'Cannot delete task while in progress', 'destructive');
            return
        }
        deleteMutation.mutate({ id: usefulVariable, isDeleted: '1', id2: usefulVariable2 });
        // deleteMutation.mutate({ id: usefulVariable, isDeleted: '1', id2: usefulVariable2 });
    };

    const handleLogout = async () => {
        try {
            const storageModule = await import('../../services/storage.service');
            const navigateModule = await import('../../services/navigate.service');
            const routeModule = await import('../../services/route.service');

            storageModule.storageService.remove('USERTYPEID_TASKIFY', false);
            storageModule.storageService.remove('TOKEN_TASKIFY', false);
            storageModule.storageService.remove('fullName_TASKIFY', false);

            // loginService.logout()
            // 
            navigateModule.navigateService.handleNavigation(navigate, routeModule.routeService.LOGIN);
        } catch (error) {
            console.error('Failed to logout', error);
        }
    };

    return (
        <div>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <IconWithTooltip iconName={iconName} tooltipTitle={tooltipTitle} />
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{alertDialogTitle}</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{alertDialogCancelText}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleAction}>{alertDialogActionText}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            {toastProps && (
                <ToastComponent
                    key={toastProps.key}
                    variant={toastProps.variant}
                    title={toastProps.title}
                    description={toastProps.description}
                />
            )}
        </div>
    );
}
