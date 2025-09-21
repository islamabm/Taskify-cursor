export function getLandingPageData() {
    const badges = [
        'Tasks Management',
        'Employee Scheduling',
        'Real-Time Updates',
        'Reports & Analytics',
    ];

    const features = [
        'Keep all your tasks in one place with dynamic task boards that allow for effortless tracking and updating. Visualize workflows with customizable Kanban boards that reflect different stages of your tasks.',
        'Manage tasks with real-time updates and status indicators to ensure everyone on your team stays informed about project progress. Alerts and notifications keep the team aligned, reducing the chances of tasks falling through the cracks.',
        'Streamline processes with automated task assignment and notifications, which help in reducing manual entries and errors. Automate routine tasks to save time and focus on more strategic activities that add value to your business operations.',
        'Enhance collaboration across teams by allowing multiple users to view and modify tasks simultaneously. Integrated communication tools enable team members to discuss and solve issues directly within the platform.',
        'Generate comprehensive reports and gain insights into task performance, workload distribution, and team productivity.',
    ];

    const featuresData = [
        {
            title: 'Employee & Department Management',
            description:
                'Efficiently manage departmental structures and employee roles with our intuitive interfaces.',
            imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0',
            altText: 'Task Management Dashboard',
        },
        {
            title: 'Real-Time Working and Monitoring',
            description:
                'Monitor the workflow in real-time, assess employee availability, and manage work pauses or downtime effectively.',
            imageUrl:
                'https://haatdaas.lan-wan.net/partnerMsg/images/Real-TimeWorkingandMonitoring.jpg',
            altText: 'Real-Time Collaboration',
        },
        {
            title: 'Analytics & Reporting',
            description:
                'Utilize comprehensive analytics tools to generate actionable insights and improve team performance.',
            imageUrl: 'https://haatdaas.lan-wan.net/partnerMsg/images/AnalyticsAndReporting.jpg',
            altText: 'Analytics Dashboard',
        },
        {
            title: 'Project Timeline and Milestones',
            description:
                'Track project progress with detailed timelines and milestones. Stay updated with each phase of the project.',
            imageUrl: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335',
            altText: 'Project Timeline',
        },
        {
            title: 'Automated Email Notifications for Task Updates',
            description:
                'Keep everyone informed with automated email notifications. Receive emails when tasks are added or completed.',
            imageUrl: 'https://haatdaas.lan-wan.net/partnerMsg/images/Email Notifications.jpg',
            altText: 'Email Notifications',
        },
    ];

    return {
        badges,
        features,
        featuresData,
    };
}