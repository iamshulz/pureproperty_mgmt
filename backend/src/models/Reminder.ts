export interface Reminder {
    id: string;
    agentId: string;
    propertId: string;
    eventDate: string;
    isCompleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}